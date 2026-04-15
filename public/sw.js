const CACHE_NAME = 'ccm-shell-v1';
const OFFLINE_QUEUE_STORE = 'ccm-offline-queue';

// App shell assets to pre-cache on install
const SHELL_ASSETS = [
  '/',
  '/en/dashboard',
];

// ─── Install — cache app shell ──────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

// ─── Activate — remove old caches ───────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch — cache-first for static, network-first for API ──────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Network-first for API routes
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for everything else (static assets, pages)
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

// ─── Background sync — replay queued POST requests ──────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'ccm-post-queue') {
    event.waitUntil(replayQueue());
  }
});

async function openQueueStore() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(OFFLINE_QUEUE_STORE, 1);
    request.onupgradeneeded = e => {
      e.target.result.createObjectStore('requests', { autoIncrement: true });
    };
    request.onsuccess = e => resolve(e.target.result);
    request.onerror = e => reject(e.target.error);
  });
}

async function replayQueue() {
  const db = await openQueueStore();
  const tx = db.transaction('requests', 'readwrite');
  const store = tx.objectStore('requests');
  const all = await new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  for (const entry of all) {
    try {
      await fetch(entry.url, {
        method: entry.method,
        headers: entry.headers,
        body: entry.body,
      });
      // Remove on success
      await new Promise((resolve, reject) => {
        const req = store.delete(entry.key);
        req.onsuccess = resolve;
        req.onerror = reject;
      });
    } catch {
      // Leave in queue to retry on next sync
    }
  }
}

// ─── Push notification handler ───────────────────────────────────────────────
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Carlisle CCM', {
      body: data.body ?? '',
      icon: '/icons/icon-192.png',
    })
  );
});
