import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { useSiteUrl } from "./useSiteUrl";

export interface PageSeoOptions {
  /** Titre de la page (utilisé pour <title> et par défaut og:title, twitter:title). */
  title: string;
  /** Titre optionnel spécifique pour Open Graph et Twitter (ex. titre d'article sans suffixe). */
  ogTitle?: string;
  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
  description: string;
  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
  path?: string;
  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
  image?: string;
  /** Texte alternatif pour l'image OG/Twitter (og:image:alt, twitter:image:alt). */
  imageAlt?: string;
  /** Type Open Graph : "website" (défaut), "article" ou "profile". */
  type?: "website" | "article" | "profile";
  /** Directive meta robots facultative, notamment "noindex, nofollow" pour un article exclu. */
  robots?: string;
  /** Format Twitter Card : si omis, "summary_large_image" si type article avec image, sinon "summary". */
  twitterCard?: "summary" | "summary_large_image";
  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Composable centralisant la déclaration des métadonnées SEO par page :
 * <title>, canonical, description, Open Graph (type, title, desc, url, image, alt)
 * et Twitter Card (card, title, desc, image, alt) + JSON-LD échappé.
 *
 * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (Nuxt Site Config).
 */
export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
  const siteUrl = useSiteUrl();

  const seo = computed(() => {
    const opts = toValue(options);
    if (!opts) {
      return null;
    }

    const rawPath = opts.path ?? "";
    const cleanPath = rawPath === "" || rawPath === "/" ? "" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;

    let imageUrl: string | undefined;
    if (opts.image) {
      imageUrl = /^https?:\/\//i.test(opts.image)
        ? opts.image
        : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
    }

    const type = opts.type ?? "website";
    const twitterCard = opts.twitterCard ?? (imageUrl && type === "article" ? "summary_large_image" : "summary");

    return {
      title: opts.title,
      ogTitle: opts.ogTitle ?? opts.title,
      description: opts.description,
      canonicalUrl,
      imageUrl,
      imageAlt: opts.imageAlt,
      type,
      robots: opts.robots,
      twitterCard,
      jsonLd: opts.jsonLd,
    };
  });

  useHead(() => {
    if (!seo.value) {
      return {};
    }

    const scripts: Array<{ type: string; innerHTML: string }> = [];
    if (seo.value.jsonLd) {
      if (Array.isArray(seo.value.jsonLd)) {
        for (const item of seo.value.jsonLd) {
          scripts.push(jsonLdScript(item));
        }
      } else {
        scripts.push(jsonLdScript(seo.value.jsonLd));
      }
    }

    return {
      title: seo.value.title,
      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
      script: scripts,
    };
  });

  useSeoMeta({
    title: () => seo.value?.title,
    description: () => seo.value?.description,
    ogTitle: () => seo.value?.ogTitle,
    ogDescription: () => seo.value?.description,
    ogUrl: () => seo.value?.canonicalUrl,
    ogType: () => seo.value?.type,
    robots: () => seo.value?.robots,
    ogImage: () => seo.value?.imageUrl,
    ogImageAlt: () => seo.value?.imageAlt,
    twitterCard: () => seo.value?.twitterCard,
    twitterTitle: () => seo.value?.ogTitle,
    twitterDescription: () => seo.value?.description,
    twitterImage: () => seo.value?.imageUrl,
    twitterImageAlt: () => seo.value?.imageAlt,
  });
}
