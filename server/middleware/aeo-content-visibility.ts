import { createError, getRequestURL } from "h3";
import { isIndexableBlogEntry, isPublishedBlogEntry } from "../../app/utils/blog-indexability";

/**
 * Empêche la lecture directe d'un jumeau Markdown pour un article exclu.
 *
 * Le build SSG produit puis nettoie les routes noindex via le hook Nitro. En
 * développement et sur un runtime Node, la source Content ne doit toutefois pas
 * devenir un chemin de contournement : un article draft, futur, noindex ou
 * explicitement exclu du sitemap répond 404 sur son URL `.md`.
 */
export default defineEventHandler(async (event) => {
  let pathname: string;
  try {
    pathname = decodeURIComponent(getRequestURL(event).pathname);
  } catch {
    return;
  }

  const isBlogMarkdown = pathname === "/blog.md" || (pathname.startsWith("/blog/") && pathname.endsWith(".md"));
  if (!isBlogMarkdown) {
    return;
  }

  // Le prerender doit pouvoir terminer sa passe avant le nettoyage final des
  // artefacts AEO ; le runtime applique le refus défensif immédiatement.
  if (import.meta.prerender) {
    return;
  }

  const route = pathname.slice(0, -3).replace(/\/+$/u, "") || "/";
  const entry = await queryCollection(event, "blog").path(route).first();
  if (!entry) {
    return;
  }

  if (!isPublishedBlogEntry(entry) || !isIndexableBlogEntry(entry)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Contenu non public",
    });
  }
});
