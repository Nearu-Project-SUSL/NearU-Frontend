import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  AdminRider,
  BusRoute,
  TrainRoute,
  TransportBooking,
  TransportAnalyticsSummary
} from '../types/transport';

type ApiResponse<T> = { data?: T } | T;

const unwrap = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  const payload = response.data as ApiResponse<T>;
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};

export const adminTransportService = (client: AxiosInstance) => ({
  getBusRoutes: async () => unwrap<BusRoute[]>(await client.get('/admin/transport/bus-routes')),
  getBusRouteById: async (id: string) => unwrap<BusRoute>(await client.get(`/admin/transport/bus-routes/${id}`)),
  createBusRoute: async (payload: Partial<BusRoute>) => unwrap<BusRoute>(await client.post('/admin/transport/bus-routes', payload)),
  updateBusRoute: async (id: string, payload: Partial<BusRoute>) => unwrap<BusRoute>(await client.patch(`/admin/transport/bus-routes/${id}`, payload)),
  activateBusRoute: async (id: string) => unwrap<void>(await client.post(`/admin/transport/bus-routes/${id}/activate`)),
  deactivateBusRoute: async (id: string) => unwrap<void>(await client.post(`/admin/transport/bus-routes/${id}/deactivate`)),
  deleteBusRoute: async (id: string) => unwrap<void>(await client.delete(`/admin/transport/bus-routes/${id}`)),

  getTrainRoutes: async () => unwrap<TrainRoute[]>(await client.get('/admin/transport/train-routes')),
  getTrainRouteById: async (id: string) => unwrap<TrainRoute>(await client.get(`/admin/transport/train-routes/${id}`)),
  createTrainRoute: async (payload: Partial<TrainRoute>) => unwrap<TrainRoute>(await client.post('/admin/transport/train-routes', payload)),
  updateTrainRoute: async (id: string, payload: Partial<TrainRoute>) => unwrap<TrainRoute>(await client.patch(`/admin/transport/train-routes/${id}`, payload)),
  activateTrainRoute: async (id: string) => unwrap<void>(await client.post(`/admin/transport/train-routes/${id}/activate`)),
  deactivateTrainRoute: async (id: string) => unwrap<void>(await client.post(`/admin/transport/train-routes/${id}/deactivate`)),
  deleteTrainRoute: async (id: string) => unwrap<void>(await client.delete(`/admin/transport/train-routes/${id}`)),

  getRiders: async () => unwrap<AdminRider[]>(await client.get('/admin/transport/riders')),
  getRiderById: async (id: string) => unwrap<AdminRider>(await client.get(`/admin/transport/riders/${id}`)),
  approveRider: async (id: string) => unwrap<void>(await client.post(`/admin/transport/riders/${id}/approve`)),
  rejectRider: async (id: string) => unwrap<void>(await client.post(`/admin/transport/riders/${id}/reject`)),
  suspendRider: async (id: string) => unwrap<void>(await client.post(`/admin/transport/riders/${id}/suspend`)),
  reactivateRider: async (id: string) => unwrap<void>(await client.post(`/admin/transport/riders/${id}/reactivate`)),
  updateRider: async (id: string, payload: Partial<AdminRider>) => unwrap<AdminRider>(await client.patch(`/admin/transport/riders/${id}`, payload)),
  updateRiderAvailability: async (id: string, payload: Pick<AdminRider, 'availability'>) => unwrap<AdminRider>(await client.patch(`/admin/transport/riders/${id}/availability`, payload)),
  deleteRider: async (id: string) => unwrap<void>(await client.delete(`/admin/transport/riders/${id}`)),

  getBookings: async () => unwrap<TransportBooking[]>(await client.get('/admin/transport/bookings')),
  getBookingById: async (id: string) => unwrap<TransportBooking>(await client.get(`/admin/transport/bookings/${id}`)),
  cancelBooking: async (id: string) => unwrap<void>(await client.post(`/admin/transport/bookings/${id}/cancel`)),

  getAnalyticsOverview: async () => unwrap<TransportAnalyticsSummary>(await client.get('/admin/transport/analytics/overview')),
  getAnalyticsRevenue: async () => unwrap(await client.get('/admin/transport/analytics/revenue')),
  getAnalyticsPopularRoutes: async () => unwrap(await client.get('/admin/transport/analytics/popular-routes')),
  getAnalyticsBookingVolume: async () => unwrap(await client.get('/admin/transport/analytics/booking-volume'))
});
