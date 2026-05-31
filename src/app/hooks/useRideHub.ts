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
          },

          // ── Unified state machine update from server ───────────────────────
          // Maps backend RideRequestStatus enum strings to frontend state.
          //   Pending             → (initial, no client action needed)
          //   Accepted            → EN_ROUTE_PICKUP   (rider accepted)
          //   RiderEnRoute        → EN_ROUTE_PICKUP   (synonym, same state)
          //   RiderArrived        → ARRIVED_WAITING   (rider at pickup)
          //   InProgress          → RIDE_IN_PROGRESS  (OTP verified, trip started)
          //   PendingConfirmation → COMPLETING        (rider marked done, waiting for student)
          //   Completed           → finish ride       (student confirmed)
          //   Cancelled           → finish ride       (cancelled by student)
          onRideStateChanged: (payload) => {
            if (!mounted) return;
            console.info('[RideHub] State changed:', payload.status, payload);

            const { rideStatus: cur } = useRiderStore.getState();

            switch (payload.status) {
              case 'Accepted':
              case 'RiderEnRoute':
                // Ride acceptance is driven by HTTP (acceptRide mutation returns the ride object).
                // This event is a confirmation — no further state action needed here.
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
