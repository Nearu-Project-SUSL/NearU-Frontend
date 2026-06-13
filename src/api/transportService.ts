import { axiosPrivate } from './axios';
import type { BusRoute, TrainRoute } from '../types/adminTransport';

export const transportService = {
  getBusRoutes: async (): Promise<BusRoute[]> => {
    const response = await axiosPrivate.get('/transport/bus-routes');
    // Unwrap the response if it's wrapped in a 'data' object
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  getTrainRoutes: async (): Promise<TrainRoute[]> => {
    const response = await axiosPrivate.get('/transport/train-routes');
    // Unwrap the response if it's wrapped in a 'data' object
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  }
};
