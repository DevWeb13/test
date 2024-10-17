/*
 * WHAT IS THIS FILE?
 *
 * The service-worker.ts file is used to have state of the art prefetching.
 * https://qwik.dev/qwikcity/prefetching/overview/
 *
 * Qwik uses a service worker to speed up your site and reduce latency, ie, not used in the traditional way of offline.
 * You can also use this file to add more functionality that runs in the service worker.
 */
import { setupServiceWorker } from '@builder.io/qwik-city/service-worker';

setupServiceWorker();

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-cache').then((cache) => {
      return cache.addAll([
        '/', // Cache la page d'accueil ou la route principale
        '/offline.html', // Une page fallback hors-ligne
        '/styles.css', // Ton CSS principal
        '/script.js', // Ton JS principal
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== 'offline-cache') {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si le cache retourne une réponse, on l'utilise
      return (
        response ||
        fetch(event.request).catch(() => {
          // En cas d'échec réseau, on retourne la page hors-ligne
          return caches.match('/offline.html').then((offlineResponse) => {
            if (offlineResponse) {
              return offlineResponse;
            } else {
              // Si même la page offline n'est pas trouvée, on retourne une réponse par défaut
              return new Response('Offline page not found', { status: 404 });
            }
          });
        })
      );
    })
  );
});

declare const self: ServiceWorkerGlobalScope;
