import slugify from "slugify";
import { parseDocument, stringify } from "yaml";
import { isIndexableBlogEntry, isPublishedBlogEntry, isSitemapExcluded } from "./app/utils/blog-indexability";
import { removeAeoLink } from "./app/utils/aeo-markdown";
import { SITE } from "./app/data/site";
import { normalizeSiteUrl } from "./app/utils/site-url";

// Valider la valeur brute avant que nuxt-site-config ne la normalise est indispensable :
// le module transforme notamment une URL relative en origin absolue, ce qui masquerait
// une configuration invalide. Docker et la CI fournissent toujours les trois variables.
type NodeFileSystem = {
  existsSync(path: string): boolean;
  mkdirSync(path: string, options: { recursive: true }): void;
  readFileSync(path: string, encoding: "utf8"): string;
  readdirSync(
    path: string,
    options: { withFileTypes: true },
  ): Array<{
    name: string;
    isDirectory(): boolean;
    isFile(): boolean;
  }>;
  writeFileSync(path: string, data: string, encoding: "utf8"): void;
  rmSync(path: string, options: { recursive: boolean; force: boolean }): void;
};
type NodePathModule = {
  dirname(path: string): string;
  relative(from: string, to: string): string;
  resolve(...paths: string[]): string;
};
type NodeProcess = {
  env?: Record<string, string | undefined>;
  cwd(): string;
  getBuiltinModule(id: "fs"): NodeFileSystem;
  getBuiltinModule(id: "path"): NodePathModule;
};

const nodeProcess = (globalThis as typeof globalThis & { process?: NodeProcess }).process;
const nodeEnv = nodeProcess?.env;
if (!nodeProcess) {
  throw new Error("[site-url] Environnement Node.js requis pour initialiser la configuration Nuxt.");
}
const nodeFileSystem = nodeProcess.getBuiltinModule("fs");
const nodePath = nodeProcess.getBuiltinModule("path");
const rawSiteUrl = nodeEnv?.NUXT_SITE_URL;
const rawSiteName = nodeEnv?.NUXT_SITE_NAME;
const rawSiteEnv = nodeEnv?.NUXT_SITE_ENV;
if (rawSiteUrl === undefined) {
  throw new Error("[site-url] NUXT_SITE_URL est requis. Utiliser .env.example comme référence.");
}
if (rawSiteName === undefined || rawSiteEnv === undefined) {
  throw new Error("[site-config] NUXT_SITE_NAME et NUXT_SITE_ENV sont requis. Utiliser .env.example comme référence.");
}
const canonicalSiteUrl = normalizeSiteUrl(rawSiteUrl);

type SeoContentRouteState = {
  prerender: boolean;
  indexable: boolean;
  source?: string;
};

const SEO_ROUTE_CACHE_VERSION = 1;

const projectDirectory = nodeProcess.cwd();
const seoRouteCachePath = nodePath.resolve(projectDirectory, ".data/content/seo-routes.json");
const contentRouteState = new Map<string, SeoContentRouteState>();
const contentSourcePathByRoute = new Map<string, string>();

/**
 * Nettoyage post-conversion limité aux blocs décoratifs du terminal.
 *
 * Le filtre mdream est appliqué à la conversion HTML, mais le hook de finalisation
 * est le point stable pour les routes prérendues. Les marqueurs sont volontairement
 * associés à la route concernée afin de ne pas supprimer du contenu éditorial qui
 * mentionnerait simplement un mot dans une page de services ou de confidentialité.
 */
