/**
 * useFcm.ts
 * React hook that manages the full FCM lifecycle:
 *
 *  1. Registers the service worker (/firebase-messaging-sw.js)
 *  2. Sends Firebase config to the SW via postMessage (so it can handle
 *     background notifications without exposing credentials in a public file)
 *  3. Requests notification permission from the browser
 *  4. Retrieves the FCM device token
 *  5. Registers the token with the backend (POST /api/rides/device-token)
 *  6. Listens for foreground messages and shows them as toasts
 *  7. On logout/unmount, removes the token from the backend
 *
 * Usage:
 *   Call useFcm({ enabled: true }) once the user is authenticated.
 *   The hook is idempotent — safe to call multiple times.
 */

import { useEffect, useRef, useCallback } from 'react';
import { getToken, onMessage, deleteToken } from 'firebase/messaging';
import { toast } from 'sonner';
import { getFirebaseMessaging, getFirebaseConfig } from '../services/firebaseService';
import riderService from '../../api/riderService';
import { useNotificationStore } from '../store/notificationStore';
import type { NotificationType } from '../store/notificationStore';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;

// Notification routing: FCM data payload action → in-app navigation path
const ACTION_ROUTES: Record<string, string> = {
  new_ride_request: '/rider',
  ride_accepted:    '/rides',
  ride_update:      '/rides',
  ride_cancelled:   '/rides',
  ride_confirmed:   '/rides',
  ride_status_update: '/rides',
};

// Map FCM action → NotificationType for the store
const ACTION_TYPE_MAP: Record<string, NotificationType> = {
  new_ride_request:   'ride',
  ride_accepted:      'ride',
  ride_update:        'ride',
  ride_cancelled:     'ride',
  ride_confirmed:     'ride',
  ride_status_update: 'ride',
};

interface UseFcmOptions {
  /** Only initialise when the user is logged in */
  enabled: boolean;
}

export function useFcm({ enabled }: UseFcmOptions) {
  const tokenRef = useRef<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const { addNotification } = useNotificationStore();

  // ─── Send config to service worker ─────────────────────────────────────────
  const sendConfigToSw = useCallback(async (sw: ServiceWorker) => {
    sw.postMessage({ type: 'FIREBASE_CONFIG', config: getFirebaseConfig() });
  }, []);

  // ─── Register token with backend ─────────────────────────────────────────
  const registerToken = useCallback(async (token: string) => {
    try {
      await riderService.registerDeviceToken(token);
      console.info('[FCM] Device token registered with backend.');
    } catch (err: unknown) {
      // Log the full error for debugging (401 = expired token, 403 = wrong role, etc.)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status: number; data?: unknown } };
        console.warn(
          '[FCM] Failed to register token with backend:',
          `HTTP ${axiosErr.response?.status}`,
          axiosErr.response?.data
        );
      } else {
        console.warn('[FCM] Failed to register token with backend:', err);
      }
    }
  }, []);

  // ─── Remove token from backend ────────────────────────────────────────────
  const removeToken = useCallback(async (token: string) => {
    try {
      await riderService.removeDeviceToken(token);
      console.info('[FCM] Device token removed from backend.');
    } catch (err) {
      console.warn('[FCM] Failed to remove token from backend:', err);
    }
  }, []);

  // ─── Core setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    // FCM requires HTTPS (or localhost) + a browser that supports SW + Push
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('[FCM] Push notifications not supported in this browser.');
      return;
    }

    // FCM config must be filled in .env — skip silently in dev if missing
    if (!VAPID_KEY || VAPID_KEY === 'your_vapid_key_here') {
      console.warn('[FCM] VITE_FIREBASE_VAPID_KEY not set — push notifications disabled.');
      return;
    }

    let mounted = true;

    const setup = async () => {
      try {
        // 1. Register the service worker
        const swRegistration = await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js',
          { scope: '/' }
        );
        console.info('[FCM] Service worker registered:', swRegistration.scope);

        // 2. Send Firebase config to the SW (needed for background notifications)
        const sw = swRegistration.active || swRegistration.installing || swRegistration.waiting;
        if (sw) {
          sendConfigToSw(sw);
        } else {
          swRegistration.addEventListener('updatefound', () => {
            const newSw = swRegistration.installing;
            if (newSw) {
              newSw.addEventListener('statechange', () => {
                if (newSw.state === 'activated') sendConfigToSw(newSw);
              });
            }
          });
        }

        // 3. Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.info('[FCM] Notification permission denied by user.');
          return;
        }

        // 4. Get the FCM token
        const messaging = getFirebaseMessaging();
        if (!messaging) return;

        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: swRegistration,
        });

        if (!mounted) return;

        tokenRef.current = token;
        console.info('[FCM] Token acquired:', token.slice(0, 20) + '...');

        // 5. Register with backend
        await registerToken(token);

        // 6. Handle foreground messages (tab is open & focused)
        unsubscribeRef.current = onMessage(messaging, (payload) => {
          if (!mounted) return;

          const { title, body } = payload.notification ?? {};
          const data = payload.data ?? {};
          const action = data.action ?? '';
          const route = ACTION_ROUTES[action];
          const notifType: NotificationType =
            ACTION_TYPE_MAP[action] ?? 'general';

          console.info('[FCM] Foreground message:', payload);

          // Add to the notification bell store (persisted history)
          addNotification({
            type: notifType,
            title: title ?? 'NearU',
            message: body ?? '',
            route,
            rideId: data.rideId,
          });

          // Also show as a rich toast with optional navigation
          toast(title ?? 'NearU', {
            description: body,
            duration: 8000,
            icon: action === 'new_ride_request'   ? '🛵' :
                  action === 'ride_accepted'      ? '✅' :
                  action === 'ride_confirmed'     ? '🎉' :
                  action === 'ride_cancelled'     ? '❌' :
                  action === 'ride_status_update' ? '🔔' : '🔔',
            action: route
              ? {
                  label: 'View',
                  onClick: () => { window.location.href = route; },
                }
              : undefined,
          });
        });
      } catch (err) {
        console.error('[FCM] Setup failed:', err);
      }
    };

    setup();

    return () => {
      mounted = false;
      // Unsubscribe foreground listener
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, [enabled, sendConfigToSw, registerToken]);

  // ─── Cleanup on logout ────────────────────────────────────────────────────
  const cleanupFcm = useCallback(async () => {
    const messaging = getFirebaseMessaging();
    const token = tokenRef.current;

    if (token) {
      await removeToken(token);
    }

    if (messaging) {
      try {
        await deleteToken(messaging);
      } catch (err) {
        console.warn('[FCM] Failed to delete local token:', err);
      }
    }

    tokenRef.current = null;
  }, [removeToken]);

  return { cleanupFcm };
}
