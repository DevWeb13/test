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

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .open('offline-cache')
      .then((cache) => {
        return cache.addAll([
          '/', // La page principale
          '/build/*', // Les fichiers de build
        ]);
      })
      .catch((error) => {
        console.error('Erreur lors du cache des fichiers:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
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

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response; // Si une réponse est trouvée dans le cache, on la renvoie
        }
        return fetch(event.request).catch(() => {
          // Si la requête réseau échoue, on renvoie la page offline
          return caches.match('/offline.html').then((offlineResponse) => {
            return (
              offlineResponse ||
              new Response('Offline page not found', { status: 404 })
            );
          });
        });
      })
      .catch((error) => {
        console.error('Erreur lors de la gestion de fetch:', error);
        return new Response('Erreur réseau', { status: 500 });
      })
  );
});

declare const self: ServiceWorkerGlobalScope;
