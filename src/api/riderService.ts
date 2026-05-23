/**
 * riderService.ts
 * All HTTP API calls for the Rider & Ride-related flows.
 * Endpoints verified against the backend RideController.
 *
 * Real-time coordination (nearby request broadcasts, ride status updates,
 * and live location streaming) is handled separately via SignalR:
 * → see src/app/services/rideHubService.ts
 */
import axiosPrivate from './axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RideRequest {
  id: string;
  studentName: string;
  pickupLocation: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLocation: string;
  dropoffLat: number;
  dropoffLng: number;
  fareEstimate: number;
  distanceKm: number;
  createdAt: string;
}

export interface ActiveRide {
  id: string;
  studentName: string;
  pickupLocation: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLocation: string;
  dropoffLat: number;
  dropoffLng: number;
  fareEstimate: number;
  status: RideStatus;
}

export type RideStatus =
  | 'OFFLINE'
  | 'ONLINE_IDLE'
  | 'RIDE_REQUESTED'
  | 'EN_ROUTE_PICKUP'
  | 'ARRIVED_WAITING'
  | 'RIDE_IN_PROGRESS'
  | 'COMPLETING';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface FareEstimate {
  fareAmount: number;
  distanceKm: number;
  estimatedMinutes: number;
}

export interface RideHistoryItem {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  fareAmount: number;
  status: string;
  createdAt: string;
  completedAt?: string;
  rating?: number;
}

