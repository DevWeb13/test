// /*
//  * Service Worker File for Offline Support in Qwik SSR
//  * This file configures the service worker to enable offline functionality for your Qwik application.
//  */

// import { setupServiceWorker } from '@builder.io/qwik-city/service-worker';
// import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
// import { registerRoute } from 'workbox-routing';
// import { CacheFirst, NetworkFirst } from 'workbox-strategies';

// // Déclare la portée du service worker
// declare const self: ServiceWorkerGlobalScope;

// // Précharge les ressources critiques (générées lors de la compilation)
// try {
//   if (Array.isArray(self.__WB_MANIFEST) && self.__WB_MANIFEST.length > 0) {
//     precacheAndRoute(self.__WB_MANIFEST);
//   }
//   // Ajouter le manifest.json explicitement pour être mis en cache
//   precacheAndRoute([{ url: '/manifest.json', revision: null }]);
// } catch (e) {
//   console.error('Failed to precache resources:', e);
// }

// // Mettre en cache les fichiers statiques (images, CSS, JS) avec CacheFirst
// registerRoute(
//   ({ request }) =>
//     request.destination === 'style' ||
//     request.destination === 'script' ||
//     request.destination === 'image',
//   new CacheFirst({
//     cacheName: 'qwik-app-static-assets',
//   })
// );

// // Mettre en cache les pages HTML générées en SSR avec NetworkFirst
// registerRoute(
//   ({ request }) => request.mode === 'navigate',
//   new NetworkFirst({
//     cacheName: 'qwik-app-ssr-pages',
//   })
// );

// // Nettoie les caches obsolètes
// cleanupOutdatedCaches();

// // Initialiser le service worker de Qwik pour précharger les ressources spécifiques
// setupServiceWorker();

// // Skip waiting pour activer le nouveau service worker immédiatement après l'installation
// addEventListener('install', () => {
//   self.skipWaiting();
// });

// // Claim clients pour prendre le contrôle immédiatement après l'activation
// addEventListener('activate', () => {
//   self.clients.claim();
// });

import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

const revision = import.meta.env.BUILD_NUMBER;

precacheAndRoute([
  { url: '/', revision },
  { url: '/about/', revision },
  { url: '/service-worker.js', revision },
]);
cleanupOutdatedCaches();
registerRoute(new NavigationRoute(createHandlerBoundToURL('/')));
