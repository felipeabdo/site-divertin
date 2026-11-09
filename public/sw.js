/* Divertin — cache offline da aplicação. Atualize CACHE_VERSION quando mudar a estratégia. */
const CACHE_VERSION = 'divertin-offline-v6';
const APP_CACHE = `${CACHE_VERSION}-app`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;

const CORE_URLS = [
  '/',
  '/contato',
  '/quem-somos',
  '/servicos',
  '/servicos/fonoaudiologia-infantil',
  '/servicos/pediatria',
  '/offline-fallback.html',
  '/mascote-offline-glass.webp',
  '/mascote-online-glass.webp',
  '/mascote-offline-glass-natal.webp',
  '/mascote-online-glass-natal.webp',
  '/descanso-natal.webp',
  '/descanso2-natal.webp',
  '/descanso3-natal.webp',
  '/descanso4-natal.webp',
  '/santa-hat.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const appCache = await caches.open(APP_CACHE);
    const assetCache = await caches.open(ASSET_CACHE);

    await Promise.all(CORE_URLS.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (!response.ok) return;
        const destination = url.endsWith('.html') || !url.includes('.') ? appCache : assetCache;
        await destination.put(url, response.clone());
        if (destination === appCache) {
          await precacheReferencedAssets(response, assetCache);
        }
      } catch {
        // A instalação não deve falhar se uma rota estiver temporariamente indisponível.
      }
    }));

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith('divertin-offline-') && ![APP_CACHE, ASSET_CACHE].includes(key))
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

function canonicalPath(url) {
  return url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : '/';
}

async function precacheReferencedAssets(htmlResponse, assetCache) {
  try {
    const html = await htmlResponse.clone().text();
    const urls = new Set();

    for (const match of html.matchAll(/(?:src|href|poster)=["']([^"']+)["']/gi)) {
      const value = match[1].replace(/&amp;/g, '&');
      if (value.startsWith('/') && !value.startsWith('//')) urls.add(value);
    }

    for (const match of html.matchAll(/url\(["']?([^)'"\s]+(?:\s[^)'"\s]+)*)["']?\)/gi)) {
      const value = match[1].trim().replace(/&amp;/g, '&');
      if (value.startsWith('/') && !value.startsWith('//')) urls.add(value);
    }

    for (const match of html.matchAll(/\/\_next\/(?:static|image)\/?[^"'\s<>)]*/g)) {
      urls.add(match[0].replace(/&amp;/g, '&'));
    }

    await Promise.all([...urls].map(async (value) => {
      try {
        const assetUrl = new URL(value, self.location.origin);
        if (assetUrl.origin !== self.location.origin || assetUrl.pathname.startsWith('/api/')) return;
        if (await assetCache.match(assetUrl.href)) return;
        const response = await fetch(assetUrl.href, { cache: 'reload' });
        if (response.ok && response.type !== 'opaque') {
          await assetCache.put(assetUrl.href, response.clone());
        }
      } catch {
        // Um recurso ausente não deve impedir o restante do cache offline.
      }
    }));
  } catch {
    // O HTML continua armazenado mesmo quando não é possível extrair seus recursos.
  }
}

async function networkFirstNavigation(request) {
  const url = new URL(request.url);
  const path = canonicalPath(url);
  const appCache = await caches.open(APP_CACHE);

  try {
    const response = await fetch(request);
    if (response && response.ok && response.type !== 'opaque') {
      await appCache.put(path, response.clone());
    }
    return response;
  } catch {
    const cached = await appCache.match(path) || await appCache.match(request);
    if (cached) return cached;

    // A página inicial é uma alternativa útil quando uma rota ainda não foi armazenada.
    const home = await appCache.match('/');
    if (home) return home;

    const fallback = await appCache.match('/offline-fallback.html');
    if (fallback) return fallback;

    return new Response('Você está sem conexão. Volte à página anterior ou tente novamente quando a internet retornar.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

async function cacheFirstAsset(request) {
  const assetCache = await caches.open(ASSET_CACHE);
  const cached = await assetCache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok && response.type !== 'opaque') {
      await assetCache.put(request, response.clone());
    }
    return response;
  } catch {
    return cached || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  const isStaticAsset = url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image') ||
    /\.(?:avif|css|eot|gif|ico|jpe?g|js|png|svg|webp|woff2?)$/i.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(cacheFirstAsset(request));
  }
});
