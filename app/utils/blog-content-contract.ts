import { z } from "@nuxt/content";
import { defineRobotsSchema } from "@nuxtjs/robots/content";
import { defineSitemapSchema } from "@nuxtjs/sitemap/content";
import { isIndexableBlogEntry } from "./blog-indexability";

// Vocabulaires fermés du contrat éditorial T0 — `docs/specs/spec-blog-editorial/content-contract.md`
// §3. Toute valeur hors de ces listes est refusée par `assertBlogContentContract`
// (`nuxt.config.ts`), qui est appelé à deux endroits : `scanContentRouteState()` au
// chargement de la configuration — le seul point d'échec *dur* — et le hook
// `content:file:afterParse`, qui ne l'est pas (le module Content avale son exception et
// ignore le fichier fautif). Aucun build partiel n'est produit par le premier.
const BLOG_PILLARS = ["ai-systems", "software-engineering", "automation"] as const;
const BLOG_FORMATS = [
  "deep-dive",
  "tutorial",
  "lab-note",
  "project-log",
  "opinion",
  "comparison",
  "case-study",
  "reference",
] as const;
const BLOG_GOALS = ["seo", "authority", "business", "memory"] as const;
// Kebab-case strict : segments alphanumériques minuscules séparés par un tiret unique.
// Le vocabulaire est contrôlé à la saisie, pas assaini à l'affichage.
const BLOG_TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

/**
 * Forme d'une date éditoriale : `YYYY-MM-DD`. Les groupes servent à reconstituer la date
 * pour le contrôle calendaire sans dépendre d'un découpage aveugle de la chaîne.
 */
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/u;

/**
 * Rejette `2026-02-30` et `2026-13-01`, que `new Date()` normaliserait silencieusement
 * vers le 2 mars et le 1er janvier de l'année suivante.
 *
 * `setUTCFullYear` est utilisé et non le constructeur `Date`, qui mappe les années 0 à 99
 * sur 1900-1999 et rejeterait à tort une date calendaire valide telle que `0026-01-01`.
 */
