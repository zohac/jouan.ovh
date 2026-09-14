// Formate une date ISO (YYYY-MM-DD) en français long, ex. "12 juin 2026".
// timeZone UTC : rendu déterministe (indépendant du fuseau de build), pas de décalage
// d'un jour à l'hydration. Auto-importé (app/utils/) — partagé par l'index blog et la
// vue article. Le format ISO est garanti par le schéma de la collection (content.config.ts).
const frLongDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return frLongDate.format(date);
}
