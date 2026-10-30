const HTTP_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Valide et normalise l'origin canonique du site.
 *
 * Cette fonction pure est partagée entre la configuration Nuxt (qui voit la valeur
 * brute de NUXT_SITE_URL) et useSiteUrl() (qui voit la valeur résolue par Site Config).
 * Elle garantit qu'une URL vide, relative ou trop qualifiée échoue avant le build.
 */
export function normalizeSiteUrl(siteUrl: string): string {
  let url: URL;

  try {
    url = new URL(siteUrl);
  } catch {
    throw new Error(
      `[site-url] NUXT_SITE_URL doit être une URL absolue (http[s]://), ` +
        `reçu ${JSON.stringify(siteUrl)}. Corriger la source Nuxt Site Config du build.`,
    );
  }

  const isOriginOnly = url.pathname === "/" && url.search === "" && url.hash === "";
  if (!HTTP_PROTOCOLS.has(url.protocol) || !url.hostname || !isOriginOnly) {
    throw new Error(
      `[site-url] NUXT_SITE_URL doit être une origin http(s) sans chemin, query ni hash, ` +
        `reçu ${JSON.stringify(siteUrl)}. Corriger la source Nuxt Site Config du build.`,
    );
  }

  return url.origin;
}

/**
 * Forme canonique d'un chemin public : barre oblique finale.
 *
 * GitHub Pages, qui sert ce site statique, ne répond 200 que sur la forme
 * « dossier » (`/about/`) et redirige en 301 la forme sans barre (`/about`).
 * Le canonical, l'Open Graph, le JSON-LD et le sitemap doivent donc nommer
 * l'URL réellement servie : un canonical qui redirige est signalé par la
 * Search Console (« Page avec redirection », « Erreur liée aux redirections »)
 * et fragilise la consolidation des signaux d'indexation.
 *
 * Le fragment et la query sont conservés en fin d'URL, la racine reste `/` et
 * la barre finale n'est jamais doublée.
 */
export function toCanonicalPath(rawPath: string): string {
  const value = rawPath.trim();
  if (value === "") {
    return "/";
  }

  const boundaries = [value.indexOf("?"), value.indexOf("#")].filter((index) => index >= 0);
  const boundary = boundaries.length > 0 ? Math.min(...boundaries) : -1;
  const pathname = boundary === -1 ? value : value.slice(0, boundary);
  const suffix = boundary === -1 ? "" : value.slice(boundary);
  const segments = pathname.split("/").filter(Boolean);

  return segments.length === 0 ? `/${suffix}` : `/${segments.join("/")}/${suffix}`;
}

/** Concatène l'origin canonique et un chemin public sous sa forme canonique. */
export function absoluteCanonicalUrl(origin: string, path: string): string {
  return `${origin}${toCanonicalPath(path)}`;
}
