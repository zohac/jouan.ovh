import { defineContentConfig, defineCollection, z } from "@nuxt/content";

// @nuxt/content v3 — déclaration explicite des collections (remplace l'auto-scan v2).
// La collection blog reste vide tant qu'aucun article n'est ajouté sous content/blog/.
export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/**",
      // Champ image optionnel en front-matter (vignette d'article), typé pour la liste du blog.
      schema: z.object({
        image: z
          .object({
            src: z.string(),
            alt: z.string(),
          })
          .optional(),
      }),
    }),
  },
});
