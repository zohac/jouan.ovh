import { getRequestURL } from "h3";
import { resolveBlogVisibility } from "../../app/utils/blog-indexability";
import { removeAeoLink } from "../../app/utils/aeo-markdown";

/**
 * Nettoyage contrôlé de la conversion HTML → Markdown d'AI Ready.
 *
 * Le preset minimal retire déjà les éléments triviaux. Cette liste rend le contrat
 * explicite pour le châssis du site : les agents reçoivent le contenu principal,
 * jamais le terminal, le toast de consentement, les formulaires ou les outils de
 * développement. Les articles @nuxt/content ne passent pas par ce hook : leur
 * Markdown source est préservé par `aiReady.contentSource`.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("ai-ready:mdreamConfig", (options) => {
    const exclude = options.filter?.exclude ?? [];

    options.filter = {
      ...options.filter,
      exclude: [
        ...exclude,
        "header",
        "footer",
        "nav",
        "aside",
        "form",
        "fieldset",
        "button",
        "[role='dialog']",
        ".consent-toast",
        ".consent",
        ".terminal",
        ".terminal-window",
        ".home-hero-terminal",
        ".hero-term",
        ".contact__term",
        ".custom-cursor",
        ".atmos",
        "[aria-haspopup='dialog']",
        "[data-ai-ready-ignore]",
      ],
      processChildren: false,
    };
  });

  nitroApp.hooks.hook("render:response", async (response, { event }) => {
    if (typeof response.body !== "string" || !String(response.headers?.["content-type"] ?? "").includes("text/html")) {
      return;
    }

    let pathname: string;
    try {
      pathname = decodeURIComponent(getRequestURL(event).pathname);
    } catch {
      return;
    }

    if (pathname !== "/blog" && pathname !== "/blog.md" && !pathname.startsWith("/blog/")) {
      return;
    }

    const route = pathname.replace(/\/+$/u, "").replace(/\.md$/u, "") || "/";
    const entry = await queryCollection(event, "blog").path(route).first();
    if (!entry) {
      return;
    }
    // La polarité d'origine est restaurée explicitement : ce plugin ne nettoie que les
    // jumeaux Markdown d'articles **publiés mais exclus de la découverte**. Réduire la
    // garde à `!inSitemap` élargirait son périmètre aux articles `draft`, à venir et
    // `private`, dont la réponse est un 404 — le middleware `aeo-content-visibility`
    // intercepterait, mais la validité de ce plugin dépendrait alors de l'ordre
    // middleware/plugin, un couplage invisible. Les deux termes sont donc conservés :
    // `production === "absent"` (équivalent de `!isPublishedBlogEntry`) et `inSitemap`
    // (équivalent de `isIndexableBlogEntry`).
    const state = resolveBlogVisibility(entry);
    if (state.production === "absent" || state.inSitemap) {
      return;
    }

    const markdownRoute = route === "/" ? "/index.md" : `${route}.md`;
    response.body = removeAeoLink(removeAeoLink(response.body, "alternate", markdownRoute), "describedby", "/llms.txt");
    response.headers ??= {};
    response.headers["content-length"] = String(Buffer.byteLength(response.body, "utf8"));
  });
});
