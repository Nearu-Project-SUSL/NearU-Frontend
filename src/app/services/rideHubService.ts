/**
 * rideHubService.ts
 * SignalR hub client for the NearU Rides hub.
 *
 * Hub URL: wss://{domain}/hubs/rides?access_token={JWT}
 *
 * ─── Server → Client Events (what the server pushes to us) ──────────────────
 *   "ReceiveRideRequest"  → (RideRequest) A new nearby ride request (broadcast to OnlineRiders)
 *   "RideAccepted"        → (ActiveRide)  Ride was accepted (confirmation to student)
 *   "RiderArrived"        → ()            Rider arrived at pickup
 *   "RideStarted"         → ()            OTP verified, ride is underway
 *   "RideCompleted"       → ()            Rider marked complete, pending student confirm
 *   "RideConfirmed"       → ()            Student confirmed — ride fully done
 *   "LocationUpdate"      → (LocationCoords) Live rider position update (to students)
 *   "RideCancelled"       → (reason: string) Ride was cancelled
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
  RECEIVE_RIDE_REQUEST: 'ReceiveRideRequest',
  RIDE_ACCEPTED: 'RideAccepted',
  RIDER_ARRIVED: 'RiderArrived',
  RIDE_STARTED: 'RideStarted',
  RIDE_COMPLETED: 'RideCompleted',
  RIDE_CONFIRMED: 'RideConfirmed',
  LOCATION_UPDATE: 'LocationUpdate',
  RIDE_CANCELLED: 'RideCancelled',
} as const;

// ─── Event Callback Types ─────────────────────────────────────────────────────
export type HubEventCallbacks = {
  onRideRequest?: (request: RideRequest) => void;
  onRideAccepted?: (ride: ActiveRide) => void;
  onRiderArrived?: () => void;
  onRideStarted?: () => void;
  onRideCompleted?: () => void;
  onRideConfirmed?: () => void;
  onLocationUpdate?: (coords: LocationCoords) => void;
  onRideCancelled?: (reason: string) => void;
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

    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const hubBaseUrl = baseUrl.replace(/\/api\/?$/, '');
    this.hubUrl = `${hubBaseUrl}/hubs/rides`;

    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        // JWT must be passed as query string per the backend spec
        accessTokenFactory: () => accessToken,
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

    this.connection.on(HUB_EVENTS.RECEIVE_RIDE_REQUEST, (request: RideRequest) => {
      this.callbacks.onRideRequest?.(request);
    });

    this.connection.on(HUB_EVENTS.RIDE_ACCEPTED, (ride: ActiveRide) => {
      this.callbacks.onRideAccepted?.(ride);
    });

    this.connection.on(HUB_EVENTS.RIDER_ARRIVED, () => {
      this.callbacks.onRiderArrived?.();
    });

    this.connection.on(HUB_EVENTS.RIDE_STARTED, () => {
      this.callbacks.onRideStarted?.();
    });

    this.connection.on(HUB_EVENTS.RIDE_COMPLETED, () => {
      this.callbacks.onRideCompleted?.();
    });

    this.connection.on(HUB_EVENTS.RIDE_CONFIRMED, () => {
      this.callbacks.onRideConfirmed?.();
    });

    this.connection.on(HUB_EVENTS.LOCATION_UPDATE, (coords: LocationCoords) => {
      this.callbacks.onLocationUpdate?.(coords);
    });

    this.connection.on(HUB_EVENTS.RIDE_CANCELLED, (reason: string) => {
      this.callbacks.onRideCancelled?.(reason);
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
