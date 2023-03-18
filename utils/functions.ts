export function getRandomUrl(urls: string[]): string {
  return urls[Math.floor(Math.random() * urls.length)];
}

export function uniqueId() {
  return "_" + Math.random().toString(36).slice(2, 11);
}
