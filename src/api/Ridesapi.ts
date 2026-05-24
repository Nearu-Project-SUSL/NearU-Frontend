import type { ApiResponse, FareEstimate, RideSummary, ServiceType } from '../app/components/ride/Ridestypes';

const BASE = '/api';

async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const RidesApi = {
  getEstimate: (pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number) =>
    http<ApiResponse<FareEstimate>>(
      `/rides/estimate?pickupLat=${pickupLat}&pickupLng=${pickupLng}&dropoffLat=${dropoffLat}&dropoffLng=${dropoffLng}`,
    ),

  createRequest: (body: {
    serviceType: ServiceType;
    details: object;
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffLatitude: number;
    dropoffLongitude: number;
    confirmEstimate: boolean;
  }) =>
    http<ApiResponse<RideSummary>>('/requests', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  refreshOtp: (rideId: string) =>
    http<ApiResponse<RideSummary>>('/otp/refresh', {
      method: 'POST',
      body: JSON.stringify({ rideId }),
    }),

  studentConfirm: (rideId: string) =>
    http<ApiResponse<object>>('/student-confirm', {
      method: 'POST',
      body: JSON.stringify({ rideId }),
    }),

  cancelRide: (rideId: string) =>
    http<ApiResponse<RideSummary>>('/cancel', {
      method: 'POST',
      body: JSON.stringify({ rideId }),
    }),

  rateRide: (rideId: string, rating: number) =>
    http<ApiResponse<object>>(`/rides/history/${rideId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    }),
};