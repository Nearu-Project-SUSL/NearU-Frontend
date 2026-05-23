/**
 * firebaseService.ts
 * Initialises the Firebase Web SDK (client-side only).
 * Server-side Admin SDK (private key) stays exclusively in the backend.
 *
 * Config values are read from VITE_ environment variables — bundled at
 * build time, never shipped as secrets. The web SDK config is intentionally
 * public (apiKey is an identifier, not a secret).
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getMessaging, type Messaging } from 'firebase/messaging';
import { getAnalytics, type Analytics } from 'firebase/analytics';

// ─── Web SDK Config ───────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ─── Singletons ───────────────────────────────────────────────────────────────
let _app: FirebaseApp;
let _messaging: Messaging | null = null;
let _analytics: Analytics | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!_app) {
    // Guard against HMR double-init in Vite dev mode
    _app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return _app;
}

/**
 * Returns the Firebase Cloud Messaging instance.
 * Returns null in browsers that don't support the Push API
 * (e.g. Safari < 16.4, Firefox private mode).
 */
export function getFirebaseMessaging(): Messaging | null {
  if (_messaging) return _messaging;
  try {
    _messaging = getMessaging(getFirebaseApp());
    return _messaging;
  } catch {
    console.warn('[Firebase] Push messaging not supported in this browser.');
    return null;
  }
}

/**
 * Returns the Firebase Analytics instance (optional — only in production).
 * Safe to call; returns null if Analytics is not available.
 */
export function getFirebaseAnalytics(): Analytics | null {
  if (_analytics) return _analytics;
  // Analytics requires a browser environment and the measurementId
  if (typeof window === 'undefined' || !firebaseConfig.measurementId) return null;
  try {
    _analytics = getAnalytics(getFirebaseApp());
    return _analytics;
  } catch {
    return null;
  }
}

/**
 * Returns the raw config object — used by the service worker via postMessage
 * so it can initialise Firebase compat SDK in the background.
 */
export function getFirebaseConfig() {
  return firebaseConfig;
}