function isCalendarDate(value: string): boolean {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(0);
  parsed.setUTCFullYear(year, month - 1, day);
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

/**
 * Date éditoriale : forme ISO **et** réalité calendaire, avec un seul message par défaut.
 *
 * Le refine calendaire ne s'applique que si la forme est déjà conforme : sans ce garde,
 * `15/01/2026` produirait deux messages contradictoires (« format dévié » *et* « date
 * calendaire invalide ») puisque Zod n'interrompt pas la chaîne après l'échec du regex.
 */
function editorialDate(label: "date" | "updated") {
  return z
    .string()
    .regex(ISO_DATE_PATTERN, `${label} doit être au format ISO YYYY-MM-DD`)
    .refine(
      (value) => !ISO_DATE_PATTERN.test(value) || isCalendarDate(value),
      `${label} doit contenir une date calendaire valide`,
    );
}

/**
 * Clés de frontmatter interdites en T0.
 *
 * `date` est l'unique champ de publication : tout alias concurrent doit être refusé
 * explicitement, car Zod supprime silencieusement une clé inconnue et laisserait deux
 * règles de publication coexister sur des corpus différents.
 *
 * `publishedAt` est le seul qui soit **aussi** déclaré `z.never()` dans le schéma : il
 * s'agit de l'exception(originaire de la règle, conservée parce que c'est la seule clé
 * dont le refus mérite un message dédié dans le schéma lui-même. Elle est donc absente
 * d'ici pour ne pas produire deux messages pour une seule faute.
 *
 * `sitemap.loc` et `sitemap.lastmod` sont interdits pour la même raison : le chemin et
 * le `lastmod` publiés sont dérivés de l'entrée (`path`) et de `updated ?? date`
 * (`onUrl`), jamais saisis. `defineSitemapSchema` déclare `lastmod: z.date()`, qu'aucune
 * valeur YAML ne peut satisfaire — l'union échouerait donc en amont et le `.superRefine`
 * d'un `ZodEffects` dont le parseur interne a échoué **n'est pas exécuté** : le contrôle
 * vit donc ici, sur l'entrée brute, dans ses deux formes.
 *
 * La forme pointée (`sitemap.loc: …`) est propre au parseur du scan ; `remark-mdc`
 * applique `flat.unflatten` et produirait `{ sitemap: { loc } }`. Les deux formes sont
 * donc contrôlées.
 */
const BLOG_FORBIDDEN_FRONTMATTER_KEYS = [
  "published",
  "pubDate",
  "datePublished",
  "published_date",
  "sitemap.loc",
  "sitemap.lastmod",
] as const;

/** Sous-clés de `sitemap` qui doivent rester dérivées, jamais saisies. */
const BLOG_FORBIDDEN_SITEMAP_KEYS = ["loc", "lastmod"] as const;

/**
 * Caractères invisibles : catégorie `Cf` (format, dont les bidis et le trait d'union
 * conditionnel) plus la plage ZWSP/ZWNJ/ZWJ/BOM. `trim()` et `NFKC` ne les retirent pas,
 * donc deux titres visuellement identiques produiraient deux clés d'unicité distinctes.
 */
const INVISIBLE_CHARACTERS_PATTERN = /[\p{Cf}\u200B-\u200D\u2060\uFEFF]/gu;

/**
 * Champs d'identité fournis par `type: "page"`. Ils ne sont pas déclarés dans le schéma de
 * collection (AC 16.1 #1) mais `@nuxt/content` v3 n'exécute aucune validation : sans ce
 * contrôle, `title` et `description` absents arriveraient en `NULL` en base et
 * produiraient une carte et un JSON-LD sans titre ni description.
 */
const BLOG_IDENTITY_KEYS = ["title", "description"] as const;

/**
 * Normalise un titre pour la clé d'unicité (AC 16.1 #8).
 *
 * `NFKC`, retrait des caractères invisibles, `trim`, puis *case folding* : sans cela,
 * `"Automatiser"`, `"automatiser"`, `"Automatiser "`, une espace insécable finale, un
 * ZWSP final ou un U+2011 formeraient des clés distinctes pour le même titre, et la
 * garantie serait contournable par un caractère unique.
 */
export function blogTitleKey(title: string): string {
  return title.normalize("NFKC").replace(INVISIBLE_CHARACTERS_PATTERN, "").trim().toLocaleLowerCase("fr");
}

/** Retire les caractères invisibles : longueur et test de non-vide doivent les ignorer. */
function visibleLength(value: string): number {
  return value.replace(INVISIBLE_CHARACTERS_PATTERN, "").trim().length;
}

/**
 * Contrôles portant sur l'**entrée brute**, donc impossibles à exprimer dans le schéma :
 * `title`/`description` y sont supprimés par le strip de Zod, et les alias refusés
 * n'y sont jamais déclarés. `assertBlogContentContract` (`nuxt.config.ts`) les exécute.
 */
export function collectRawFrontmatterIssues(content: unknown): string[] {
  const frontmatter = content as Record<string, unknown> | null | undefined;
  if (!frontmatter || typeof frontmatter !== "object" || Array.isArray(frontmatter)) {
    return ["frontmatter : absent ou illisible — l'entrée doit être un objet YAML"];
  }
  const issues: string[] = [];
  for (const key of BLOG_IDENTITY_KEYS) {
    const value = frontmatter[key];
    if (typeof value !== "string" || visibleLength(value) === 0) {
      issues.push(`${key} : champ requis et non vide — le type "page" ne le dérive pas, il le recopie`);
    }
  }
  for (const key of BLOG_FORBIDDEN_FRONTMATTER_KEYS) {
    if (Object.hasOwn(frontmatter, key)) {
      issues.push(`${key} : clé interdite — voir content-contract.md §1 et §2 (valeurs acceptées : aucune)`);
    }
  }
  // Forme imbriquée de `sitemap.loc` / `sitemap.lastmod`. Contrôlée ici, et non dans un
  // `superRefine`, parce que `defineSitemapSchema` déclare `lastmod: z.date()` : aucune
  // valeur YAML ne peut satisfaire cette branche, l'union échoue donc en amont et le
  // refine d'un `ZodEffects` déjà en échec n'est pas exécuté.
  const sitemap = frontmatter.sitemap;
  if (sitemap && typeof sitemap === "object" && !Array.isArray(sitemap)) {
    for (const key of BLOG_FORBIDDEN_SITEMAP_KEYS) {
      if (Object.hasOwn(sitemap, key) && (sitemap as Record<string, unknown>)[key] !== undefined) {
        const derived = key === "loc" ? "le chemin réel de l’entrée Content" : "`updated ?? date`";
        issues.push(
          `sitemap.${key} : clé interdite — ${derived} est une valeur dérivée, non saisie (valeurs acceptées : aucune)`,
        );
      }
    }
  }
  return issues;
}

/**
 * Types d'issue déduits du schéma lui-même : `zod` n'est pas une dépendance directe du
 * projet (AD-08) et `z` n'est importé que comme valeur, donc `z.ZodError` n'est pas
 * accessible comme namespace depuis ce module.
 */
type BlogSchemaResult = ReturnType<typeof blogContentSchema.safeParse>;
type BlogSchemaIssue = Extract<BlogSchemaResult, { success: false }>["error"]["issues"][number];

/**
 * Rend les issues Zod en messages exploitables (AC 16.1 #7).
 *
 * Zod fait échouer une `union` avec un unique issue `invalid_union` dont le message est
 * littéralement `Invalid input` : sans déplier `unionErrors`, toute erreur portant sur
 * `sitemap` ou `robots` — les deux branches SEO — sortirait sans nom ni valeur acceptée.
 *
 * Le dépliage est **récursif** : `buildSitemapObjectSchema` déclare des unions imbriquées
 * (`images[].loc`, `videos[].duration`…), dont les branches produisent à leur tour un
 * `invalid_union` muet si l'on s'arrête au premier niveau. La profondeur est bornée pour
 * qu'un schéma autoréférentiel ne fasse pas boucler la fonction.
 */
export function formatBlogSchemaIssues(error: Extract<BlogSchemaResult, { success: false }>["error"]): string[] {
  const describe = (issue: BlogSchemaIssue): string =>
    `${issue.path.length > 0 ? issue.path.join(".") : "frontmatter"} : ${issue.message}`;

  const expand = (issue: BlogSchemaIssue, depth: number): string[] => {
    if (
      issue.code === "invalid_union" &&
      depth < 5 &&
      Array.isArray(issue.unionErrors) &&
      issue.unionErrors.length > 0
    ) {
      // `unionErrors` est un tableau de `ZodError`, dont chaque branche porte ses `issues` :
      // la récursion s'applique donc à ces issues, pas aux erreurs elles-mêmes.
      return issue.unionErrors.flatMap((branch) => branch.issues.flatMap((nested) => expand(nested, depth + 1)));
    }
    return [describe(issue)];
  };

  return error.issues.flatMap((issue) => {
    const branches = expand(issue, 0);
    // Un issue d'union se dédouble en « valeur refusée » + le détail de chaque branche,
    // dédupliqué : deux branches Failent souvent pour la même raison (ex. `false` et `null`).
    if (branches.length > 1 || issue.code === "invalid_union") {
      return [`${issue.path.length > 0 ? issue.path.join(".") : "frontmatter"} : valeur refusée`, ...new Set(branches)];
    }
    return branches;
  });
}

/**
 * Contrat éditorial minimal T0 d'un article.
 *
 * Le schéma est typé **et** exécuté. `@nuxt/content` v3 en dérive les colonnes
 * SQLite et les types publics, mais ne valide aucun document : sans point
 * d'application explicite, un `pillar` hors vocabulaire, un tag en CamelCase ou un
 * `publishedAt` resurgence traverserait le build en silence, et l'échec
 * n'arriverait qu'à l'affichage (« Invalid Date », tri faux, JSON-LD vide).
 * `assertBlogContentContract` (`nuxt.config.ts`) l'exécute sur chaque fichier `blog`
 * parsé et transforme toute issue en échec de build nommant le champ fautif.
 *
 * `type: "page"` reste le propriétaire de `title`, `description`, `path` et `body`,
 * qui ne sont pas redéclarés ici (AC 16.1 #1) : leur présence est contrôlée à part par
 * `collectRawFrontmatterIssues`, sur l'entrée brute.
 */
export const blogContentSchema = z
  .object({
    // Date ISO (YYYY-MM-DD) : tri lexicographique = tri chronologique, formatée en
    // français à l'affichage. Sert au `.order("date", "DESC")`.
    // Sémantique de publication : Europe/Paris (fuseau appliqué par
    // `isPublishedBlogEntry`/`isIndexableBlogEntry`, pas par le schéma).
    date: editorialDate("date"),
    // Date de mise à jour optionnelle, rétrocompatible avec les articles existants.
    updated: editorialDate("updated").optional(),
    // `publishedAt` est refusé, et non ignoré : Zod supprimerait silencieusement une
    // clé inconnue, ce qui laisserait deux règles de publication concurrentes
    // (`date` et `publishedAt`) coexister sur des corpus différents. C'est le **seul**
    // interdit déclaré ici — les autres alias sont couverts par
    // `BLOG_FORBIDDEN_FRONTMATTER_KEYS`, pour ne pas produire deux messages pour une
    // seule faute. Toute introduction ultérieure exige une migration atomique de tous
    // les consommateurs — `content-contract.md` §1.
    publishedAt: z
      .never({
        invalid_type_error:
          "publishedAt est interdit en T0 : `date` (YYYY-MM-DD, Europe/Paris) est l'unique champ de publication.",
      })
      .optional(),
    // Alias interne alimenté par le hook Content pour `nuxt-ai-ready` :
    // la collection conserve `updated` comme source éditoriale unique.
    updatedAt: z.string().optional(),
    // États de publication. `draft` et `visibility` sont **requis**
    // (`content-contract.md` §2) : un champ oublié doit échouer le build, pas publier
    // l'article par défaut. `visibility` est le seul contrôle de confidentialité de la
    // matrice — un oubli y aurait un effet de fuite, pas seulement de tri.
    draft: z.boolean(),
    noindex: z.boolean().optional(),
    // Sépare confidentialité et indexabilité (AD-04) : `noindex` et `sitemap`
    // ne l'en déduisent pas. Accepte en T0, appliqué par le resolver 16.2.
    visibility: z.enum(["public", "private"]),
    // Identifiant éditorial unique, résolu depuis `SITE.profile` par les pages.
    // Jamais le nom, la bio ou les liens en clair.
    author: z.literal("simon-jouan"),
    // Exactement un pilier éditorial.
    pillar: z.enum(BLOG_PILLARS),
    // Format de lecture, indépendant du pilier.
    format: z.enum(BLOG_FORMATS),
    // `goals` est inerte en T0 : aucun code de lecture — publication, classement
    // d'articles liés ou appel à l'action — ne doit en dépendre (PRD §6.1).
    goals: z.array(z.enum(BLOG_GOALS)).optional(),
    // Tags (technos / sujets) rendus en `.tag` pil. Champ requis et non vide
    // (`content-contract.md` §2) : sans tag, un article n'a pas de rattachement
    // éditorial lisible, les deux templates rendent zéro pastille et `keywords`
    // disparaît du JSON-LD.
    tags: z
      .array(z.string().regex(BLOG_TAG_PATTERN, "un tag doit être en kebab-case minuscule (ex. ai-systems)"))
      .min(1, "au moins un tag kebab-case est requis"),
    // Temps de lecture saisi à la main (ex. "8 min"). Valeur éditoriale
    // facultative ; aucun calcul automatique (PRD §12). Consommé par les deux
    // templates du blog et par `reading_time_est` du JSON-LD.
    read: z.string().optional(),
    // Vignette d'article (facultative). `alt` obligatoire : une image de contenu
    // sans texte alternatif produirait un défaut d'accessibilité.
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    // `defineSitemapSchema()` accepte l'objet SEO officiel ou l'absence de
    // champ. Les sentinelles false/null permettent d'exclure explicitement une
    // URL sans faire échouer la validation Zod de la collection.
    sitemap: z.union([
      defineSitemapSchema({
        name: "blog",
        z,
        filter: isIndexableBlogEntry,
        onUrl: (url, entry) => {
          const metadata = entry as typeof entry & { date: string; updated?: string };
          url.lastmod = metadata.updated ?? metadata.date;
          // Aucun signal de priorité/fréquence : Google les ignore et aucun autre
          // consommateur ne le demande dans le contrat actuel.
          delete url.priority;
          delete url.changefreq;
        },
      }),
      z.literal(false),
      z.null(),
    ]),
    robots: defineRobotsSchema(),
  })
  .refine((entry) => !entry.updated || entry.updated >= entry.date, {
    message: "updated doit être postérieure ou égale à date",
    path: ["updated"],
  });
// Aucun `superRefine` ici : les deux seules clés qu'il contrôlait (`sitemap.loc` et
// `sitemap.lastmod`) sont désormais refusées par `collectRawFrontmatterIssues`, sur
// l'entrée brute. Le refine était **inatteignable** pour `lastmod` : `defineSitemapSchema`
// le déclare `z.date()`, qu'aucune valeur YAML ne peut satisfaire, donc l'union échouait
// en amont et Zod n'exécute pas le refine d'un `ZodEffects` déjà en échec. Les distinguer
// des autres champs était de toute façon impossible ici, `entry` étant déjà strippé.
