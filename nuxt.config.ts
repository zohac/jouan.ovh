import slugify from "slugify";
import { parseDocument, stringify } from "yaml";
import { resolveBlogVisibility } from "./app/utils/blog-indexability";
import { removeAeoLink } from "./app/utils/aeo-markdown";
import { SITE } from "./app/data/site";
import { normalizeSiteUrl } from "./app/utils/site-url";
import {
  blogContentSchema,
  blogTitleKey,
  collectRawFrontmatterIssues,
  formatBlogSchemaIssues,
} from "./app/utils/blog-content-contract";

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
    isSymbolicLink(): boolean;
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

// Relever à chaque changement de la sémantique de `prerender`/`indexable` calculés par
// `scanContentRouteState()`. La version 2 est la story 16.2 : `prerender` vaut désormais
// `state.production === "present"` et non `!isSitemapExcluded`, donc un cache écrit par
// une version antérieure porte `prerender: true` pour un article `visibility: private`
// (que `isPublishedBlogEntry` ne connaissait pas) et `prerender: false` pour un article
// `sitemap: false`. Le cache n'étant restauré que si le scan n'aboutit pas — son `catch`
// avale toute erreur non préfixée `[content]` — un cache périmé réintroduirait exactement
// la fuite que l'AC #5 ferme.
const SEO_ROUTE_CACHE_VERSION = 2;

const projectDirectory = nodeProcess.cwd();
const seoRouteCachePath = nodePath.resolve(projectDirectory, ".data/content/seo-routes.json");
const contentRouteState = new Map<string, SeoContentRouteState>();
const contentSourcePathByRoute = new Map<string, string>();
/**
 * Titre d'article du corpus public → source qui le déclare (unicité T0, AC 16.1 #8).
 *
 * Zod ne valide qu'un document à la fois : la garantie porte sur la collection et
 * doit donc vivre à l'échelle du module, comme `contentSourcePathByRoute`. La map
 * est vidée au début de chaque scan, car le cache SQLite de `@nuxt/content` peut
 * réutiliser une entrée déjà parsée sans rejouer `content:file:afterParse` : un
 * état accumulé serait alors à la fois incomplet et périmé.
 */
