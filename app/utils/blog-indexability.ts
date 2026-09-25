type BlogIndexabilityEntry = {
  date?: unknown;
  draft?: unknown;
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

/** Une exclusion sitemap est distincte d'une directive robots noindex. */
export function isSitemapExcluded(entry: unknown): boolean {
  const metadata = entry as BlogIndexabilityEntry;
  return metadata.sitemap === false || metadata.sitemap === "false" || metadata.sitemap === null;
}

/**
 * Détermine si un article Content peut être publié dans le site statique.
 *
 * Une date editorial `YYYY-MM-DD` devient disponible à minuit dans le fuseau de
 * publication du site (Europe/Paris), indépendamment du fuseau UTC du runner CI.
 */
export function isPublishedBlogEntry(entry: unknown, now: Date = new Date()): boolean {
  const metadata = entry as BlogIndexabilityEntry;
  return isIndexableBlogEntry(
    {
      date: metadata.date,
      draft: metadata.draft,
    },
    now,
  );
}

/**
 * Détermine si un article publié peut être découvert dans le sitemap.
 *
 * Cette fonction est volontairement autonome : `@nuxtjs/sitemap` sérialise le
 * callback avec `Function#toString()` dans son module virtuel Nitro. Elle ne doit
 * donc capturer aucune constante ou fonction externe au projet.
 */
export function isIndexableBlogEntry(entry: unknown, now?: Date): boolean {
  const metadata = entry as BlogIndexabilityEntry;
  // `@nuxtjs/sitemap` applique ce callback via `Array#filter`, qui transmet
  // l'index de l'entrée comme second argument. Ne pas interpréter cet index
  // comme une date : une fixture ou un article récent serait alors filtré à tort.
  const referenceDate = now instanceof Date ? now : new Date();
  if (typeof metadata.date !== "string" || metadata.draft === true || metadata.noindex === true) {
    return false;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(metadata.date);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsedDate = new Date(timestamp);
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
  const metadata = entry as BlogIndexabilityEntry;
  if (metadata.noindex === true || [metadata.robots, metadata.seo?.robots].some(hasNoindexDirective)) {
    return "noindex, nofollow";
  }
  return undefined;
}
