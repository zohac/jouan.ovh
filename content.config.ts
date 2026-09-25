import { defineCollection, defineContentConfig, z } from "@nuxt/content";
import { defineRobotsSchema } from "@nuxtjs/robots/content";
import { defineSitemapSchema } from "@nuxtjs/sitemap/content";
import { isIndexableBlogEntry } from "./app/utils/blog-indexability";

// @nuxt/content v3 — déclaration explicite des collections (remplace l'auto-scan v2).
// La collection blog reste vide tant qu'aucun article n'est ajouté sous content/blog/.
export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/**",
      // type "page" fournit déjà title/description/path/body ; on type ici les champs
      // additionnels consommés par la liste du blog et les schémas SEO officiels.
      schema: z
        .object({
          // Date ISO (YYYY-MM-DD) : tri lexicographique = tri chronologique, formatée en
          // français à l'affichage. Sert au `.order("date", "DESC")`. Le `regex` fait
          // échouer le build sur un format dévié (plutôt qu'un « Invalid Date » à l'écran
          // et un tri faux).
          date: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "date doit être au format ISO YYYY-MM-DD")
            .refine((value) => {
              const [year, month, day] = value.split("-").map(Number);
              const parsed = new Date(Date.UTC(year, month - 1, day));
              return (
                parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day
              );
            }, "date doit contenir une date calendaire valide"),
          // Date de mise à jour optionnelle, rétrocompatible avec les articles existants.
          updated: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "updated doit être au format ISO YYYY-MM-DD")
            .refine((value) => {
              const [year, month, day] = value.split("-").map(Number);
              const parsed = new Date(Date.UTC(year, month - 1, day));
              return (
                parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day
              );
            }, "updated doit contenir une date calendaire valide")
            .optional(),
          // Alias interne alimenté par le hook Content pour `nuxt-ai-ready` :
          // la collection conserve `updated` comme source éditoriale unique.
          updatedAt: z.string().optional(),
          // États de publication optionnels, appliqués uniformlyément au HTML via
          // usePageSeo puis aux deux modules Nuxt SEO via leurs schémas Content.
          draft: z.boolean().optional(),
          noindex: z.boolean().optional(),
          // Tags (technos / sujets) rendus en ZTag.
          tags: z.array(z.string()).default([]),
          // Temps de lecture affiché dans la méta (ex. "8 min").
          read: z.string().optional(),
          // Vignette d'article (facultative).
          image: z
            .object({
              src: z.string(),
              alt: z.string(),
            })
            .optional(),
          // Champ interne overwritten par la transformation ci-dessous ; il permet de
          // conserver l'exclusion après la normalisation du champ officiel `sitemap`.
          sitemapExcluded: z.boolean().optional(),
          // `defineSitemapSchema()` accepte l'objet SEO officiel ou l'absence de
          // champ. Les sentinelles false/null permettent d'exclure explicitement une
          // URL sans faire échouer la validation Zod de la collection.
          sitemap: z.union([
            defineSitemapSchema({
              name: "blog",
              z,
              filter: isIndexableBlogEntry,
              onUrl: (url, entry) => {
                const metadata = entry as typeof entry & { date: string; updated?: string };
                url.lastmod = metadata.updated ?? metadata.date;
                // Aucun signal de priorité/fréquence : Google les ignore et aucun autre
                // consommateur ne le demande dans le contrat actuel.
                delete url.priority;
                delete url.changefreq;
              },
            }),
            z.literal(false),
            z.null(),
          ]),
          robots: defineRobotsSchema(),
        })
        .refine((entry) => !entry.updated || entry.updated >= entry.date, {
          message: "updated doit être postérieure ou égale à date",
          path: ["updated"],
        })
        .superRefine((entry, context) => {
          if (typeof entry.sitemap === "object" && entry.sitemap?.loc !== undefined) {
            context.addIssue({
              code: "custom",
              message: "sitemap.loc est interdit : utilisez le chemin réel de l’entrée Content",
              path: ["sitemap", "loc"],
            });
          }
        }),
    }),
  },
});
