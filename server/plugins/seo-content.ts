import { isIndexableBlogEntry, isPublishedBlogEntry } from "../../app/utils/blog-indexability";

type SitemapInputUrl = {
  loc?: unknown;
  lastmod?: unknown;
  priority?: unknown;
  changefreq?: unknown;
};

function normalizeContentPath(path: string): string {
  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    // Conserver la valeur brute permet au filtre de rester fermé sur une URL invalide.
  }
  return decoded.replace(/\/+$/, "") || "/";
}

function getSitemapPath(loc: string): string {
  try {
    return normalizeContentPath(new URL(loc).pathname);
  } catch {
    const path = loc.split(/[?#]/, 1)[0] ?? "";
    return normalizeContentPath(path.startsWith("/") ? path : `/${path}`);
  }
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("sitemap:input", async (context) => {
    const runtimeConfig = useRuntimeConfig(context.event) as {
      seoNonIndexableContentRoutes?: string[];
    };
    const entries = await queryCollection(context.event, "blog").all();
    const nonIndexablePaths = new Set([
      ...(runtimeConfig.seoNonIndexableContentRoutes ?? []).map(normalizeContentPath),
      ...entries
        .filter((entry) => !isIndexableBlogEntry(entry))
        .map((entry) => (typeof entry.path === "string" ? normalizeContentPath(entry.path) : ""))
        .filter(Boolean),
    ]);
    const indexableLastmods = new Map(
      entries
        .filter((entry) => isPublishedBlogEntry(entry) && isIndexableBlogEntry(entry))
        .filter((entry) => typeof entry.path === "string" && typeof entry.date === "string")
        .map((entry) => [normalizeContentPath(entry.path), entry.updated ?? entry.date]),
    );

    context.urls = context.urls.filter((url: SitemapInputUrl) => {
      if (typeof url.loc !== "string") {
        return true;
      }
      const path = getSitemapPath(url.loc);
      if (nonIndexablePaths.has(path)) {
        return false;
      }
      const lastmod = indexableLastmods.get(path);
      if (lastmod) {
        url.lastmod = lastmod;
        delete url.priority;
        delete url.changefreq;
      }
      return true;
    });
  });
});
