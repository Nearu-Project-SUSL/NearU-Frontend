/**
 * rideHubService.ts
 * SignalR hub client for the NearU Rides hub.
 *
 * Hub URL: wss://{domain}/hubs/rides?access_token={JWT}
 *
 * ─── Server → Client Events (what the server pushes to us) ──────────────────
 *   "RideStateChanged" → ({ rideId, status, updatedAtUtc }) State machine update for both parties
 *                         status values: Pending, Accepted, RiderEnRoute, RiderArrived,
 *                                        InProgress, PendingConfirmation, Completed, Cancelled
 *   "LocationUpdated"  → ({ rideId, latitude, longitude, timestamp }) Live rider GPS (to students)
 *   "ReceiveRideRequest" → (RideRequest) Nearby request broadcast to OnlineRiders group
 *
 * ─── Client → Server Methods (what we invoke) ────────────────────────────────
 *   GoOnline()                → Add this rider to OnlineRiders group
 *   GoOffline()               → Remove this rider from OnlineRiders group
 *   JoinRideChannel(rideId)   → Subscribe to a specific ride's updates
 *   LeaveRideChannel(rideId)  → Unsubscribe from a ride's updates
 */

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import type { RideRequest, ActiveRide, LocationCoords } from '../../api/riderService';

// ─── Hub Event Names ──────────────────────────────────────────────────────────
export const HUB_EVENTS = {
  // Broadcast to all OnlineRiders when a new student request is created
  RECEIVE_RIDE_REQUEST: 'NewRideAvailable',
  // State change pushed to ride:{rideId} group AND user:{userId} personal channel
  RIDE_STATE_CHANGED: 'RideStateChanged',
  // Live GPS coordinates pushed to ride:{rideId} group (students receive this)
  LOCATION_UPDATED: 'LocationUpdated',
} as const;

// ─── Event Callback Types ─────────────────────────────────────────────────────
export type RideStatePayload = {
  rideId: string;
  status: string;  // 'Pending'|'Accepted'|'RiderEnRoute'|'RiderArrived'|'InProgress'|'PendingConfirmation'|'Completed'|'Cancelled'
  updatedAtUtc: string;
};

export type LocationPayload = {
  rideId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
};

/**
 * Exact shape of the `NewRideAvailable` SignalR broadcast from the backend.
 * This is DIFFERENT from the HTTP `RideRequest` (which has displayName fields).
 * Backend payload: { rideId, serviceType, pickupLat, pickupLng, dropoffLat, dropoffLng,
 *                    estimatedFare, distanceKm, createdAtUtc }
 */
export type NewRidePayload = {
  rideId       : string;
  serviceType? : string;
  pickupLat?   : number;
  pickupLng?   : number;
  dropoffLat?  : number;
  dropoffLng?  : number;
  estimatedFare?: number;
  distanceKm?  : number;
  createdAtUtc?: string;
};

export type HubEventCallbacks = {
  /** Fired when the server broadcasts a new ride request to the OnlineRiders group */
  onRideRequest?: (request: NewRidePayload) => void;
  /**
   * Fired on every server-pushed state transition for a ride.
   * status values mirror RideRequestStatus enum:
   *   Pending | Accepted | RiderEnRoute | RiderArrived |
   *   InProgress | PendingConfirmation | Completed | Cancelled
   */
  onRideStateChanged?: (payload: RideStatePayload) => void;
  /** Fired when the server pushes a live GPS coordinate update */
  onLocationUpdated?: (payload: LocationPayload) => void;
  /** Fired when a new rider application is submitted (Admins only) */
  onNewRiderApplication?: (payload: any) => void;
  onReconnecting?: () => void;
  onReconnected?: () => void;
  onDisconnected?: (error?: Error) => void;
};

// ─── Hub Service Class ────────────────────────────────────────────────────────
class RideHubService {
  private connection: HubConnection | null = null;
  private callbacks: HubEventCallbacks = {};
  private hubUrl: string = '';

