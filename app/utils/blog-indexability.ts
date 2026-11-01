type BlogIndexabilityEntry = {
  date?: unknown;
  draft?: unknown;
  visibility?: unknown;
  noindex?: unknown;
  robots?: unknown;
  seo?: { robots?: unknown };
  sitemap?: unknown;
};

function hasNoindexDirective(value: unknown): boolean {
  if (value === false || value === "false") {
    return true;
  }
  if (typeof value !== "string") {
    return false;
  }
  return value
    .toLowerCase()
    .split(/[\s,]+/u)
    .some((directive) => directive === "noindex" || directive === "none");
}

/**
 * Une exclusion sitemap est distincte d'une directive robots noindex.
 *
 * Prédicat d'**exclusion sitemap** brownfield — ce n'est pas un second prédicat
 * d'indexabilité. Il reste exporté car il définit cette exclusion, mais la couche B
 * en duplique le test inline (il n'est pas sérialisable) et `nuxt.config.ts` lit
 * désormais l'état du resolver. Le registre de titres reste gouverné par
 * `isIndexableBlogEntry`, qui couvre la même exclusion.
 */
export function isSitemapExcluded(entry: unknown): boolean {
  const metadata = (entry ?? {}) as BlogIndexabilityEntry;
  return metadata.sitemap === false || metadata.sitemap === "false" || metadata.sitemap === null;
}

/**
 * Détermine si un article Content peut être publié dans le site statique.
 *
 * Une date editorial `YYYY-MM-DD` devient disponible à minuit dans le fuseau de
 * publication du site (Europe/Paris), indépendamment du fuseau UTC du runner CI.
 *
 * Équivalent exact de la couche B : `resolveBlogVisibility(entry, now).production === "present"`.
 * Conservé car il fait partie de l'API brownfield du module ; les appelants de la surface
 * publique consomment la couche B, seule à exposer l'état complet.
 */
export function isPublishedBlogEntry(entry: unknown, now: Date = new Date()): boolean {
  const metadata = (entry ?? {}) as BlogIndexabilityEntry;
  return isIndexableBlogEntry(
    {
      date: metadata.date,
      draft: metadata.draft,
      visibility: metadata.visibility,
    },
    now,
  );
}

/**
 * Détermine si un article publié peut être découvert dans le sitemap.
 *
 * Cette fonction est volontairement autonome : `@nuxtjs/sitemap` sérialise le
 * callback avec `Function#toString()` dans son module virtuel Nitro. Elle ne doit
 * donc capturer aucune constante ou fonction externe au projet. Elle n'est jamais
 * factorisée ni complétée par des imports : la couche B duplique son corps plutôt que
 * de l'appeler, et les fixtures de la story 16.6 sont le seul moyen de garder les deux
 * copies synchronisées.
 *
 * Elle ne lève jamais non plus : une entrée nulle ou inconnue vaut `false` (AC 16.2 #4).
 */
export function isIndexableBlogEntry(entry: unknown, now?: Date): boolean {
  const metadata = (entry ?? {}) as BlogIndexabilityEntry;
  // `@nuxtjs/sitemap` applique ce callback via `Array#filter`, qui transmet
  // l'index de l'entrée comme second argument. Ne pas interpréter cet index
  // comme une date : une fixture ou un article récent serait alors filtré à tort.
  const referenceDate = now instanceof Date && !Number.isNaN(now.getTime()) ? now : new Date();
  if (
    typeof metadata.date !== "string" ||
    metadata.draft === true ||
    metadata.visibility === "private" ||
    metadata.noindex === true
  ) {
    return false;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(metadata.date);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  // `new Date(0)` puis `setUTCFullYear`, et non `Date.UTC` : le constructeur `Date` mappe
  // les années 0 à 99 sur 1900-1999 (`Date.UTC(26, 0, 1)` vaut 1926-01-01) et rejetterait à
  // tort une date calendaire valide telle que `0026-01-01` — que le contrat accepte déjà
  // (`app/utils/blog-content-contract.ts`, `isCalendarDate`). Dupliqué verbatim côté couche B.
  const parsedDate = new Date(0);
  parsedDate.setUTCFullYear(year, month - 1, day);
  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return false;
  }

  const parisDateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(referenceDate);
  const dateParts = Object.fromEntries(parisDateParts.map(({ type, value }) => [type, value]));
  const todayInParis = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  if (metadata.date > todayInParis) {
    return false;
  }

  const robotsValues = [metadata.robots, metadata.seo?.robots];
  const robotsNoindex = robotsValues.some((value) => {
    if (value === false || value === "false") {
      return true;
    }
    if (typeof value !== "string") {
      return false;
    }
    return value
      .toLowerCase()
      .split(/[\s,]+/u)
      .some((directive) => directive === "noindex" || directive === "none");
  });
  const sitemapExcluded = metadata.sitemap === false || metadata.sitemap === "false" || metadata.sitemap === null;

  return !sitemapExcluded && !robotsNoindex;
}

