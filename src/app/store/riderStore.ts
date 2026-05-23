/**
 * riderStore.ts
 * Zustand state machine for the Rider (Driver) flow.
 *
 * State transitions:
 *   OFFLINE → ONLINE_IDLE → RIDE_REQUESTED → EN_ROUTE_PICKUP
 *          → ARRIVED_WAITING → RIDE_IN_PROGRESS → COMPLETING → ONLINE_IDLE
 */
import { create } from 'zustand';
import type { ActiveRide, LocationCoords, RideRequest, RideStatus } from '../../api/riderService';

interface RiderStore {
  // ─── State ────────────────────────────────────────────────────────────────
  rideStatus: RideStatus;
  activeRide: ActiveRide | null;
  pendingRequest: RideRequest | null;    // The incoming ride request to accept/decline
  riderCoords: LocationCoords | null;   // Current GPS position of this rider
  otpError: string | null;

  // ─── Actions ──────────────────────────────────────────────────────────────
  goOnline: () => void;
  goOffline: () => void;
  setIncomingRequest: (request: RideRequest) => void;
  clearPendingRequest: () => void;
  acceptRequest: (ride: ActiveRide) => void;
  setArrived: () => void;
  startRide: () => void;
  setCompleting: () => void;
  finishRide: () => void;
  setRiderCoords: (coords: LocationCoords) => void;
  setOtpError: (error: string | null) => void;
}

export const useRiderStore = create<RiderStore>((set) => ({
  // ─── Initial State ────────────────────────────────────────────────────────
  rideStatus: 'OFFLINE',
  activeRide: null,
  pendingRequest: null,
  riderCoords: null,
  otpError: null,

  // ─── Actions ──────────────────────────────────────────────────────────────
  goOnline: () => set({ rideStatus: 'ONLINE_IDLE', activeRide: null, pendingRequest: null }),

  goOffline: () =>
    set({ rideStatus: 'OFFLINE', activeRide: null, pendingRequest: null, otpError: null }),

  setIncomingRequest: (request) =>
    set({ pendingRequest: request, rideStatus: 'RIDE_REQUESTED' }),

  clearPendingRequest: () =>
    set({ pendingRequest: null, rideStatus: 'ONLINE_IDLE' }),

  acceptRequest: (ride) =>
    set({ activeRide: ride, pendingRequest: null, rideStatus: 'EN_ROUTE_PICKUP' }),

  setArrived: () => set({ rideStatus: 'ARRIVED_WAITING', otpError: null }),

  startRide: () => set({ rideStatus: 'RIDE_IN_PROGRESS', otpError: null }),

  setCompleting: () => set({ rideStatus: 'COMPLETING' }),

  finishRide: () =>
    set({ rideStatus: 'ONLINE_IDLE', activeRide: null, pendingRequest: null, otpError: null }),

  setRiderCoords: (coords) => set({ riderCoords: coords }),

  setOtpError: (error) => set({ otpError: error }),
}));