function sanitizeAiReadyMarkdown(route: string, markdown: string): string {
  let sanitized = markdown;

  if (route === "/") {
    sanitized = sanitized.replace(
      /\n+anon\.@[^:\n]+:[^\n]*\n[\s\S]*?\n\/\/ ce que je propose\n/u,
      "\n\n// ce que je propose\n",
    );
    sanitized = sanitized.replace(/\n+\*\*Automatisation\*\*✦[^\n]*\n/u, "\n");
  }

  if (route === "/contact") {
    sanitized = sanitized.replace(/\n+anon\.@[^:\n]+:.*\n(?:Vous préférez[^\n]*\n)?\n?/u, "\n");
    sanitized = sanitized.replace(/## Coordonnées et terminal/u, "## Coordonnées");
    sanitized = sanitized.replace(/\n+Vous préférez la ligne de commande \? Ouvrez le terminal\.\n/u, "\n");
  }

  return sanitized;
}

/**
 * Découpe `llms-full.txt` sur les séparateurs de page AI Ready, jamais sur
 * un simple filet Markdown `---` qui pourrait appartenir au corps d'un article.
 */
function splitAiReadyFullSections(text: string): string[] {
  const lines = text.split("\n");
  const sections: string[] = [];
  let current: string[] = [];
  let fenceMarker: string | undefined;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const fence = line.match(/^\s*(`{3,}|~{3,})/u)?.[1];
    if (fence) {
      if (!fenceMarker) {
        fenceMarker = fence[0];
      } else if (fence[0] === fenceMarker) {
        fenceMarker = undefined;
      }
    }

    const isPageSeparator =
      !fenceMarker &&
      line === "---" &&
      lines[index + 1] === "" &&
      /^- \*\*Page:\*\* /u.test(lines[index + 2] ?? "") &&
      /^- \*\*Source:\*\* https?:\/\/\S+/u.test(lines[index + 3] ?? "");
    if (isPageSeparator) {
      sections.push(current.join("\n"));
      current = [];
      index += 1;
      continue;
    }

    current.push(line);
  }

  sections.push(current.join("\n"));
  return sections;
}

function parseFrontmatter(source: string): Record<string, unknown> | undefined {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/u);
  if (!match) {
    return undefined;
  }

  try {
    const parsed = parseDocument(match[1] ?? "").toJS();
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Complète le frontmatter Markdown d'un article avec les champs éditoriaux
 * exposés par la collection Content. AI Ready sérialise le corps source et ses
 * métadonnées principales, mais ne copie pas automatiquement ces champs de
 * présentation ; on les ajoute une seule fois, sans réécrire le corps Markdown.
 */
function enrichAiReadyArticleFrontmatter(route: string, markdown: string): string {
  if (!route.startsWith("/blog/")) {
    return markdown;
  }

  const mappedSource = contentSourcePathByRoute.get(route);
  const sourcePath = [
    ...(mappedSource ? [nodePath.resolve(projectDirectory, mappedSource)] : []),
    nodePath.resolve(projectDirectory, "content", `.${route}.md`),
    nodePath.resolve(projectDirectory, "content", `.${route}/index.md`),
  ].find((candidate) => nodeFileSystem.existsSync(candidate));
  if (!sourcePath) {
    return markdown;
  }

  const sourceData = parseFrontmatter(nodeFileSystem.readFileSync(sourcePath, "utf8"));
  const generatedData = parseFrontmatter(markdown);
  if (!sourceData || !generatedData) {
    return markdown;
  }

  const fields = ["date", "updated", "tags", "image", "read"];
  let changed = false;
  for (const field of fields) {
    if (!Object.hasOwn(generatedData, field) && Object.hasOwn(sourceData, field)) {
      generatedData[field] = sourceData[field];
      changed = true;
    }
  }

  if (Object.hasOwn(generatedData, "updatedAt")) {
    if (sourceData.updated === undefined) {
      delete generatedData.updatedAt;
    } else {
      generatedData.updatedAt = sourceData.updated;
    }
    changed = true;
  }

  if (!changed) {
    return markdown;
  }

  const frontmatter = stringify(generatedData).trimEnd();
  return markdown.replace(/^---\n[\s\S]*?\n---/u, `---\n${frontmatter}\n---`);
}

function localizeAiReadyArtifacts(publicDir: string, siteName: string): void {
  const replacements: Array<[RegExp, string]> = [
    [/^## LLM Resources$/gmu, "## Ressources LLM"],
    [/^Canonical Origin:/gmu, "Origine canonique :"],
    [/^\*\*Notes:\*\*$/gmu, "**Notes :**"],
    [/^All pages in Markdown format\.$/gmu, "Toutes les pages au format Markdown."],
    [/^## Root$/gmu, "## Racine"],
    [
      /^## Sitemap\n\nSee the full \[sitemap\]\(\/sitemap\.md\) for all pages\.$/gmu,
      "## Plan du site\n\nVoir le [plan du site complet](/sitemap.md) pour toutes les pages.",
    ],
    [/^See the full sitemap in Markdown format\.$/gmu, "Voir le plan du site complet au format Markdown."],
    [
      /^- \[Full Content\]\(([^)]+)\): Complete page content in markdown format\.$/gmu,
      "- [Contenu complet]($1) : Contenu complet des pages au format Markdown.",
    ],
    [
      /^- \[sitemap\.xml\]\(([^)]+)\): XML sitemap for search engines and crawlers\.$/gmu,
      "- [sitemap.xml]($1) : Sitemap XML pour les moteurs de recherche et les robots.",
    ],
    [
      /^- \[robots\.txt\]\(([^)]+)\): Crawler rules and permissions\.$/gmu,
      "- [robots.txt]($1) : Règles et permissions pour les robots.",
    ],
    [/^- \*\*Page:\*\* /gmu, "- **Page :** "],
    [/^- \*\*Source:\*\* /gmu, "- **Source :** "],
    [/^- \*\*Description:\*\* /gmu, "- **Description :** "],
  ];

  const localize = (text: string, isSitemap = false): string => {
    let result = isSitemap ? text.replace(/^# .* Sitemap$/gmu, `# ${siteName} — Plan du site`) : text;
    for (const [pattern, replacement] of replacements) {
      result = result.replace(pattern, replacement);
    }
    return result;
  };

  const localizeFile = (filePath: string, isSitemap = false): void => {
    if (!nodeFileSystem.existsSync(filePath)) {
      return;
    }
    const source = nodeFileSystem.readFileSync(filePath, "utf8");
    const localized = localize(source, isSitemap);
    if (localized !== source) {
      nodeFileSystem.writeFileSync(filePath, localized, "utf8");
    }
  };

  for (const fileName of ["llms.txt", "llms-full.txt", "sitemap.md"]) {
    localizeFile(nodePath.resolve(publicDir, fileName), fileName === "sitemap.md");
  }

  const visit = (directory: string): void => {
    for (const entry of nodeFileSystem.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = nodePath.resolve(directory, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        localizeFile(fullPath);
      }
    }
  };
  visit(publicDir);
}

/**
 * Retire les routes noindex des exports AI après leur génération statique.
 *
 * AI Ready indexe toutes les pages HTML prérendues, y compris une page Content
 * volontairement noindexée qui reste accessible directement. Le sitemap les exclut
 * déjà ; cette passe évite néanmoins de les publier dans les artefacts AEO.
 */
function removeNonIndexableAiReadyArtifacts(publicDir: string, routes: Set<string>, origin: string): void {
  if (routes.size === 0) {
    return;
  }

  const markdownPath = (route: string): string => (route === "/" ? "/index.md" : `${route}.md`);

  for (const route of routes) {
    const mdPath = markdownPath(route);
    const markdownFile = nodePath.resolve(publicDir, `.${mdPath}`);
    nodeFileSystem.rmSync(markdownFile, { recursive: false, force: true });

    const htmlRelativePath = route === "/" ? "index.html" : `${route.replace(/^\//u, "")}/index.html`;
    const htmlFile = nodePath.resolve(publicDir, htmlRelativePath);
    if (nodeFileSystem.existsSync(htmlFile)) {
      const html = nodeFileSystem.readFileSync(htmlFile, "utf8");
      const cleaned = removeAeoLink(removeAeoLink(html, "alternate", mdPath), "describedby", "/llms.txt");
      if (cleaned !== html) {
        nodeFileSystem.writeFileSync(htmlFile, cleaned, "utf8");
      }
    }
  }

  const cleanLinkList = (fileName: string): void => {
    const filePath = nodePath.resolve(publicDir, fileName);
    if (!nodeFileSystem.existsSync(filePath)) {
      return;
    }
    const text = nodeFileSystem.readFileSync(filePath, "utf8");
    const filtered = text
      .split("\n")
      .map((line) =>
        line.replace(/(!?\[[^\]]*\]\()([^)\s]+)([^)]*\))/gu, (full, prefix: string, href: string, suffix: string) => {
          let target = href.split(/[?#]/u, 1)[0] ?? "";
          try {
            target = /^https?:\/\//iu.test(target) ? new URL(target).pathname : target;
            target = decodeURIComponent(target);
          } catch {
            return full;
          }
          const route = target.replace(/\.md$/u, "").replace(/\/+$/u, "") || "/";
          return routes.has(route) ? "" : `${prefix}${href}${suffix}`;
        }),
      )
      .filter((line) => !/^\s*[-*+]\s*$/u.test(line))
      .join("\n");
    if (filtered !== text) {
      nodeFileSystem.writeFileSync(filePath, filtered, "utf8");
    }
  };

  cleanLinkList("llms.txt");
  cleanLinkList("sitemap.md");

  const fullPath = nodePath.resolve(publicDir, "llms-full.txt");
  if (nodeFileSystem.existsSync(fullPath)) {
    const text = nodeFileSystem.readFileSync(fullPath, "utf8");
    const filteredSections = splitAiReadyFullSections(text).filter((section, index) => {
      // La première section contient l'en-tête global du fichier. Toute section
      // de page sans Source est invalide et doit être retirée par défaut.
      if (index === 0) {
        return true;
      }
      const source = section.match(/\*\*Source:\*\*\s+(https?:\/\/[^\s)]+)/u)?.[1];
      if (!source) {
        return false;
      }
      try {
        const sourcePath = new URL(source).pathname.replace(/\/+$/u, "") || "/";
        return !routes.has(sourcePath);
      } catch {
        return !routes.has(source.replace(`${origin}`, "").replace(/\/+$/u, "") || "/");
      }
    });
    const filtered = filteredSections.join("\n---\n");
    if (filtered !== text) {
      nodeFileSystem.writeFileSync(fullPath, filtered, "utf8");
    }
  }
}

