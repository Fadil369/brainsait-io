// Service Worker for BrainSAIT Digital Solutions Store
const CACHE_NAME = 'brainsait-store-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/css/rtl.css',
  '/assets/js/main.js',
  '/assets/images/logo.svg',
  '/assets/images/favicon.svg',
  '/assets/images/hero-healthcare.jpg',
  '/assets/images/product-ai-diagnosis.jpg',
  '/assets/images/product-patient-portal.jpg',
  '/assets/images/product-analytics.jpg',
  '/assets/images/paypal-logo.svg',
  '/assets/images/stripe-logo.svg'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notifications
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/assets/images/favicon.svg',
    badge: '/assets/images/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/assets/images/favicon.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/favicon.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BrainSAIT Store', options)
  );
});

// Notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
