const CACHE_VERSION = 0;
const cache = await caches.open(`crosspad-${CACHE_VERSION}`);

export async function fetchCached(url, skipCache = false) {
    const cached = await cache.match(url);

    if (!skipCache && cached) return cached;

    const res = await fetch(url);

    cache.put(url, res);

    return res;
}