const contentSourcePathByPublicTitle = new Map<string, string>();
/** Table inverse du registre ci-dessus : source → clé de titre, pour retraction. */
const publicBlogTitleKeyBySource = new Map<string, string>();

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

  // Le prompt du terminal est décoratif sur toutes les routes. Les règles
  // spécifiques ne doivent retirer que leurs variantes résiduelles.
  sanitized = sanitized.replace(/^anon\.@[^\n]*(?:\n+|$)/gmu, "");

  if (route === "/") {
    sanitized = sanitized.replace(/\n+\*\*Automatisation\*\*✦[^\n]*\n/u, "\n");
  }

  if (route === "/contact") {
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
      // AI Ready sérialise `- [titre](/route.md): description`. Une fois le lien
      // retiré, la ligne résiduelle `- : description` doit disparaître elle aussi
      // pour ne pas publier la description d'une route exclue.
      .filter((line) => !/^\s*[-*+]\s*:/u.test(line))
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

/**
 * `index` est un mot-clé de routage, pas un nom de fichier : `INDEX.md` et `Index.md`
 * produisent la même route canonique que `index.md`. Les trois points de décision — scan,
 * dérivation de route et matrice CI — doivent donc comparer sur la forme canonique, sinon
 * un fichier en majuscules échappe à la réservation de `/blog` sur Linux (macOS, où les
 * deux fichiers ne peuvent pas coexister, ne le révèle jamais).
 */
function isIndexBasename(name: string): boolean {
  return slugify(name, { lower: true }) === "index";
}

function contentRouteFromFile(relativePath: string): string | undefined {
  const withoutExtension = relativePath.replace(/\.md$/u, "");
  const parts = withoutExtension.split("/").filter(Boolean);
  const last = parts.at(-1);
  if (last !== undefined && isIndexBasename(last)) {
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
 * Applique le contrat éditorial T0 à un document `blog` et échoue sinon.
 *
 * `@nuxt/content` v3 lit `content.config.ts` pour dériver les colonnes SQLite et les
 * types publics, mais ne valide jamais un document contre lui : sans ce point
 * d'application, un `pillar` hors vocabulaire, un tag en CamelCase ou un
 * `publishedAt` resurgence traverserait le build en silence, et l'échec
 * n'arriverait qu'à l'affichage (« Invalid Date », tri faux, JSON-LD vide).
 *
 * Le contrat est donc exécuté à deux endroits, sur deux sources distinctes :
 *
 * - `scanContentRouteState()` valide le frontmatter brut de chaque fichier de la
 *   collection, au chargement de la configuration. C'est le seul point où l'échec
 *   est *dur* : le module Content rattrape les erreurs du hook `afterParse` et se
 *   contente d'ignorer le fichier fautif (`WARN … is ignored because parsing is
 *   failed`), ce qui produirait un build partiel — l'article hors contrat
 *   disparaîtrait du site, ou ferait échouer le prérendu sur un 404 opaque. Les
 *   violations y sont **agrégées** puis levées à la fin de la fonction, donc
 *   **à l'intérieur** du `try` qui enveloppe `visit()` : ce n'est pas la position du
 *   `throw` qui les protège, c'est le **préfixe `[content]`** du message, seul préfixe
 *   que le `catch` laisse passer. Cette convention non structurelle porte donc à elle
 *   seule la garantie d'échec dur — d'où l'assertion CI qui vérifie qu'un article hors
 *   contrat fait bien échouer `pnpm generate`.
 * - le hook `content:file:afterParse` valide le document parsé à chaque relecture
 *   du fichier, donc immédiatement en développement, quand la configuration — et
 *   donc le scan — n'est pas rejouée. Son exception n'est **pas** un échec de build.
 *
 * Les contrôles de l'entrée brute (`title`/`description`, alias de date de publication,
 * clés pointées) précèdent le `safeParse` : Zod supprime les clés non déclarées, donc
 * ces invariants sont invisibles au schéma.
 */
function assertBlogContentContract(content: unknown, source: string, mode: "scan" | "hook"): void {
  const rawIssues = collectRawFrontmatterIssues(content);
  const result = blogContentSchema.safeParse(content);
  if (rawIssues.length === 0 && result.success) {
    return;
  }
  const issues = [...rawIssues, ...(result.success ? [] : formatBlogSchemaIssues(result.error))];
  const message =
    `[content] Contrat éditorial T0 violé par ${source} :\n${issues.map((issue) => `  - ${issue}`).join("\n")}\n` +
    (mode === "scan"
      ? "Corrigez le frontmatter ; aucun artefact n'est produit. "
      : "Corrigez le frontmatter. Attention : ce point n'est pas un échec de build sur le chemin du build — " +
        "le fichier sera ignoré avec un WARN du module Content ; sur le chemin watcher, le rejet n'est " +
        "ni journalisé ni avalé. ") +
    "Référence : docs/specs/spec-blog-editorial/content-contract.md";
  if (mode === "hook") {
    // Journalisé **avant** la levée : le comportement du module n'est pas uniforme entre le
    // chemin du build (`processCollectionItems`, `try/catch` par clé → `logger.warn`) et le
    // chemin watcher (`onChange`, aucun `try/catch` et aucun `.catch()` sur l'écouteur). Le
    // diagnostic ne peut donc pas dépendre du module qui le rattrape.
    console.warn(`\n${message}\n`);
  }
  throw new Error(message);
}

/**
 * Enregistre le titre d'un article du corpus listé et échoue sur collision.
 *
 * Deux articles découvrables distincts ne peuvent pas partager le même `title` : le
 * titre alimente les cartes, le JSON-LD et les artefacts AEO, donc une collision
 * produirait deux artefacts publics indiscernables côte à côte dans `/blog`. Seul le
 * corpus **découvrable** — celui que les listes exposent — est donc contraint : un
 * brouillon, un article à venir, un article `private` ou un article `noindex` peut
 * réutiliser un titre. La prédication est `state.discoverable` du resolver
 * (`app/utils/blog-indexability.ts`), et non `isIndexableBlogEntry` : les deux divergent
 * sur `sitemap: false`/`null`, qui est découvrable donc listé, mais absent du sitemap.
 *
 * La clé est normalisée (`blogTitleKey`) et la map est auto-réparatrice : le hook
 * `content:file:afterParse` écrit aussi dans cette structure, à chaque relecture de
 * fichier en développement, sans que la configuration — donc le scan qui purge — soit
 * rejouée. La table inverse permet de retracter le titre précédent du fichier avant
 * d'enregistrer le nouveau ; sans elle, un simple renommage de titre déclencherait une
 * collision fantôme contre un fichier qui n'existe plus, et l'exception avalée par le
 * module Content ferait disparaître l'article de `/blog` jusqu'au redémarrage.
 */
function registerPublicBlogTitle(title: string, source: string): void {
  const key = blogTitleKey(title);
  // Purge préalable des réservations dont le fichier a disparu. `onRemove`
  // (`module.mjs:1838-1859`) supprime la ligne de cache et la ligne SQL **sans** repasser
  // par `content:file:afterParse`, donc rien ne informait le registre d'une suppression
  // ni d'un renommage de fichier : après `git mv a.md b.md`, `Foo → a.md` survivait et le
  // prochain article nommé « Foo » déclenchait une collision fantôme, dont l'exception
  // avalée faisait disparaître l'article de `/blog` jusqu'au redémarrage. Le scan reste
  // le seul purgeur complet — il vide les deux tables — mais il ne rejoue pas sans
  // rechargement de la configuration.
  for (const [reservedSource, reservedKey] of [...publicBlogTitleKeyBySource]) {
    if (reservedSource !== source && !nodeFileSystem.existsSync(nodePath.resolve(projectDirectory, reservedSource))) {
      publicBlogTitleKeyBySource.delete(reservedSource);
      if (contentSourcePathByPublicTitle.get(reservedKey) === reservedSource) {
        contentSourcePathByPublicTitle.delete(reservedKey);
      }
    }
  }
  // Contrôle de collision **avant** toute mutation : muter d'abord laisserait les deux
  // tables déchirées quand la collision lève (`throw`), le registre perdant sa clé
  // précédente sans que la nouvelle soit enregistrée.
  const existing = contentSourcePathByPublicTitle.get(key);
  if (existing !== undefined && existing !== source) {
    throw new Error(
      `[content] Collision de titre dans le corpus listé : « ${title} » est déclaré par ${existing} et ${source}. ` +
        "Renommez l'un des deux titres ; seuls un brouillon, un article à venir, un article " +
        "`visibility: private` ou un article `noindex`/`robots: false` peuvent réutiliser un titre déjà listé.",
    );
  }
  const previousKey = publicBlogTitleKeyBySource.get(source);
  if (previousKey !== undefined && previousKey !== key) {
    contentSourcePathByPublicTitle.delete(previousKey);
  }
  contentSourcePathByPublicTitle.set(key, source);
  publicBlogTitleKeyBySource.set(source, key);
}

/**
 * Retracte la réservation de titre d'un fichier qui sort du corpus listé.
 *
 * Sans cet appel, passer un article en `draft`, en date future ou en `visibility: private`
 * en développement laisserait sa clé réservée : un article suivant portant le même titre
 * lèverait alors une collision fantôme, exception que `@nuxt/content` avale en
 * `logger.warn` — donc l'article disparaît silencieusement de `/blog`, du sitemap et des
 * artefacts AEO. Le scan n'en a pas besoin : il vide les deux maps à chaque exécution.
 */
function retractPublicBlogTitle(source: string): void {
  const previousKey = publicBlogTitleKeyBySource.get(source);
  if (previousKey === undefined) {
    return;
  }
  if (contentSourcePathByPublicTitle.get(previousKey) === source) {
    contentSourcePathByPublicTitle.delete(previousKey);
  }
  publicBlogTitleKeyBySource.delete(source);
}

/**
 * Recalcule l'état des routes Content depuis les fichiers présents.
 *
 * Le cache SQLite peut réutiliser une entrée parsée sans rejouer
 * `content:file:afterParse` ; la lecture du frontmatter évite qu'une fixture
 * inchangée, une date future devenue passée ou une exclusion robots soit
 * conservée dans un état de prérendu obsolète.
 *
 * Ce même passage est le point dur d'application du contrat éditorial T0 : il
 * parcourt le disque à chaque chargement de la configuration, ce qui le rend
 * indépendant du cache Content, et il ne dépend pas du statut de publication —
 * un brouillon, un article futur ou une entrée `sitemap: false` hors contrat
 * doivent interrompre le build au même titre qu'un article publié. Les violations y
 * sont **agrégées** sur tout le corpus, et les entrées du répertoire sont triées :
 * corriger un lot d'articles invalides suppose un build, pas un build par fichier, et
 * le fichier cité ne varie pas d'un build à l'autre.
 */
function scanContentRouteState(): void {
  // Chaque scan repart d'un état de titres vide : l'unicité porte sur les fichiers
  // réellement présents, pas sur l'historique des parses de cette même session.
  contentSourcePathByPublicTitle.clear();
  publicBlogTitleKeyBySource.clear();
  const contractViolations: string[] = [];
  const titleCollisions: string[] = [];
  const contentRoot = nodePath.resolve(projectDirectory, "content");
  const scannedRoutes = new Set<string>();
  const visit = (directory: string): void => {
    // Tri par **points de code**, et non par `localeCompare` : celle-ci utilise la locale
    // par défaut du runtime, donc l'ordre diffère entre le runner CI et le poste local
    // (`A.md`/`a.md`, `a-b.md`/`ab.md`, `é.md`/`e.md`). Le build échoue dans tous les cas,
    // mais le fichier cité en premier dans une collision variait — ce qui contredisait la
    // justification même du tri.
    const entries = [...nodeFileSystem.readdirSync(directory, { withFileTypes: true })].sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
    );
    for (const entry of entries) {
      const fullPath = nodePath.resolve(directory, entry.name);
      // `Dirent` ne résout pas les liens symboliques : `isFile()` **et** `isDirectory()`
      // valent `false` pour un symlink, alors que `tinyglobby` — utilisé par
      // `@nuxt/content` pour résoudre la source `blog/**/*.md` — suit les liens par défaut.
      // Un lien vers un fichier hors contrat serait donc ingéré et publié, mais invisible
      // du scan : ni contrôle, ni entrée dans `contentRouteState`, ni unicité de titre. Le
      // refus est dur et explicite plutôt que résolu en silence.
      if (entry.isSymbolicLink()) {
        throw new Error(
          `[content] Lien symbolique refusé sous content/ : ${nodePath.relative(projectDirectory, fullPath)}. ` +
            "La source de la collection est résolue par tinyglobby (followSymbolicLinks), qui suit les liens " +
            "alors que ce scan ne les voit pas : le fichier serait ingéré sans contrat ni unicité de titre. " +
            "Utilisez un fichier réel.",
        );
      }
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }
      if (!entry.isFile()) {
        continue;
      }
      // Les fichiers point (`.gitkeep`, `.gitignore`) ne sont pas du contenu : `tinyglobby`
      // les ignore par défaut (`dot: false`), donc les collectionner ou les refuser fausserait
      // les deux côtés. Le refus d'extension qui suit ne vise donc que les formats réels.
      if (entry.name.startsWith(".")) {
        continue;
      }
      const relativePath = fullPath.slice(contentRoot.length + 1);
      if (relativePath === "blog" || relativePath.startsWith("blog/")) {
        // `blog/**/*.md` est la collection déclarée dans `content.config.ts` : tout fichier
        // Markdown y appartenant doit respecter le contrat, publié ou non. Un frontmatter
        // absent ou illisible n'est pas une exception : c'est le cas précis où `date`,
        // `author`, `pillar` et `format` manquent tous, et il doit donc être refusé.
        //
        // Le test d'extension est insensible à la casse : `@nuxt/content` résout son
        // transformateur avec `new RegExp(".md", "i")`, donc `Mon-Article.MD` est bien
        // ingéré, prérendu et publié — un filtre `.endsWith(".md")` le laissait passer sans
        // contrat, sans route d'état et sans unicité de titre.
        if (!entry.name.toLowerCase().endsWith(".md")) {
          throw new Error(
            "[content] Extension non Markdown refusée dans la collection blog : " +
              `${nodePath.relative(projectDirectory, fullPath)}. La collection est déclarée "blog/**/*.md" ; ` +
              "tout autre format serait ingéré sans passer par le contrat T0.",
          );
        }
        const reserved = relativePath.split("/").at(-1);
        if (reserved !== undefined && isIndexBasename(reserved)) {
          throw new Error(
            `[content] ${nodePath.relative(projectDirectory, fullPath)} est réservé à la route Vue /blog.`,
          );
        }

        const sourcePath = nodePath.relative(projectDirectory, fullPath);
        const source = nodeFileSystem.readFileSync(fullPath, "utf8");
        const metadata = readContentFrontmatter(source);
        try {
          assertBlogContentContract(metadata ?? {}, sourcePath, "scan");
        } catch (error) {
          contractViolations.push(error instanceof Error ? error.message : String(error));
        }

        // L'unicité de `title` est enregistrée **dans le bloc `blog/**`**, avant toute
        // décision de route : la garantie doit couvrir la collection entière, pas seulement
        // les fichiers dont `contentRouteFromFile()` dérive une route. Placée plus bas, elle
        // serait plus étroite que le reste du contrat — deux articles de même titre
        // passeraient le build alors que `/blog` affiche deux cartes homonymes. Le filtre est
        // le même qu'ailleurs (`state.discoverable`) : un article `noindex`, `private` ou à
        // venir ne réserve pas son titre.
        const blogState = resolveBlogVisibility(metadata);
        if (typeof metadata?.title === "string" && metadata.title !== "" && blogState.discoverable) {
          try {
            registerPublicBlogTitle(metadata.title, sourcePath);
          } catch (error) {
            // Diagnostic de nature différente d'une violation de frontmatter.
            titleCollisions.push(error instanceof Error ? error.message : String(error));
          }
        }
        continue;
      }

      // Hors collection `blog` : aucune lecture de frontmatter, aucun contrat.
      if (!entry.name.toLowerCase().endsWith(".md")) {
        continue;
      }
      const sourcePath = nodePath.relative(projectDirectory, fullPath);
      const source = nodeFileSystem.readFileSync(fullPath, "utf8");
      const metadata = readContentFrontmatter(source);
      const route = contentRouteFromFile(relativePath);
      if (!route) {
        continue;
      }
      scannedRoutes.add(route);

      const existing = contentRouteState.get(route);
      if (existing?.source && existing.source !== sourcePath) {
        throw new Error(`[content] Collision de route Content : ${route} (${existing.source} et ${sourcePath}).`);
      }

      // Une seule lecture d'état gouverne le HTML : `draft`, date future et
      // `visibility: private` sont indiscernables pour le visiteur. `resolveBlogVisibility`
      // est total — il remplace toute entrée non-objet par `{}` — donc l'ordre des deux
      // lignes est sans effet sur la sécurité ; le `!metadata` est conservé après l'appel
      // parce qu'il porte le narrowing TypeScript des lectures suivantes.
      const state = resolveBlogVisibility(metadata);
      if (!metadata || state.production === "absent") {
        contentRouteState.delete(route);
        contentSourcePathByRoute.delete(route);
        continue;
      }

      // Mapping nominatif de l'état (AC 16.2 #8). `prerender` n'a pas d'équivalent dans
      // l'état : `noindex` a du HTML mais pas de sitemap, `sitemap: false` l'inverse.
      // `prerender: !sitemapExcluded` retirait à tort le HTML d'un article `sitemap: false`.
      contentRouteState.set(route, {
        prerender: state.production === "present",
        indexable: state.inSitemap,
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

  if (contractViolations.length > 0) {
    throw new Error(
      `[content] Contrat éditorial T0 violé sur ${contractViolations.length} entrée(s) :\n${contractViolations.join("\n")}\n` +
        "Corrigez le frontmatter ; aucun artefact n'est produit. " +
        "Référence : docs/specs/spec-blog-editorial/content-contract.md",
    );
  }
  // Les collisions de titre sont un diagnostic distinct : aucun frontmatter n'est en
  // cause, et le scan a déjà construit `contentRouteState` pour les autres fichiers.
  if (titleCollisions.length > 0) {
    throw new Error(`[content] Unicité de titre violée :\n${titleCollisions.join("\n")}\n`);
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
    // Forme d'URL canonique du site statique. GitHub Pages ne répond 200 que sur la
    // forme « dossier » (`/about/`) et redirige `/about` en 301. `nuxt-site-config`
    // propage cette forme aux résolveurs d'URL de ses consommateurs — dont
    // `@nuxtjs/sitemap` (`fixSlashes`, `createSitePathResolver`) — et `toCanonicalPath()`
    // l'applique au canonical, à l'Open Graph et au JSON-LD. Sans elle, chaque page du
    // sitemap et chaque canonical désignent une redirection (« Page avec redirection »,
    // « Erreur liée aux redirections » dans la Search Console).
    trailingSlash: true,
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
    // Forme d'URL canonique du site statique. GitHub Pages ne répond 200 que sur
    // la forme « dossier » (`/about/`) et redirige `/about` en 301 : les liens
    // internes doivent donc nommer la forme servie, sinon chaque navigation d'un
    // robot ou d'un premier chargement traverse une redirection, ce que la Search
    // Console signale comme « Page avec redirection » / « Erreur liée aux
    // redirections ». La forme est appliquée en cohérence par `toCanonicalPath()`
    // (canonical, Open Graph, JSON-LD) et par le hook `sitemap:input`.
    defaults: {
      nuxtLink: {
        trailingSlash: "append",
      },
    },
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
      // Le contrat est appliqué ici sur le **frontmatter brut relu depuis le disque**, et
      // non sur `context.content` : le module a déjà transformé le document. Concrètement,
      // `module.mjs:1489-1495` ne conserve au premier niveau que les clés déclarées dans
      // `extendedSchema` et expulse **toute clé non déclarée dans `content.meta`** — donc
      // `published`, `pubDate`, `datePublished` et `published_date` y atterrissent et
      // échappaient aux deux points de contrôle. Et `module.mjs:1150`
      // (`content.title || generateTitle(basename)`) synthétise `title` depuis le nom de
      // fichier **avant** `afterParse` : le contrôle « `title` non vide » passait sur un
      // champ absent, et le registre d'unicité s'alimentait d'une clé synthétique pouvant
      // tuer un article légitime. Les contrôles d'identité, de clés interdites et
      // d'enregistrement de titre lisent donc tous le frontmatter brut.
      //
      // Son exception n'est PAS un échec de build sur le chemin du build : le module la
      // transforme en `logger.warn` et ignore le fichier. Sur le chemin **watcher**
      // (`module.mjs:1794-1837`), `parser(...)` est appelé sans `try/catch` ni `.catch()`
      // : le rejet n'est ni journalisé ni avalé. Le comportement est donc journalisé
      // explicitement avant la levée, et l'application dure reste dans
      // `scanContentRouteState()`.
      const rawFrontmatter =
        source !== undefined
          ? readContentFrontmatter(nodeFileSystem.readFileSync(nodePath.resolve(projectDirectory, source), "utf8"))
          : undefined;
      assertBlogContentContract(rawFrontmatter ?? context.content, source ?? normalizedPath, "hook");

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

      const state = resolveBlogVisibility(context.content);
      if (state.production === "absent") {
        contentRouteState.delete(normalizedPath);
        // Purges symétriques à celles du scan : `contentSourcePathByRoute` alimente
        // `enrichAiReadyArticleFrontmatter`, qui lirait sinon le frontmatter d'un fichier
        // renommé.
        if (source) {
          contentSourcePathByRoute.delete(normalizedPath);
        }
        return;
      }
      // La réservation de titre est libérée sur **toute** sortie du corpus découvrable, et
      // pas seulement sur `production === "absent"`. La branche « présent mais non
      // découvrable » — un article passant à `noindex: true` ou `robots: false` en
      // développement — satisfait ni la condition de retraction ci-dessous ni celle
      // d'enregistrement plus bas : rien ne se passait, et la clé restait réservée. Un
      // article suivant portant le même titre déclenchait alors une collision fantôme
      // dont l'exception, avalée, le faisait disparaître de `/blog`.
      if (source && !state.discoverable) {
        retractPublicBlogTitle(source);
      }
      // Seul le corpus découvrable réserve un titre — la même prédication que le scan
      // (`state.discoverable`), et non `isIndexableBlogEntry` : les deux divergent sur
      // `sitemap: false`/`null`, découvrable donc listé mais absent du sitemap. Le
      // prédicat du schéma Sitemap (`defineSitemapSchema({ filter })`) reste, lui,
      // `isIndexableBlogEntry` : il est sérialisé par `Function#toString()` et ne peut
      // donc pas être remplacé par le resolver (AD-02, Piège 2).
      // Le titre est lu sur le **frontmatter brut** : `context.content.title` peut être
      // synthétisé depuis le nom de fichier (`module.mjs:1150`), ce qui produirait une clé
      // d'unicité qui ne correspond à aucun titre déclaré.
      const declaredTitle = rawFrontmatter?.title;
      if (source && typeof declaredTitle === "string" && declaredTitle !== "" && state.discoverable) {
        registerPublicBlogTitle(declaredTitle, source);
      }
      contentRouteState.set(normalizedPath, {
        prerender: state.production === "present",
        indexable: state.inSitemap,
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
