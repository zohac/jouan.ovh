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
