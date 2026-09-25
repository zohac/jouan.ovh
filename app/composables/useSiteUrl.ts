import { normalizeSiteUrl } from "../utils/site-url";

// URL publique du site (canonical / og:url / JSON-LD) — point d'accès unique.
// La valeur provient de Nuxt Site Config, elle-même alimentée au build par
// NUXT_SITE_URL. Aucun runtimeConfig.public.siteUrl concurrent n'est conservé.
export function useSiteUrl(): string {
  return normalizeSiteUrl(useSiteConfig().url);
}
