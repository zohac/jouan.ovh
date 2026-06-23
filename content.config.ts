import { defineContentConfig, defineCollection, z } from "@nuxt/content";

// @nuxt/content v3 — déclaration explicite des collections (remplace l'auto-scan v2).
// La collection blog reste vide tant qu'aucun article n'est ajouté sous content/blog/.
export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/**",
      // type "page" fournit déjà title/description/path/body ; on type ici les champs
      // additionnels consommés par la liste du blog (tri par date, tags, temps de lecture).
      schema: z.object({
        // Date ISO (YYYY-MM-DD) : tri lexicographique = tri chronologique, formatée en
        // français à l'affichage. Sert au `.order("date", "DESC")`. Le `regex` fait
        // échouer le build sur un format dévié (plutôt qu'un « Invalid Date » à l'écran
        // et un tri faux).
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date doit être au format ISO YYYY-MM-DD"),
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
      }),
    }),
  },
});
