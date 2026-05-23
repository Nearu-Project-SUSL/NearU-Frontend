import { ExploreOffTwoTone } from "@mui/icons-material";

export type ServiceType = 'PersonalRide' | 'FoodDelivery' | 'GroceryPickup'

export type RideStatus =
  | 'Pending'
  | 'Accepted'
  | 'Arrived'
  | 'InProgress'
  | 'CompletedByRider'
  | 'Completed'
  | 'Cancelled'
  | 'Expired'
  | 'OTPLocked'; 


export interface FareEstimate {
  distanceKm : number;
  estimatedFare : number;
  baseFare: number;
  ratePerKm: number;
}

export interface RideSummary{
  rideId: string;
  status: RideStatus;
  serviceType: ServiceType;
  studentId: string;
  riderId?: string;
  estimatedFare: number;
  distanceKm: number;
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffLatitude: number;
  dropoffLongitude: number;
  createdAt: string;
  otpExpiresAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type RideScreen =
  | 'request'
  | 'pending'
  | 'accepted'
  | 'otp-verify'
  | 'in-progress'
  | 'confirm-complete'
  | 'completed';