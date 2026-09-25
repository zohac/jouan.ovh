function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Retire un lien AEO précis sans supprimer le reste d'une ligne Markdown. */
export function removeAeoLink(html: string, relation: string, href: string): string {
  const pattern = new RegExp(
    `<link\\b(?=[^>]*\\brel=["']${escapeRegExp(relation)}["'])(?=[^>]*\\bhref=["']${escapeRegExp(href)}["'])[^>]*>`,
    "giu",
  );
  return html.replace(pattern, "");
}
