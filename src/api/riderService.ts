/**
 * riderService.ts
 * All HTTP API calls for the Rider & Ride-related flows.
 * Endpoints verified against the backend RideController.
 *
 * Real-time coordination (nearby request broadcasts, ride status updates,
 * and live location streaming) is handled separately via SignalR:
 * → see src/app/services/rideHubService.ts
 */
import { axiosPrivate } from './axios';

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
  fareEstimate?: number;   // may be absent from SignalR broadcast
  distanceKm?: number;     // may be absent from SignalR broadcast
  serviceType?: string;
  createdAt: string;
}

export interface ActiveRide {
  id: string;              // mapped from RideSummaryDto.rideId
  studentName: string;
  pickupLocation: string;
  pickupLat: number;       // mapped from pickupLatitude
  pickupLng: number;       // mapped from pickupLongitude
  dropoffLocation: string;
  dropoffLat: number;      // mapped from dropoffLatitude
  dropoffLng: number;      // mapped from dropoffLongitude
  fareEstimate: number;    // mapped from estimatedFare
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
 * PUT /rider/status  (baseURL already includes /api)
 * NOTE: Also call SignalR GoOnline()/GoOffline() alongside this for real-time group membership.
 */
const setStatus = async (isOnline: boolean): Promise<void> => {
  await axiosPrivate.put('/rider/status', { isOnline });
};

/**
 * Fetch current rider status profile (availability, tier, approvalStatus).
 * GET /rider/status  (baseURL already includes /api)
 */
const getRiderStatus = async (): Promise<{ riderId: string; isOnline: boolean; approvalStatus: string; riderTier: string }> => {
  const response = await axiosPrivate.get<any>('/rider/status');
  return response.data?.data;
};

// ─── Nearby Requests ──────────────────────────────────────────────────────────

/**
 * Fetch nearby ride requests.
 * GET /requests/nearby?latitude=X&longitude=Y&radiusMeters=Z  (baseURL already includes /api)
 * Used as a fallback; primary delivery is via SignalR broadcast to OnlineRiders group.
 */
const getNearbyRequests = async (
  latitude: number,
  longitude: number,
  radiusMeters?: number
): Promise<RideRequest[]> => {
  const response = await axiosPrivate.get<RideRequest[]>('/requests/nearby', {
    params: { latitude, longitude, ...(radiusMeters ? { radiusMeters } : {}) },
  });
  return response.data;
};

/**
 * Map a raw RideSummaryDto from the backend into the frontend ActiveRide shape.
 * Backend sends camelCase JSON: { rideId, pickupLatitude, estimatedFare, ... }
 * Frontend ActiveRide uses: { id, pickupLat, fareEstimate, ... }
 */
function mapSummaryToActiveRide(dto: any): ActiveRide {
  return {
    id             : dto.rideId       ?? dto.id ?? '',
    studentName    : dto.studentId    ?? 'Student',   // backend doesn't send studentName in summary
    pickupLocation : `${dto.pickupLatitude ?? 0}, ${dto.pickupLongitude ?? 0}`,
    pickupLat      : dto.pickupLatitude  ?? 0,
    pickupLng      : dto.pickupLongitude ?? 0,
    dropoffLocation: `${dto.dropoffLatitude ?? 0}, ${dto.dropoffLongitude ?? 0}`,
    dropoffLat     : dto.dropoffLatitude  ?? 0,
    dropoffLng     : dto.dropoffLongitude ?? 0,
    fareEstimate   : dto.estimatedFare    ?? 0,
    status         : (dto.status as RideStatus) ?? 'EN_ROUTE_PICKUP',
  };
}

// ─── Ride Lifecycle (Rider-side) ──────────────────────────────────────────────────────

/**
 * Helper to map backend DTO (which may be wrapped in an ApiResponse) to ActiveRide.
 */
function mapSummaryToActiveRide(dto: any): ActiveRide {
  return {
    id             : dto.rideId       ?? dto.id ?? '',
    studentName    : dto.studentId    ?? 'Student',
    pickupLocation : `${dto.pickupLatitude ?? 0}, ${dto.pickupLongitude ?? 0}`,
    pickupLat      : dto.pickupLatitude  ?? 0,
    pickupLng      : dto.pickupLongitude ?? 0,
    dropoffLocation: `${dto.dropoffLatitude ?? 0}, ${dto.dropoffLongitude ?? 0}`,
    dropoffLat     : dto.dropoffLatitude  ?? 0,
    dropoffLng     : dto.dropoffLongitude ?? 0,
    fareEstimate   : dto.estimatedFare    ?? 0,
    status         : (dto.status as RideStatus) ?? 'EN_ROUTE_PICKUP',
  };
}

/**
 * Accept a pending ride request.
 * POST /accept  (baseURL already includes /api)
 * Returns an ActiveRide mapped from ApiResponse<RideSummaryDto>.
 */
const acceptRide = async (rideId: string): Promise<ActiveRide> => {
  const response = await axiosPrivate.post<any>('/accept', { rideId });
  const dto = response.data?.data ?? response.data;
  return mapSummaryToActiveRide(dto);
};

/**
 * Mark that the rider has arrived at the pickup location.
 * POST /arrive  (baseURL already includes /api)
 */
const markArrived = async (rideId: string): Promise<void> => {
  await axiosPrivate.post('/arrive', { rideId });
};

/**
 * Verify the student's OTP to officially start the ride.
 * POST /verify  (baseURL already includes /api)
 */
const verifyOtp = async (rideId: string, otp: string): Promise<void> => {
  await axiosPrivate.post('/verify', { rideId, otp });
};

/**
 * Mark the ride as completed from the rider's side.
 * Puts ride in pending-confirmation state (student must confirm).
 * POST /rider-complete  (baseURL already includes /api)
 */
const completeRide = async (rideId: string): Promise<void> => {
  await axiosPrivate.post('/rider-complete', { rideId });
};

/**
 * Send GPS heartbeat while a ride is active.
 * POST /location/heartbeat  (baseURL already includes /api)
 */
const sendHeartbeat = async (rideId: string, coords: LocationCoords): Promise<void> => {
  await axiosPrivate.post('/location/heartbeat', {
    rideId,
    latitude: coords.latitude,
    longitude: coords.longitude,
    timestamp: new Date().toISOString(),
  });
};

// ─── Active Ride ──────────────────────────────────────────────────────────────

/**
 * Retrieve the currently active/in-progress ride.
 * GET /rides/active  (baseURL already includes /api)
 * Returns null if no active ride (204 No Content).
 */
const getActiveRide = async (): Promise<ActiveRide | null> => {
  try {
    const response = await axiosPrivate.get<any>('/rides/active');
    if (response.status === 204 || !response.data) return null;
    const dto = response.data?.data ?? response.data;
    if (!dto) return null;
    return mapSummaryToActiveRide(dto);
  } catch {
    return null;
  }
};

// ─── Student Live Location ────────────────────────────────────────────────────

/**
 * Retrieve the latest live location of the matched rider.
 * GET /location/{rideId}  (baseURL already includes /api)
 * Students only — used on the student tracking screen.
 */
const getRiderLocation = async (rideId: string): Promise<LocationCoords | null> => {
  try {
    const response = await axiosPrivate.get<LocationCoords>(`/location/${rideId}`);
    return response.data;
  } catch {
    return null;
  }
};

// ─── Device Token (Push Notifications) ───────────────────────────────────────

/**
 * Register a device FCM token for push notifications.
 * POST /rides/device-token  (baseURL already includes /api)
 * Call after login.
 */
const registerDeviceToken = async (token: string): Promise<void> => {
  await axiosPrivate.post('/rides/device-token', { token });
};

/**
 * Remove a device token (call on logout).
 * DELETE /rides/device-token  (baseURL already includes /api)
 */
const removeDeviceToken = async (token: string): Promise<void> => {
  await axiosPrivate.delete('/rides/device-token', { data: { token } });
};

// ─── Fare Estimate ────────────────────────────────────────────────────────────

/**
 * Calculate a fare estimate without creating a ride request.
 * GET /rides/estimate?pickupLat=X&pickupLng=Y&dropoffLat=A&dropoffLng=B  (baseURL already includes /api)
 */
const getFareEstimate = async (
  pickupLat: number,
  pickupLng: number,
  dropoffLat: number,
  dropoffLng: number
): Promise<FareEstimate> => {
  const response = await axiosPrivate.get<FareEstimate>('/rides/estimate', {
    params: { pickupLat, pickupLng, dropoffLat, dropoffLng },
  });
  return response.data;
};

// ─── Ride History ─────────────────────────────────────────────────────────────

/**
 * Fetch paginated ride history for the logged-in user (Student or Rider).
 * GET /rides/history?page=1&pageSize=20  (baseURL already includes /api)
 */
const getRideHistory = async (page = 1, pageSize = 20): Promise<RideHistoryResponse> => {
  const response = await axiosPrivate.get<RideHistoryResponse>('/rides/history', {
    params: { page, pageSize },
  });
  return response.data;
};

/**
 * Submit a 1–5 star rating for a completed ride.
 * POST /rides/history/{rideId}/rate  (baseURL already includes /api)
 * Students only.
 */
const rateRide = async (rideId: string, rating: number): Promise<void> => {
  await axiosPrivate.post(`/rides/history/${rideId}/rate`, { rating });
};

// ─── Rider Stats (convenience wrapper) ───────────────────────────────────────

/**
 * GET /rider/stats — aggregate stats for the dashboard.  (baseURL already includes /api)
 * Returns null if the endpoint is unavailable (404 from undeployed backend).
 */
const getStats = async (): Promise<RiderStatsResponse | null> => {
  try {
    const response = await axiosPrivate.get<{ success: boolean; data: RiderStatsResponse }>('/rider/stats');
    // Backend wraps response in ApiResponse<T>: { success, message, data: { totalRides, ... } }
    return response.data?.data ?? null;
  } catch {
    // 404 = endpoint not yet deployed on this backend version; return null gracefully
    return null;
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────

const riderService = {
  // Rider availability
  setStatus,
  getRiderStatus,
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