export interface RideHistoryResponse {
  items: RideHistoryItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface RiderStatsResponse {
  totalRides: number;
  todayEarnings: number;
  rating: number;
}

// ─── Rider Availability ───────────────────────────────────────────────────────

/**
 * Toggle rider online/offline status.
 * PUT /api/rider/status
 * NOTE: Also call SignalR GoOnline()/GoOffline() alongside this for real-time group membership.
 */
const setStatus = async (isOnline: boolean): Promise<void> => {
  await axiosPrivate.put('/api/rider/status', { isOnline });
};

// ─── Nearby Requests ──────────────────────────────────────────────────────────

/**
 * Fetch nearby ride requests.
 * GET /api/requests/nearby?latitude=X&longitude=Y&radiusMeters=Z
 * Used as a fallback; primary delivery is via SignalR broadcast to OnlineRiders group.
 */
const getNearbyRequests = async (
  latitude: number,
  longitude: number,
  radiusMeters?: number
): Promise<RideRequest[]> => {
  const response = await axiosPrivate.get<RideRequest[]>('/api/requests/nearby', {
    params: { latitude, longitude, ...(radiusMeters ? { radiusMeters } : {}) },
  });
  return response.data;
};

// ─── Ride Lifecycle (Rider-side) ──────────────────────────────────────────────

/**
 * Accept a pending ride request.
 * POST /api/accept
 */
const acceptRide = async (rideId: string): Promise<ActiveRide> => {
  const response = await axiosPrivate.post<ActiveRide>('/api/accept', { rideId });
  return response.data;
};

/**
 * Mark that the rider has arrived at the pickup location.
 * POST /api/arrive
 */
const markArrived = async (rideId: string): Promise<void> => {
  await axiosPrivate.post('/api/arrive', { rideId });
};

/**
 * Verify the student's OTP to officially start the ride.
 * POST /api/verify
 */
const verifyOtp = async (rideId: string, otp: string): Promise<void> => {
  await axiosPrivate.post('/api/verify', { rideId, otp });
};

/**
 * Mark the ride as completed from the rider's side.
 * Puts ride in pending-confirmation state (student must confirm).
 * POST /api/rider-complete
 */
const completeRide = async (rideId: string): Promise<void> => {
  await axiosPrivate.post('/api/rider-complete', { rideId });
};

/**
 * Send GPS heartbeat while a ride is active.
 * POST /api/location/heartbeat
 */
const sendHeartbeat = async (rideId: string, coords: LocationCoords): Promise<void> => {
  await axiosPrivate.post('/api/location/heartbeat', {
    rideId,
    latitude: coords.latitude,
    longitude: coords.longitude,
    timestamp: new Date().toISOString(),
  });
};

// ─── Active Ride ──────────────────────────────────────────────────────────────

/**
 * Retrieve the currently active/in-progress ride.
 * GET /api/rides/active
 * Returns null if no active ride (204 No Content).
 */
const getActiveRide = async (): Promise<ActiveRide | null> => {
  try {
    const response = await axiosPrivate.get<ActiveRide>('/api/rides/active');
    return response.status === 204 ? null : response.data;
  } catch {
    return null;
  }
};

// ─── Student Live Location ────────────────────────────────────────────────────

/**
 * Retrieve the latest live location of the matched rider.
 * GET /api/location/{rideId}
 * Students only — used on the student tracking screen.
 */
const getRiderLocation = async (rideId: string): Promise<LocationCoords | null> => {
  try {
    const response = await axiosPrivate.get<LocationCoords>(`/api/location/${rideId}`);
    return response.data;
  } catch {
    return null;
  }
};

// ─── Device Token (Push Notifications) ───────────────────────────────────────

/**
 * Register a device FCM token for push notifications.
 * POST /api/rides/device-token
 * Call after login.
 */
const registerDeviceToken = async (token: string): Promise<void> => {
  await axiosPrivate.post('/api/rides/device-token', { token });
};

/**
 * Remove a device token (call on logout).
 * DELETE /api/rides/device-token
 */
const removeDeviceToken = async (token: string): Promise<void> => {
  await axiosPrivate.delete('/api/rides/device-token', { data: { token } });
};

// ─── Fare Estimate ────────────────────────────────────────────────────────────

/**
 * Calculate a fare estimate without creating a ride request.
 * GET /api/rides/estimate?pickupLat=X&pickupLng=Y&dropoffLat=A&dropoffLng=B
 */
const getFareEstimate = async (
  pickupLat: number,
  pickupLng: number,
  dropoffLat: number,
  dropoffLng: number
): Promise<FareEstimate> => {
  const response = await axiosPrivate.get<FareEstimate>('/api/rides/estimate', {
    params: { pickupLat, pickupLng, dropoffLat, dropoffLng },
  });
  return response.data;
};

// ─── Ride History ─────────────────────────────────────────────────────────────

/**
 * Fetch paginated ride history for the logged-in user (Student or Rider).
 * GET /api/rides/history?page=1&pageSize=20
 */
const getRideHistory = async (page = 1, pageSize = 20): Promise<RideHistoryResponse> => {
  const response = await axiosPrivate.get<RideHistoryResponse>('/api/rides/history', {
    params: { page, pageSize },
  });
  return response.data;
};

/**
 * Submit a 1–5 star rating for a completed ride.
 * POST /api/rides/history/{rideId}/rate
 * Students only.
 */
const rateRide = async (rideId: string, rating: number): Promise<void> => {
  await axiosPrivate.post(`/api/rides/history/${rideId}/rate`, { rating });
};

// ─── Rider Stats (convenience wrapper) ───────────────────────────────────────

/**
 * GET /api/rider/stats — aggregate stats for the dashboard.
 */
const getStats = async (): Promise<RiderStatsResponse> => {
  const response = await axiosPrivate.get<RiderStatsResponse>('/api/rider/stats');
  return response.data;
};

// ─── Exports ──────────────────────────────────────────────────────────────────

const riderService = {
  // Rider availability
  setStatus,
  // Nearby requests (HTTP fallback — primary via SignalR)
  getNearbyRequests,
  // Ride lifecycle
  acceptRide,
  markArrived,
  verifyOtp,
  completeRide,
  sendHeartbeat,
  // Active ride
  getActiveRide,
  // Student tracking
  getRiderLocation,
  // Push notifications
  registerDeviceToken,
  removeDeviceToken,
  // Fare estimate
  getFareEstimate,
  // History & ratings
  getRideHistory,
  rateRide,
  // Stats
  getStats,
};

export default riderService;