  /**
   * Build and start the hub connection.
   * Call this after login when an access token is available.
   */
  async connect(accessToken: string): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) return;

    // VITE_API_BASE_URL includes the "/api" segment (e.g. "https://api.nearusab.me/api").
    // The SignalR hub lives at the root origin ("/hubs/rides"), not under "/api",
    // so we strip a trailing "/api" (with optional slash) before composing the hub URL.
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const hubBaseUrl = baseUrl.replace(/\/api\/?$/, '');
    this.hubUrl = `${hubBaseUrl}/hubs/rides`;

    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        // Always return the freshest token from localStorage so reconnects
        // after a token refresh use the new JWT instead of a stale one.
        accessTokenFactory: () =>
          localStorage.getItem('auth_accessToken') ?? accessToken,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential back-off: 0s, 2s, 10s, 30s, then null (stop)
          const delays = [0, 2000, 10000, 30000];
          return delays[retryContext.previousRetryCount] ?? null;
        },
      })
      .configureLogging(
        import.meta.env.DEV ? LogLevel.Information : LogLevel.Error
      )
      .build();

    this.registerHandlers();

    try {
      await this.connection.start();
      console.info('[RideHub] Connected.');
    } catch (err) {
      console.error('[RideHub] Connection failed:', err);
      throw err;
    }
  }

  /**
   * Gracefully stop the hub connection.
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.info('[RideHub] Disconnected.');
    }
  }

  /** Register all server→client event listeners on the connection. */
  private registerHandlers(): void {
    if (!this.connection) return;

    // New ride request broadcast to OnlineRiders group
    this.connection.on(HUB_EVENTS.RECEIVE_RIDE_REQUEST, (request: NewRidePayload) => {
      this.callbacks.onRideRequest?.(request);
    });

    // Unified state change event — both student & rider receive this on the ride channel
    this.connection.on(HUB_EVENTS.RIDE_STATE_CHANGED, (payload: RideStatePayload) => {
      this.callbacks.onRideStateChanged?.(payload);
    });

    // Live GPS location update — students receive this on the ride channel
    this.connection.on(HUB_EVENTS.LOCATION_UPDATED, (payload: LocationPayload) => {
      this.callbacks.onLocationUpdated?.(payload);
    });

    // New rider application real-time alert — admins receive this on connection
    this.connection.on('NewRiderApplication', (payload: any) => {
      this.callbacks.onNewRiderApplication?.(payload);
    });

    this.connection.onreconnecting(() => {
      console.warn('[RideHub] Reconnecting...');
      this.callbacks.onReconnecting?.();
    });

    this.connection.onreconnected(() => {
      console.info('[RideHub] Reconnected.');
      this.callbacks.onReconnected?.();
    });

    this.connection.onclose((error) => {
      console.warn('[RideHub] Connection closed.', error);
      this.callbacks.onDisconnected?.(error);
    });
  }

  /**
   * Register event callbacks. Call before connect() or after.
   * Replaces any previously registered callbacks.
   */
  setCallbacks(callbacks: HubEventCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /** Clear all event callbacks. */
  clearCallbacks(): void {
    this.callbacks = {};
  }

  // ─── Client → Server Invocations ──────────────────────────────────────────

  private async invoke(method: string, ...args: unknown[]): Promise<void> {
    if (this.connection?.state !== HubConnectionState.Connected) {
      console.warn(`[RideHub] Cannot invoke "${method}" — not connected.`);
      return;
    }
    try {
      await this.connection.invoke(method, ...args);
    } catch (err) {
      console.error(`[RideHub] Error invoking "${method}":`, err);
    }
  }

  /** Join the OnlineRiders group to receive nearby ride request broadcasts. */
  async goOnline(): Promise<void> {
    await this.invoke('GoOnline');
  }

  /** Leave the OnlineRiders group. */
  async goOffline(): Promise<void> {
    await this.invoke('GoOffline');
  }

  /** Subscribe to a specific ride's real-time updates (coords, status). */
  async joinRideChannel(rideId: string): Promise<void> {
    await this.invoke('JoinRideChannel', rideId);
  }

  /** Unsubscribe from a ride's update channel. */
  async leaveRideChannel(rideId: string): Promise<void> {
    await this.invoke('LeaveRideChannel', rideId);
  }

  get isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }

  get connectionState(): HubConnectionState | null {
    return this.connection?.state ?? null;
  }
}

// ─── Singleton export ─────────────────────────────────────────────────────────
// One hub connection is shared across the app lifetime.
export const rideHub = new RideHubService();
