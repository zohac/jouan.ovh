// Helpers SEO partagés (auto-importés depuis app/utils/).
//
// L'URL de production du site n'est plus une constante ici : elle est lue depuis
// Nuxt Site Config via le composable `useSiteUrl()`
// (app/composables/useSiteUrl.ts) — swappable staging/prod sans domaine en dur.
// `useRuntimeConfig()` étant un composable (contexte Nuxt requis), elle ne peut pas
// vivre dans ce module pur.

// Construit l'entrée <script type="application/ld+json"> pour useHead, en échappant
// « < » → « < ». Garantit qu'aucune séquence "</script>" éventuellement présente
// dans les données (titres, descriptions d'articles…) ne ferme la balise prématurément.
export function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: "application/ld+json",
    innerHTML: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
