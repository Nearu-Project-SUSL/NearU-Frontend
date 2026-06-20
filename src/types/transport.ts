export interface TukTukDriver {
  id: number;
  name: string;
  phoneNumber: string;
  plateNumber: string;
  operatingArea?: string;
  notes?: string;
}

export interface BusRoute {
  id: number;
  routeName: string;
  startPoint: string;
  endPoint: string;
  departureTime: string;
  arrivalTime?: string;
  busNumber?: string;
  notes?: string;
}

export interface TrainRoute {
  id: number;
  routeName: string;
  startStation: string;
  endStation: string;
  departureTime: string;
  arrivalTime?: string;
  trainName?: string;
  notes?: string;
}