/** Traduit les métadonnées Content en directive meta robots pour la page HTML. */
export function getBlogRobotsDirective(entry: unknown): string | undefined {
  const metadata = (entry ?? {}) as BlogIndexabilityEntry;
  if (metadata.noindex === true || [metadata.robots, metadata.seo?.robots].some(hasNoindexDirective)) {
    return "noindex, nofollow";
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Couche B — resolver de visibility
// ---------------------------------------------------------------------------

/**
 * État unique de visibility d'un article, consommé par **toutes** les surfaces :
 * HTML et 404 (`production`), listes `/blog` et journal de la homepage
 * (`discoverable`), sitemap et artefacts AEO (`inSitemap`), balise meta robots
 * (`robots`), et l'état diffusable d'un flux futur (`feedable`).
 *
 * `discoverable` n'est **pas** un alias de `isIndexableBlogEntry` : c'est une troisième
 * prédication. Un article `sitemap: false` reste `discoverable: true` (présent dans les
 * listes, CTA de fin d'article D-09) alors que `isIndexableBlogEntry` renvoie `false`.
 * Écrire `discoverable = isIndexableBlogEntry(entry)` casserait ces deux surfaces.
 *
 * `inSitemap` est le nom retenu plutôt que `indexable` pour ne pas confondre cette couche
 * avec le champ homonyme de `SeoContentRouteState` (`nuxt.config.ts`), brownfield et
 * renommé hors périmètre.
 */
export type BlogVisibilityState = {
  /** Présent dans le build statique et accessible en HTTP. */
  production: "present" | "absent";
  /**
   * L'article est un artefact public découvrable par un humain.
   * Consommateurs : liste `/blog`, journal de la homepage, CTA de fin d'article (D-09).
   */
  discoverable: boolean;
  /** Présent dans `sitemap.xml` et les artefacts AEO. */
  inSitemap: boolean;
  /** Directive meta robots à émettre, ou `undefined`. */
  robots: string | undefined;
  /** État diffusable par un flux futur, sans en créer (FR-15 hors release). */
  feedable: boolean;
};

/**
 * Résout l'état de visibility d'un article selon la matrice normative de
 * `architecture-blog-editorial.md` §4.2 (projection de `content-contract.md` §7).
 *
 * | État frontmatter        | `production` | `discoverable` | `inSitemap` | `robots`                | `feedable` |
 * | ----------------------- | ------------ | -------------- | ----------- | ----------------------- | ---------- |
 * | `draft: true`           | absent       | ✗              | ✗           | —                       | ✗          |
 * | date future             | absent       | ✗              | ✗           | —                       | ✗          |
 * | `visibility: private`   | absent       | ✗              | ✗           | —                       | ✗          |
 * | publié + `noindex`      | present      | ✗              | ✗           | `noindex, nofollow`     | ✗          |
 * | publié + `robots: false` ou `none` | present | ✗      | ✗           | `noindex, nofollow`     | ✗          |
 * | publié + `sitemap: false`/`null` | present | ✓          | ✗           | undefined               | ✗          |
 * | publié + indexable      | present      | ✓              | ✓           | undefined               | ✓          |
 *
 * Les valeurs `robots: "false"`, `robots: "none"` et `robots: "noindex"` sont repliées dans
 * la ligne `robots` : le contrat les expose (`noindex: true` est traité par la couche A et
 * par `getBlogRobotsDirective`, les trois autres par `hasNoindexDirective`).
 *
 * **Précédence, résolue dans l'ordre.** Rang 1 : `draft` / date future / `visibility: private`
 * → `production: "absent"`, ce qui implique `robots: undefined` et `feedable: false` quelle que
 * soit la directive déclarée. Rang 2 : `noindex` / robots noindex → `discoverable: false`,
 * `inSitemap: false`, directive émise. Rang 3 : `sitemap: false` / `null` → `inSitemap: false`
 * seul, **sans** toucher `discoverable` : `sitemap` est un contrôle de propreté de découverte,
 * pas de confidentialité. Un article portant `noindex: true` **et** `sitemap: false` se résout
 * par le rang 2.
 *
 * **Mapping vers `SeoContentRouteState`** (`nuxt.config.ts`, mapping nominatif obligatoire) :
 *
 * ```ts
 * prerender: state.production === "present";
 * indexable: state.inSitemap;
 * ```
 *
 * `prerender` n'a pas d'équivalent dans cet état : `noindex` a du HTML mais pas de sitemap,
 * `sitemap: false` l'inverse. `prerender: state.discoverable` supprimerait le HTML d'un article
 * `noindex` ; `indexable: state.discoverable` réintroduirait un article `sitemap: false` au
 * sitemap et aux artefacts AEO.
 *
 * **Totalité.** Le resolver ne lève jamais : une entrée nulle, non objet, malformée ou
 * inconnue renvoie l'état **le plus restrictif**, `production: "absent"`. Une date absente,
 * hors format `YYYY-MM-DD` ou de réalité calendaire invalide ne prouve aucune publication,
 * donc l'absence de production. Une valeur de `visibility` hors enum n'est pas un état de
 * visibility : elle est refusée en amont par `assertBlogContentContract()`, seul échec dur du
 * build, et n'est donc jamais publiée ici. `feedable` est produit pour un flux futur (FR-15
 * hors release) et n'est consommé par rien.
 */
export function resolveBlogVisibility(entry: unknown, now?: Date): BlogVisibilityState {
  // `Array#filter` transmet l'index de l'entrée comme second argument : sans cette garde,
  // un `0`, `1` ou `2` serait lu comme une date de référence. Le test de `NaN` ferme le
  // contrat « ne lève jamais » : `Intl.DateTimeFormat#formatToParts` lève un `RangeError`
  // sur une `Date` invalide, que `instanceof` laisserait passer.
  const referenceDate = now instanceof Date && !Number.isNaN(now.getTime()) ? now : new Date();
  const metadata = (typeof entry === "object" && entry !== null ? entry : {}) as BlogIndexabilityEntry;

  // Rang 1 — `draft` / date future / `visibility: private` → `production: "absent"`.
  //
  // Le test de date est **dupliqué verbatim** de `isIndexableBlogEntry` et n'est jamais
  // factorisé ni délégué : la couche A est sérialisée par `Function#toString()` et ne peut
  // référencer aucune constante ou fonction externe (AD-02). Un resolver qui écrivait
  // « !draft && !futur » sans cette sémantique Europe/Paris divergerait d'un jour à chaque
  // bascule de minuit, et la CI recalcule `paris_today` indépendamment.
  const rawDate = metadata.date;
  let dateIsPublished = false;
  if (typeof rawDate === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(rawDate);
    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      // `new Date(0)` puis `setUTCFullYear`, et non `Date.UTC` : voir la copie côté couche A.
      const parsedDate = new Date(0);
      parsedDate.setUTCFullYear(year, month - 1, day);
      if (
        parsedDate.getUTCFullYear() === year &&
        parsedDate.getUTCMonth() === month - 1 &&
        parsedDate.getUTCDate() === day
      ) {
        const parisDateParts = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Europe/Paris",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).formatToParts(referenceDate);
        const dateParts = Object.fromEntries(parisDateParts.map(({ type, value }) => [type, value]));
        const todayInParis = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
        dateIsPublished = rawDate <= todayInParis;
      }
    }
  }

  const production: "present" | "absent" =
    dateIsPublished && metadata.draft !== true && metadata.visibility !== "private" ? "present" : "absent";

  // Rang 2 — `noindex` / robots noindex. Le test `noindex === true` est obligatoire et non
  // optionnel : il court-circuite la couche A avant tout test robots, alors que
  // `getBlogRobotsDirective` produit bien `"noindex, nofollow"` pour ce seul cas. Un test
  // limité aux directives rendrait `discoverable: true` et `robots: "noindex, nofollow"`
  // sur la même entrée — un état auto-contradictoire. Réutiliser `hasNoindexDirective`, le
  // helper même de `getBlogRobotsDirective`, rend cette contradiction impossible.
  const noindexEtRobots =
    metadata.noindex === true || [metadata.robots, metadata.seo?.robots].some(hasNoindexDirective);

  // Rang 3 — exclusion sitemap. Dupliquée inline, jamais déléguée : `inSitemap` doit rester
  // lisible côte à côte de la copie de `isIndexableBlogEntry`.
  const sitemapExcluded = metadata.sitemap === false || metadata.sitemap === "false" || metadata.sitemap === null;

  const discoverable = production === "present" && !noindexEtRobots;
  const inSitemap = production === "present" && !noindexEtRobots && !sitemapExcluded;

  return {
    production,
    discoverable,
    inSitemap,
    // Pas de HTML, pas de directive : la matrice porte `—` quand `production` est absent.
    robots: production === "absent" ? undefined : getBlogRobotsDirective(metadata),
    feedable: inSitemap,
  };
}
