import { defineCollection, defineContentConfig } from "@nuxt/content";
import { blogContentSchema } from "./app/utils/blog-content-contract";

// @nuxt/content v3 — déclaration explicite des collections (remplace l'auto-scan v2).
// Le contrat éditorial lui-même vit dans `app/utils/blog-content-contract.ts` : il doit
// rester importable par `nuxt.config.ts`, qui l'exécute sur chaque fichier parsé. Il ne
// peut pas rester ici, car `defineCollection` n'est utilisable qu'une fois le module
// Content initialisé — donc jamais au chargement de la configuration Nuxt.
export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      // L'extension est restreinte au Markdown, et c'est délibéré : `defineSitemapSchema`
      // déclare `lastmod: z.date()` et le corpus est éditorial, donc un `.yaml` ou un
      // `.json` n'a pas sa place ici. C'est aussi la **seule** façon que le point d'application
      // dur du contrat (`scanContentRouteState`) couvre la totalité de la collection :
      // `visit()` saute tout ce qui ne termine pas par `.md`, donc un `blog/**` plus large
      // laisserait passer, sans contrôle ni erreur, tout fichier d'un autre format.
      source: "blog/**/*.md",
      // type "page" fournit déjà title/description/path/body ; le contrat type ici les
      // champs additionnels consommés par la liste du blog et les schémas SEO officiels.
      schema: blogContentSchema,
    }),
  },
});
