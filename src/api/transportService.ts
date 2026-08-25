import { axiosPrivate } from './axios';
import type {
  BusRoute,
  BusRouteUpdateDto,
  TrainRoute,
  TrainRouteUpdateDto,
  TukTukDriver,
  TukTukDriverUpdateDto,
} from '../types/transport';

const unwrap = <T>(res: any): T => {
  if (res && typeof res === 'object' && 'data' in res && res.data !== undefined) {
    // If backend returns ApiResponse<T> wrapper
    if (res.data && typeof res.data === 'object' && 'data' in res.data) {
      return res.data.data;
    }
    return res.data;
  }
  return res;
};

export const transportService = {
  // ─── Bus Routes (GET / POST / PUT / DELETE /api/BusRoutes) ─────────────────
  getBusRoutes: async (): Promise<BusRoute[]> => {
    const response = await axiosPrivate.get('/busroutes');
    return unwrap<BusRoute[]>(response.data);
  },

  getBusRouteById: async (id: number): Promise<BusRoute> => {
    const response = await axiosPrivate.get(`/busroutes/${id}`);
    return unwrap<BusRoute>(response.data);
  },

  createBusRoute: async (dto: BusRouteUpdateDto): Promise<BusRoute> => {
    const response = await axiosPrivate.post('/busroutes', dto);
    return unwrap<BusRoute>(response.data);
  },

  updateBusRoute: async (id: number, dto: BusRouteUpdateDto): Promise<BusRoute> => {
    const response = await axiosPrivate.put(`/busroutes/${id}`, dto);
    return unwrap<BusRoute>(response.data);
  },

  deleteBusRoute: async (id: number): Promise<void> => {
    await axiosPrivate.delete(`/busroutes/${id}`);
  },

  // ─── Train Routes (GET / POST / PUT / DELETE /api/TrainRoutes) ─────────────
  getTrainRoutes: async (): Promise<TrainRoute[]> => {
    const response = await axiosPrivate.get('/trainroutes');
    return unwrap<TrainRoute[]>(response.data);
  },

  getTrainRouteById: async (id: number): Promise<TrainRoute> => {
    const response = await axiosPrivate.get(`/trainroutes/${id}`);
    return unwrap<TrainRoute>(response.data);
  },

  createTrainRoute: async (dto: TrainRouteUpdateDto): Promise<TrainRoute> => {
    const response = await axiosPrivate.post('/trainroutes', dto);
    return unwrap<TrainRoute>(response.data);
  },

  updateTrainRoute: async (id: number, dto: TrainRouteUpdateDto): Promise<TrainRoute> => {
    const response = await axiosPrivate.put(`/trainroutes/${id}`, dto);
    return unwrap<TrainRoute>(response.data);
  },

  deleteTrainRoute: async (id: number): Promise<void> => {
    await axiosPrivate.delete(`/trainroutes/${id}`);
  },

  // ─── TukTuk Drivers (GET / POST / PUT / DELETE /api/TukTukDrivers) ─────────
  getTukTukDrivers: async (): Promise<TukTukDriver[]> => {
    const response = await axiosPrivate.get('/tuktukdrivers');
    return unwrap<TukTukDriver[]>(response.data);
  },

  getTukTukDriverById: async (id: number): Promise<TukTukDriver> => {
    const response = await axiosPrivate.get(`/tuktukdrivers/${id}`);
    return unwrap<TukTukDriver>(response.data);
  },

  createTukTukDriver: async (dto: TukTukDriverUpdateDto): Promise<TukTukDriver> => {
    const response = await axiosPrivate.post('/tuktukdrivers', dto);
    return unwrap<TukTukDriver>(response.data);
  },

  updateTukTukDriver: async (id: number, dto: TukTukDriverUpdateDto): Promise<TukTukDriver> => {
    const response = await axiosPrivate.put(`/tuktukdrivers/${id}`, dto);
    return unwrap<TukTukDriver>(response.data);
  },

  deleteTukTukDriver: async (id: number): Promise<void> => {
    await axiosPrivate.delete(`/tuktukdrivers/${id}`);
  },
};
export default transportService;
