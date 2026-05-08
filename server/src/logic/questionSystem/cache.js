const cache = new Map();

export function getCached(text) {
  return cache.get(text);
}

export function saveCache(text, response) {
  cache.set(text, response);
}
