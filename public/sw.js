const CACHE = 'vibetel-cache-v1'
const ASSET_RE = /\.(?:js|css|woff2?|png|jpg|jpeg|gif|webp|avif|svg|ico)$/
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', (e) => {
  const r = e.request
  if (r.method !== 'GET') return
  const u = new URL(r.url)
  if (u.origin !== location.origin) return
  if (!ASSET_RE.test(u.pathname)) return
  e.respondWith(
    caches.open(CACHE).then((c) =>
      fetch(r)
        .then((res) => {
          c.put(r, res.clone())
          return res
        })
        .catch(() => c.match(r)),
    ),
  )
})