function contentFileExists(path: string, source?: string): boolean {
  if (path === "/blog") {
    return false;
  }
  if (source) {
    return nodeFileSystem.existsSync(nodePath.resolve(projectDirectory, source));
  }
  return (
    nodeFileSystem.existsSync(nodePath.resolve(projectDirectory, "content", `.${path}.md`)) ||
    nodeFileSystem.existsSync(nodePath.resolve(projectDirectory, "content", `.${path}/index.md`))
  );
}

function readContentFrontmatter(source: string): Record<string, unknown> | undefined {
  return parseFrontmatter(source);
}

function contentRouteFromFile(relativePath: string): string | undefined {
  const withoutExtension = relativePath.replace(/\.md$/u, "");
  const parts = withoutExtension.split("/").filter(Boolean);
  if (parts.at(-1) === "index") {
    parts.pop();
  }
  if (parts[0] !== "blog" || parts.length === 0) {
    return undefined;
  }

  const canonicalParts = parts.map((part) => slugify(part, { lower: true }));
  if (canonicalParts.some((part) => !part)) {
    return undefined;
  }
  return `/${canonicalParts.join("/")}`;
}

/**
 * Recalcule l'état des routes Content depuis les fichiers présents.
 *
 * Le cache SQLite peut réutiliser une entrée parsée sans rejouer
 * `content:file:afterParse` ; la lecture du frontmatter évite qu'une fixture
 * inchangée, une date future devenue passée ou une exclusion robots soit
 * conservée dans un état de prérendu obsolète.
 */
