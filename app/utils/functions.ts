export function getRandomUrl(urls: string[]): string {
  if (urls.length === 0) {
    throw new Error("getRandomUrl : la liste d'URLs est vide.");
  }
  return urls[Math.floor(Math.random() * urls.length)] as string;
}

export function uniqueId(): string {
  return "_" + Math.random().toString(36).slice(2, 11);
}

/**
 * Échappe les caractères HTML sensibles pour neutraliser toute injection lorsqu'une
 * chaîne d'origine non maîtrisée (saisie utilisateur, user-agent…) est rendue via v-html.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
