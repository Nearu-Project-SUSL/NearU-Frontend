import { axiosPrivate } from './axios'; 
import type { ApiResponse, FareEstimate, RideSummary, ServiceType } from '../app/components/ride/Ridestypes';

export const RidesApi = {
  getEstimate: (pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number) =>
    axiosPrivate
      .get<ApiResponse<FareEstimate>>(
        `/rides/estimate?pickupLat=${pickupLat}&pickupLng=${pickupLng}&dropoffLat=${dropoffLat}&dropoffLng=${dropoffLng}`,
      )
      .then(r => r.data),

  createRequest: (body: {
    serviceType: number;
    details: object;
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffLatitude: number;
    dropoffLongitude: number;
    confirmEstimate: boolean;
  }) =>
    axiosPrivate
      .post<ApiResponse<RideSummary>>('/requests', body)
      .then(r => r.data),

  refreshOtp: (rideId: string) =>
    axiosPrivate
      .post<ApiResponse<RideSummary>>('/otp/refresh', { rideId })
      .then(r => r.data),

  studentConfirm: (rideId: string) =>
    axiosPrivate
      .post<ApiResponse<object>>('/student-confirm', { rideId })
      .then(r => r.data),

  cancelRide: (rideId: string) =>
    axiosPrivate
      .post<ApiResponse<RideSummary>>('/cancel', { rideId })
      .then(r => r.data),

  rateRide: (rideId: string, rating: number) =>
    axiosPrivate
      .post<ApiResponse<object>>(`/rides/history/${rideId}/rate`, { rating })
      .then(r => r.data),
};