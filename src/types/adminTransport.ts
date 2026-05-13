export type RiderStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type RiderAvailability = 'available' | 'offline' | 'busy';
export type VehicleType = 'tuk' | 'bike';

export interface AdminRider {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  licenseNumber: string;
  status: RiderStatus;
  availability: RiderAvailability;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
}

export type BusCategory = 'SLTB' | 'Semi' | 'AC' | 'Private';
export type TrainCategory = 'Express' | 'Intercity' | 'Mail' | 'Office';

export interface BusRoute {
  id: string;
  from: string;
  to: string;
  category: BusCategory;
  departures: string[];
  duration: string;
  priceLkr: number;
  status: 'active' | 'inactive';
}

export interface TrainRoute {
  id: string;
  from: string;
  to: string;
  category: TrainCategory;
  schedule: Array<{
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
  }>;
  trainType: string;
  statusText: string;
  priceLkr: number;
  status: 'active' | 'inactive';
}

export type BookingStatus = 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type BookingServiceType = 'ride' | 'bus' | 'train';

export interface TransportBooking {
  id: string;
  userId: string;
  serviceType: BookingServiceType;
  riderId?: string | null;
  routeId?: string | null;
  pickup: string;
  dropoff: string;
  priceLkr: number;
  status: BookingStatus;
  createdAt: string;
}

export interface TransportAnalyticsSummary {
  riders: {
    pending: number;
    approved: number;
    suspended: number;
  };
  routes: {
    bus: number;
    train: number;
  };
  bookingsToday: number;
  revenueTodayLkr: number;
}