function scanContentRouteState(): void {
  const contentRoot = nodePath.resolve(projectDirectory, "content");
  const scannedRoutes = new Set<string>();
  const visit = (directory: string): void => {
    for (const entry of nodeFileSystem.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = nodePath.resolve(directory, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".md")) {
        continue;
      }
      const relativePath = fullPath.slice(contentRoot.length + 1);
      if (relativePath === "blog/index.md") {
        throw new Error("[content] content/blog/index.md est réservé à la route Vue /blog.");
      }
      const route = contentRouteFromFile(relativePath);
      if (!route) {
        continue;
      }
      scannedRoutes.add(route);

      const sourcePath = nodePath.relative(projectDirectory, fullPath);
      const existing = contentRouteState.get(route);
      if (existing?.source && existing.source !== sourcePath) {
        throw new Error(`[content] Collision de route Content : ${route} (${existing.source} et ${sourcePath}).`);
      }

      const source = nodeFileSystem.readFileSync(fullPath, "utf8");
      const metadata = readContentFrontmatter(source);
      if (!metadata || !isPublishedBlogEntry(metadata)) {
        contentRouteState.delete(route);
        contentSourcePathByRoute.delete(route);
        continue;
      }

      const sitemapExcluded = isSitemapExcluded(metadata);
      contentRouteState.set(route, {
        prerender: !sitemapExcluded,
        indexable: !sitemapExcluded && isIndexableBlogEntry(metadata),
        source: sourcePath,
      });
      contentSourcePathByRoute.set(route, sourcePath);
    }
  };

  try {
    visit(contentRoot);
    for (const route of contentRouteState.keys()) {
      if (!scannedRoutes.has(route)) {
        contentRouteState.delete(route);
        contentSourcePathByRoute.delete(route);
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("[content]")) {
      throw error;
    }
    // Le module Content signalera une collection absente ou invalide plus tard.
  }
}

