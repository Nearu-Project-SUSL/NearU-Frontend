/**
 * useStudentRideHub.ts
 *
 * SignalR hook for the **Student** side of the Rides feature.
 *
 * Listens for:
 *  - RideStateChanged  → notify the student of ride progress (Accepted →
 *                        RiderArrived → InProgress → Completed / Cancelled)
 *  - LocationUpdated   → real-time rider GPS (forwarded to page callback)
 *
 * All status updates are pushed to:
 *  1. The global notificationStore (bell icon, persisted history)
 *  2. A sonner toast               (immediate foreground visibility)
 *  3. Optional page-level callbacks (onStateChange / onLocationUpdate)
 *
 * Usage:
 *   useStudentRideHub({
 *     accessToken     : auth?.accessToken,
 *     enabled         : !!auth?.accessToken,
 *     onStateChange   : (payload) => { … },  // optional
 *     onLocationUpdate: (coords)  => { … },  // optional
 *   });
 */

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { rideHub } from '../services/rideHubService';
import { useNotificationStore } from '../store/notificationStore';
import type { RideStatePayload, LocationPayload } from '../services/rideHubService';

interface UseStudentRideHubOptions {
  accessToken?    : string | null;
  enabled?        : boolean;
  onStateChange?  : (payload: RideStatePayload) => void;
  onLocationUpdate?: (payload: LocationPayload) => void;
}

// Human-readable messages for each backend status
const STATUS_META: Record<string, { title: string; body: string; emoji: string }> = {
  Accepted:            { title: 'Rider Accepted',              body: 'Your rider is heading to pick you up.',               emoji: '🛵' },
  RiderEnRoute:        { title: 'Rider En Route',              body: 'Your rider is on the way to your pickup point.',      emoji: '🛵' },
  RiderArrived:        { title: 'Rider Arrived!',              body: 'Your rider is waiting at the pickup point.',          emoji: '📍' },
  InProgress:          { title: 'Ride Started',                body: 'You are on your way. Enjoy your ride!',               emoji: '🚦' },
  CompletedByRider:    { title: 'Trip Done — Confirm?',        body: 'Your rider marked the trip complete. Please confirm.',emoji: '✅' },
  PendingConfirmation: { title: 'Awaiting Your Confirmation',  body: 'Please open the app to confirm the trip is complete.',emoji: '⏳' },
  Completed:           { title: 'Ride Completed 🎉',           body: 'Hope you had a great ride! Thank you for using NearU.',emoji: '🎉' },
  Cancelled:           { title: 'Ride Cancelled',              body: 'The ride has been cancelled.',                        emoji: '❌' },
};

export function useStudentRideHub({
  accessToken,
  enabled = true,
  onStateChange,
  onLocationUpdate,
}: UseStudentRideHubOptions) {

  const mountedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !accessToken) return;
    let mounted = true;
    mountedRef.current = true;

    const connect = async () => {
      try {
        rideHub.setCallbacks({
          // Students don't receive new ride request broadcasts
          onRideRequest: () => {},

          onRideStateChanged: (payload) => {
            if (!mounted) return;

            const meta = STATUS_META[payload.status];
            if (meta) {
              // 1. Persist to notification bell
              const { addNotification } = useNotificationStore.getState();
              addNotification({
                type   : 'ride',
                title  : `${meta.emoji} ${meta.title}`,
                message: meta.body,
                route  : '/rides',
                rideId : payload.rideId,
              });

              // 2. Foreground toast
              const toastFn =
                payload.status === 'Cancelled' ? toast.error  :
                payload.status === 'Completed' ? toast.success :
                toast.info;

              toastFn(`${meta.emoji} ${meta.title}`, {
                description: meta.body,
                duration   : 8000,
              });
            }

            // 3. Page-level callback
            onStateChange?.(payload);
          },

          onLocationUpdated: (coords) => {
            if (!mounted) return;
            onLocationUpdate?.(coords);
          },

          onReconnecting: () => {
            toast.loading('Reconnecting to ride server…', {
              id      : 'signalr-student-reconnecting',
              duration: Infinity,
            });
          },
          onReconnected: () => {
            toast.dismiss('signalr-student-reconnecting');
            toast.success('Reconnected!', { duration: 2000 });
          },
          onDisconnected: () => {
            toast.dismiss('signalr-student-reconnecting');
          },
        });

        await rideHub.connect(accessToken);
        console.info('[StudentRideHub] Connected.');
      } catch (err) {
        console.warn('[StudentRideHub] Failed to connect:', err);
        toast.error('Could not connect to ride server. Notifications may be delayed.');
      }
    };

    connect();

    return () => {
      mounted = false;
      rideHub.clearCallbacks();
      rideHub.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, enabled]);
}
