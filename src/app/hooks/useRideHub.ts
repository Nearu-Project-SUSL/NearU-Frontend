/**
 * useRideHub.ts
 * React hook that manages the SignalR connection lifecycle for the Rider flow.
 *
 * - Connects when `enabled` is true (i.e. user is logged in as a Rider)
 * - Calls GoOnline/GoOffline on the hub when rider toggles availability
 * - Joins/leaves the ride-specific channel when a ride is accepted/completed
 * - Propagates server-pushed events into the Zustand riderStore
 *
 * The backend sends a single unified "RideStateChanged" event with a status
 * string. This hook maps those status strings to frontend state transitions.
 */

import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { rideHub } from '../services/rideHubService';
import { useRiderStore } from '../store/riderStore';
import { useNotificationStore } from '../store/notificationStore';
import type { RideStatus } from '../../api/riderService';

interface UseRideHubOptions {
  /** JWT access token — connect only when this is available */
  accessToken: string | null;
  /** Whether the hook should be active (e.g. user is a Rider role) */
  enabled?: boolean;
}

export function useRideHub({ accessToken, enabled = true }: UseRideHubOptions) {
  const {
    rideStatus,
    activeRide,
    setIncomingRequest,
    setArrived,
    startRide,
    setCompleting,
    finishRide,
  } = useRiderStore();

  const { addNotification } = useNotificationStore();

  const prevRideStatusRef = useRef<RideStatus>(rideStatus);
  const prevActiveRideIdRef = useRef<string | null>(activeRide?.id ?? null);

  // ─── Connect / Disconnect ──────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled || !accessToken) return;

    let mounted = true;

    const connect = async () => {
      try {
        rideHub.setCallbacks({
          // ── Incoming ride request broadcast to OnlineRiders group ─────────
          onRideRequest: (request) => {
            if (!mounted) return;
            // Only surface the request if we are idle
            const { rideStatus: currentStatus } = useRiderStore.getState();
            if (currentStatus === 'ONLINE_IDLE') {
              setIncomingRequest(request);
            }
            // Always add to notification bell so riders see it even if busy
            const { addNotification: addNotif } = useNotificationStore.getState();
            addNotif({
              type: 'ride',
              title: 'New Ride Request 🛵',
              message: `A new ${(request as any).serviceType ?? ''} ride request is nearby.`,
              route: '/rider',
              rideId: (request as any).rideId ?? (request as any).id,
            });
          },

          // ── Unified state machine update from server ───────────────────────
          onRideStateChanged: (payload) => {
            if (!mounted) return;
            console.info('[RideHub] State changed:', payload.status, payload);

            const { rideStatus: cur } = useRiderStore.getState();
            const { addNotification: addNotif } = useNotificationStore.getState();

            // Map status to a human-readable notification message
            const STATUS_MESSAGES: Record<string, { title: string; message: string }> = {
              Accepted:           { title: 'Rider Accepted 🛵', message: 'Your rider is on the way to pick you up.' },
              RiderEnRoute:       { title: 'Rider En Route 🛵', message: 'Your rider is heading to your pickup location.' },
              RiderArrived:       { title: 'Rider Arrived 📍', message: 'Your rider is waiting at the pickup point.' },
              InProgress:         { title: 'Ride Started 🚦', message: 'Your ride is now in progress!' },
              CompletedByRider:   { title: 'Trip Complete — Confirm? ✅', message: 'Your rider marked the trip done. Please confirm in the app.' },
              Completed:          { title: 'Ride Completed 🎉', message: 'Your ride has been completed successfully!' },
              Cancelled:          { title: 'Ride Cancelled ❌', message: 'The ride has been cancelled.' },
              PendingConfirmation:{ title: 'Awaiting Confirmation ⏳', message: 'Waiting for the student to confirm the trip is complete.' },
            };

            const notifData = STATUS_MESSAGES[payload.status];
            if (notifData) {
              addNotif({
                type: 'ride',
                title: notifData.title,
                message: notifData.message,
                route: '/rides',
                rideId: payload.rideId,
              });
            }

            switch (payload.status) {
              case 'Accepted':
              case 'RiderEnRoute':
                break;

              case 'RiderArrived':
                if (cur === 'EN_ROUTE_PICKUP') {
                  setArrived();
                }
                break;

              case 'InProgress':
                if (cur === 'ARRIVED_WAITING') {
                  startRide();
                }
                break;

              case 'PendingConfirmation':
              case 'CompletedByRider':
                if (cur === 'RIDE_IN_PROGRESS') {
                  setCompleting();
                }
                break;

              case 'Completed':
                finishRide();
                toast.success('Ride completed & confirmed! Great job! 🎉', { duration: 5000 });
                break;

              case 'Cancelled':
                toast.warning('Ride was cancelled.', { duration: 5000 });
                finishRide();
                break;

              default:
                console.warn('[RideHub] Unhandled status:', payload.status);
            }
          },

          // ── Connection lifecycle ──────────────────────────────────────────
          onReconnecting: () => {
            toast.loading('Reconnecting to ride server...', {
              id: 'signalr-reconnecting',
              duration: Infinity,
            });
          },
          onReconnected: () => {
            toast.dismiss('signalr-reconnecting');
            toast.success('Reconnected!', { duration: 2000 });
          },
          onDisconnected: () => {
            toast.dismiss('signalr-reconnecting');
          },
        });

        await rideHub.connect(accessToken);
      } catch (err) {
        console.error('[useRideHub] Failed to connect:', err);
        toast.error('Could not connect to ride server. Some features may not work.');
      }
    };

    connect();

    return () => {
      mounted = false;
      rideHub.clearCallbacks();
      rideHub.disconnect();
    };
    // accessToken should only change on login/logout — reconnect then
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, enabled]);

  // ─── GoOnline / GoOffline when rider status changes ────────────────────────
  useEffect(() => {
    const prev = prevRideStatusRef.current;
    prevRideStatusRef.current = rideStatus;

    if (!rideHub.isConnected) return;

    // Transitioned to ONLINE_IDLE from OFFLINE
    if (prev === 'OFFLINE' && rideStatus === 'ONLINE_IDLE') {
      rideHub.goOnline();
    }

    // Transitioned to OFFLINE from any online state
    if (prev !== 'OFFLINE' && rideStatus === 'OFFLINE') {
      rideHub.goOffline();
    }
  }, [rideStatus]);

  // ─── JoinRideChannel / LeaveRideChannel when active ride changes ───────────
  useEffect(() => {
    const prevId = prevActiveRideIdRef.current;
    const currentId = activeRide?.id ?? null;
    prevActiveRideIdRef.current = currentId;

    if (!rideHub.isConnected) return;

    // Leave previous ride channel
    if (prevId && prevId !== currentId) {
      rideHub.leaveRideChannel(prevId);
    }

    // Join new ride channel
    if (currentId && currentId !== prevId) {
      rideHub.joinRideChannel(currentId);
    }
  }, [activeRide?.id]);

  // ─── Manual invocation helpers (optional — can call rideHub directly) ──────
  const hubGoOnline = useCallback(() => rideHub.goOnline(), []);
  const hubGoOffline = useCallback(() => rideHub.goOffline(), []);

  return {
    isHubConnected: rideHub.isConnected,
    hubGoOnline,
    hubGoOffline,
  };
}
