function getRandomUrl(urls) {
  return urls[Math.floor(Math.random() * urls.length)];
}
function uniqueId() {
  return "_" + Math.random().toString(36).slice(2, 11);
}
export {
  getRandomUrl as g,
  uniqueId as u
};
