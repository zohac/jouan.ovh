export function getRandomUrl(urls: string[]): string {
  return urls[Math.floor(Math.random() * urls.length)];
}
