const CACHE_NAME = 'posture-corrector-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/good_posture.webp',
  '/assets/notif_sound.mp3',
  '/assets/android-chrome-192x192.png',
  '/assets/android-chrome-512x512.png',
  // Add more assets like scripts, styles, and images
];

// Install service worker and cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve assets from the cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached assets if found, otherwise fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate service worker and clear old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});

// Listen for push notifications
self.addEventListener('push', (event) => {
  let data = { title: 'Posture Alert', message: 'Incorrect posture detected!' };

  if (event.data) {
    // Assuming the push payload is JSON
    data = event.data.json();
  }

  const options = {
    body: data.message,
    icon: '/assets/icon-192x192.png',
    badge: '/assets/icon-192x192.png',
  };

  // Show the notification
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification when clicked
  
  // Focus on the app window or open a specific page
  event.waitUntil(
    clients.openWindow('/') // You can specify any URL here
  );
});