try {
  const cache = JSON.parse(nodeFileSystem.readFileSync(seoRouteCachePath, "utf8")) as {
    version?: unknown;
    routes?: unknown;
  };
  if (cache.version === SEO_ROUTE_CACHE_VERSION && Array.isArray(cache.routes)) {
    for (const route of cache.routes) {
      if (
        route &&
        typeof route === "object" &&
        "path" in route &&
        typeof route.path === "string" &&
        "prerender" in route &&
        typeof route.prerender === "boolean" &&
        "indexable" in route &&
        typeof route.indexable === "boolean"
      ) {
        const source = "source" in route && typeof route.source === "string" ? route.source : undefined;
        if (contentFileExists(route.path, source)) {
          contentRouteState.set(route.path, {
            prerender: route.prerender,
            indexable: route.indexable,
            source,
          });
          if (source) {
            contentSourcePathByRoute.set(route.path, source);
          }
        }
      }
    }
  }
} catch {
  // Absence de cache ou format obsolète : @nuxt/content repeint l'état au build courant.
}
scanContentRouteState();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "..::<sj />::..",
      htmlAttrs: {
        lang: "fr",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        // Ubuntu sans (corps long) — Google Fonts via <link> (pas d'@import SCSS, cf. règle projet).
        // Ubuntu Mono reste self-hosted (abstract/_fonts.scss).
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap",
        },
      ],
      meta: [
        {
          name: "description",
          content:
            "Développeur Fullstack et Testeur/QA freelance passionné par la création de solutions web performantes." +
            " Discutons de votre projet.",
        },
      ],
      script: [
        {
          type: "text/javascript",
          innerHTML:
            "(function(){try{var stored=localStorage.getItem('jouan_theme_mode');var pref=(stored==='dark'||stored==='light'||stored==='system')?stored:'system';var isDark=pref==='dark'||(pref==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);var resolved=isDark?'dark':'light';document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);document.documentElement.style.colorScheme=resolved;}catch(e){var fallback=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';document.documentElement.setAttribute('data-theme',fallback);document.documentElement.setAttribute('data-theme-source','system');document.documentElement.style.colorScheme=fallback;}})();",
        },
      ],
    },
  },
  css: ["@/assets/scss/main.scss"],
  // Sitemap et Robots doivent précéder Content v3 pour l'intégration officielle.
  modules: ["@nuxtjs/sitemap", "@nuxtjs/robots", "@nuxt/content", "nuxt-ai-ready", "@nuxt/image", "@nuxt/eslint"],
  // Source Site Config unique : l'origine, le nom et l'environnement restent pilotés
  // par les variables injectées par Docker et la CI. Aucun domaine n'est codé en dur.
  site: {
    url: canonicalSiteUrl,
    name: rawSiteName,
    env: rawSiteEnv,
    description: `${SITE.profile.role}. ${SITE.profile.name} conçoit des applications et workflows fiables.`,
  },
  // AEO statique : génération au build uniquement, sans serveur MCP, WebMCP,
  // synchronisation runtime, cron, base persistante ou négociation de contenu.
  aiReady: {
    contentSource: true,
    contentNegotiation: false,
    database: false,
    runtimeSync: false,
    cron: false,
    mcp: {
      tools: false,
      resources: false,
    },
    webmcp: false,
    apiCatalog: false,
    agentSkills: false,
    contentSignal: false,
    mdreamOptions: {
      minimal: true,
      clean: true,
    },
    llmsTxt: {
      markdownLinks: true,
      notes: [
        `Présentation publique en français de ${rawSiteName} : portfolio, services et articles de ${SITE.profile.name} sur les systèmes IA et l’automatisation métier.`,
        "Les liens Markdown sont des représentations statiques de contenus publics ; ils ne garantissent ni classement, ni citation, ni visibilité dans une réponse ChatGPT.",
        "Les valeurs de formulaire, clés, cookies de session, scripts analytics, terminaux et contenus privés ne font pas partie des exports AEO.",
      ],
    },
    sitemapMd: true,
    describedby: true,
    // Le fichier est produit une fois par build ; aucun cache runtime ne doit
    // conserver une liste de pages issue d'une génération précédente.
    llmsTxtCacheSeconds: 0,
  },
  // @nuxt/content : coloration syntaxique Shiki désactivée. Le DS rend le code en
  // palette terminale UNIFORME (mono off-white sur fond aubergine, vert pour l'inline,
  // cf. kit.css .article .prose pre/code) — pas de multicolore par token, qui injecterait
  // des styles inline écrasant les tokens. Les blocs rendent en <pre><code> nu, stylés en SCSS.
  content: {
    build: {
      markdown: {
        highlight: false,
      },
    },
  },
  // Primitives DS dans components/ui/ auto-importées sans préfixe de dossier
  // (<ZButton> et non <UiZButton>). Le reste de components/ garde le scan par défaut.
  components: [{ path: "~/components/ui", pathPrefix: false }, "~/components"],
  ssr: true,
  // Config exposée au client. La clé d'accès Web3Forms (envoi du formulaire /contact)
  // n'est JAMAIS en dur : fournie par l'env NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY (cf.
  // .env.example). Vide par défaut → le formulaire bascule sur son état d'erreur.
  runtimeConfig: {
    public: {
      web3formsAccessKey: "",
      // PostHog Cloud EU — analytics client & Session Replay (Epic 14). Clés jamais
      // en dur : fournies par NUXT_PUBLIC_POSTHOG_KEY / NUXT_PUBLIC_POSTHOG_HOST
      // (cf. .env.example). posthogKey vide → plugin inactif (aucun appel réseau).
      posthogKey: "",
      posthogHost: "https://eu.i.posthog.com",
    },
  },
  // Structure Nuxt 4 par défaut : code applicatif sous app/ (srcDir = "app").
  experimental: {
    payloadExtraction: false,
  },
  // Flat config gérée par @nuxt/eslint ; on laisse Prettier formater (stylistic off).
  eslint: {
    config: {
      stylistic: false,
    },
  },
  sitemap: {
    // Le site est entièrement statique : aucune génération de sitemap au runtime GitHub Pages.
    zeroRuntime: true,
    // Les dates proviennent uniquement du contenu ; aucune date de build uniforme.
    autoLastmod: false,
    // AI Ready ne doit jamais publier ses routes de diagnostic, de synchronisation
    // ou de WebMCP dans l'index public. Elles restent absentes en mode statique.
    exclude: ["/_**", "/__ai-ready/**", "/__nuxt-ai-ready/**", "/_ipx/**", "/api/**"],
    // Les routes noindex restent prérendues puis retirées du sitemap fusionné ;
    // les entrées sitemap:false/null ne sont ni prérendues ni découvertes.
  },
  robots: {
    // Politique OpenAI indépendante : la recherche ChatGPT est autorisée, tandis
    // que l'entraînement via GPTBot est bloqué. Aucun blockAiBots global n'est utilisé.
    groups: [
      { userAgent: ["*"], allow: ["/"], disallow: [] },
      { userAgent: ["OAI-SearchBot"], allow: ["/"], disallow: [] },
      { userAgent: ["GPTBot"], allow: [], disallow: ["/"] },
    ],
    credits: false,
  },
  hooks: {
    "ai-ready:page:markdown"(context) {
      context.markdown = enrichAiReadyArticleFrontmatter(
        context.route,
        sanitizeAiReadyMarkdown(context.route, context.markdown),
      );
    },
    // Les articles noindex restent publics et prérendus avec leur meta robots ; les
    // entrées explicitement exclues du sitemap ne le sont pas. Le plugin
    // `server/plugins/seo-content.ts` retire les routes noindex de la source app.
    "content:file:afterParse"(context) {
      if (context.collection?.name !== "blog") {
        return;
      }
      const path = context.content.path;
      if (typeof path !== "string") {
        return;
      }
      const normalizedPath = path.replace(/\/+$/, "") || "/";
      if (normalizedPath === "/blog") {
        throw new Error("[content] La route /blog est réservée à la page Vue du blog.");
      }
      if (
        typeof context.content.sitemap === "object" &&
        context.content.sitemap !== null &&
        "loc" in context.content.sitemap &&
        context.content.sitemap.loc !== undefined
      ) {
        throw new Error("[content] sitemap.loc est interdit pour le blog.");
      }

      const source =
        typeof context.file.path === "string"
          ? nodePath.relative(projectDirectory, nodePath.resolve(projectDirectory, context.file.path))
          : undefined;
      const existing = contentRouteState.get(normalizedPath);
      if (existing?.source && source && existing.source !== source) {
        throw new Error(`[content] Collision de route Content : ${normalizedPath}.`);
      }
      if (source) {
        contentSourcePathByRoute.set(normalizedPath, source);
      }

      // `updated` est la seule date éditoriale ; `updatedAt` reste un alias
      // interne dérivé et ne peut pas survivre à une modification de `updated`.
      if (typeof context.content.updated === "string") {
        context.content.updatedAt = context.content.updated;
      } else {
        delete context.content.updatedAt;
      }

      if (!isPublishedBlogEntry(context.content)) {
        contentRouteState.delete(normalizedPath);
        return;
      }
      const sitemapExcluded = isSitemapExcluded(context.content);
      contentRouteState.set(normalizedPath, {
        prerender: !sitemapExcluded,
        indexable: !sitemapExcluded && isIndexableBlogEntry(context.content),
        source,
      });
    },
    "nitro:config"(nitroConfig) {
      const contentPrerenderRoutes = new Set<string>();
      const excludedPrerenderRoutes = new Set<string>();
      const nonIndexableContentRoutes = new Set<string>();
      for (const [path, state] of contentRouteState) {
        if (state.prerender) {
          contentPrerenderRoutes.add(path);
        } else {
          excludedPrerenderRoutes.add(path);
        }
        if (!state.indexable) {
          nonIndexableContentRoutes.add(path);
        }
      }

      nitroConfig.prerender ??= {};
      const normalizeRoute = (route: string): string => route.replace(/\/+$/u, "") || "/";
      nitroConfig.prerender.routes = [
        ...new Set(
          [...(nitroConfig.prerender.routes ?? []), ...contentPrerenderRoutes].filter(
            (route): route is string =>
              typeof route === "string" && !excludedPrerenderRoutes.has(normalizeRoute(route)),
          ),
        ),
      ];
      nitroConfig.prerender.ignore = [
        ...new Set([...(nitroConfig.prerender.ignore ?? []), ...excludedPrerenderRoutes]),
      ];
      nitroConfig.runtimeConfig ??= {};
      nitroConfig.runtimeConfig.seoNonIndexableContentRoutes = [...nonIndexableContentRoutes];

      nodeFileSystem.mkdirSync(nodePath.dirname(seoRouteCachePath), { recursive: true });
      nodeFileSystem.writeFileSync(
        seoRouteCachePath,
        `${JSON.stringify(
          {
            version: SEO_ROUTE_CACHE_VERSION,
            routes: [...contentRouteState].map(([path, state]) => ({ path, ...state })),
          },
          null,
          2,
        )}\n`,
        "utf8",
      );
    },
    "nitro:build:before"(nitro) {
      // AI Ready réutilise sinon `.nuxt/.data/ai-ready/build.db` entre deux
      // générations : une fixture supprimée pourrait rester dans les dumps et
      // réapparaître dans llms.txt au build suivant.
      const aiReadyBuildDbPath = nodePath.resolve(nitro.options.buildDir, ".data/ai-ready/build.db");
      nodeFileSystem.rmSync(aiReadyBuildDbPath, { recursive: false, force: true });

      // Les dumps publics ne sont pas nécessaires sur GitHub Pages et exposeraient un
      // index technique : ce hook s'exécute après l'écriture du module, uniquement en
      // génération statique, puis supprime ce répertoire avant publication.
      if (nitro.options.static) {
        nitro.hooks.hook("prerender:done", () => {
          const publicDir = nitro.options.output.publicDir;
          const nonIndexableRoutes = new Set(
            [...contentRouteState].filter(([, state]) => !state.indexable).map(([route]) => route),
          );
          removeNonIndexableAiReadyArtifacts(publicDir, nonIndexableRoutes, canonicalSiteUrl);
          localizeAiReadyArtifacts(publicDir, rawSiteName ?? canonicalSiteUrl);
          nodeFileSystem.rmSync(nodePath.resolve(publicDir, "__ai-ready"), {
            recursive: true,
            force: true,
          });
          // Le dump SQLite de Content est une route technique non liée ; le
          // supprimer évite d'exposer un index de contenu par une URL publique.
          nodeFileSystem.rmSync(nodePath.resolve(publicDir, "__nuxt_content/blog/sql_dump.txt"), {
            recursive: true,
            force: true,
          });
        });
      }
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
});
