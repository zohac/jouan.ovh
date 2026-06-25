// Constantes & helpers SEO partagés (auto-importés depuis app/utils/).

// Domaine de production — cf. public/CNAME (dev.jouan.ovh). Source unique : évite la
// duplication de l'URL dans /about, /blog, /blog/[...slug].
export const SITE_URL = "https://dev.jouan.ovh";

// Construit l'entrée <script type="application/ld+json"> pour useHead, en échappant
// « < » → « < ». Garantit qu'aucune séquence "</script>" éventuellement présente
// dans les données (titres, descriptions d'articles…) ne ferme la balise prématurément.
export function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: "application/ld+json",
    innerHTML: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
