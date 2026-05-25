/**
 * firebase-messaging-sw.js
 * Background service worker for Firebase Cloud Messaging.
 * Handles push notifications when the NearU tab is closed or not focused.
 *
 * IMPORTANT: This file lives in /public so it is served at the root path.
 * It CANNOT use Vite env vars — config is injected at runtime via postMessage
 * from firebaseService.ts.
 *
 * Firebase compat CDN is used because ES module imports are not allowed
 * in service workers by default.
 */

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// ─── Config injection via postMessage ────────────────────────────────────────
// The main thread sends FIREBASE_CONFIG before the first notification.
let messaging = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(event.data.config);
      messaging = firebase.messaging();
      console.log('[FCM SW] Firebase initialised in service worker.');
    }
  }
});

// ─── Background message handler ───────────────────────────────────────────────
// Fired when a notification arrives and the app tab is NOT in focus.
self.addEventListener('push', (event) => {
  // Firebase handles this automatically once messaging is set up above,
  // but we add manual handling here as a safety net for data-only messages.
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const notification = payload.notification || {};
    const data = payload.data || {};

    // Determine the click URL based on the action type in the data payload
    let clickUrl = '/';
    if (data.action === 'new_ride_request') clickUrl = '/rider';
    else if (data.action === 'ride_accepted')  clickUrl = '/rides';
    else if (data.action === 'ride_update')    clickUrl = '/rides';

    event.waitUntil(
      self.registration.showNotification(notification.title || 'NearU', {
        body: notification.body || '',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: data.rideId || 'nearu-notification',   // collapses duplicate notifs
        renotify: true,
        data: { clickUrl, ...data },
        actions: data.action === 'new_ride_request'
          ? [{ action: 'view', title: 'View Request' }]
          : [],
      })
    );
  } catch (err) {
    // Firebase compat SDK already handled a notification-type message
    console.debug('[FCM SW] Push event handled by Firebase SDK.');
  }
});

// ─── Notification click handler ───────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const clickUrl = event.notification.data?.clickUrl || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If the app is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(clickUrl);
          return;
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow(clickUrl);
      }
    })
  );
});
