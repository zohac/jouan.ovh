// URL publique du site (canonical / og:url / JSON-LD) — point d'accès unique.
// La valeur vient de `runtimeConfig.public.siteUrl` (défaut prod https://jouan.ovh dans nuxt.config,
// surchargeable par NUXT_PUBLIC_SITE_URL). ⚠️ `useRuntimeConfig()` n'est
// appelable QUE dans un contexte Nuxt (setup de composant, plugin, middleware) — d'où ce
// composable, à consommer dans le `<script setup>` des pages, pas au niveau module d'un util
// pur (raison pour laquelle l'ancienne constante `SITE_URL` de app/utils/seo.ts a été retirée).
export function useSiteUrl(): string {
  const siteUrl = useRuntimeConfig().public.siteUrl;
  // Garde-fou fail-fast (décision D1, revue 2026-07-02) : une valeur vide ou non absolue
  // émettrait des canonical/og:url/JSON-LD RELATIFS silencieusement cassés (ex. une ligne
  // `NUXT_PUBLIC_SITE_URL=` vide décommentée dans .env → siteUrl=""). On fait plutôt
  // échouer le prerender (`generate`) tôt et bruyamment plutôt que de livrer du SEO cassé.
  let url: URL;
  try {
    url = new URL(siteUrl);
  } catch {
    throw new Error(
      `[useSiteUrl] runtimeConfig.public.siteUrl doit être une URL absolue (http[s]://), ` +
        `reçu ${JSON.stringify(siteUrl)}. Corriger le défaut dans nuxt.config.ts ou l'env NUXT_PUBLIC_SITE_URL.`,
    );
  }

  const isHttpProtocol = url.protocol === "http:" || url.protocol === "https:";
  const isOriginOnly = url.pathname === "/" && url.search === "" && url.hash === "";
  if (!isHttpProtocol || !url.hostname || !isOriginOnly) {
    throw new Error(
      `[useSiteUrl] runtimeConfig.public.siteUrl doit être une origin http(s) sans chemin, query ni hash, ` +
        `reçu ${JSON.stringify(siteUrl)}. Corriger le défaut dans nuxt.config.ts ou l'env NUXT_PUBLIC_SITE_URL.`,
    );
  }

  // Retourne l'origin normalisée pour une concaténation sûre (`${siteUrl}/about`),
  // y compris si l'override est saisi avec un slash final.
  return url.origin;
}
