/**
 * adminTransportService.ts
 *
 * Maps to real backend endpoints:
 *   Bus routes  → GET/POST/PUT/DELETE /api/BusRoutes   (BusRoutesController)
 *   Train routes → GET/POST/PUT/DELETE /api/TrainRoutes (TrainRoutesController)
 *   Riders (admin) → GET /api/admin/riders, PUT /api/admin/riders/{id}/{action} (AdminController)
 *
 * NOTE: activate/deactivate, bookings, and analytics are NOT yet implemented in the
 * backend. Those methods gracefully return empty data or no-ops so the UI remains stable.
 */
import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  AdminRider,
  BusRoute,
  TrainRoute,
  TransportBooking,
  TransportAnalyticsSummary
} from '../types/transport';

type ApiWrapper<T> = { success?: boolean; message?: string; data: T } | T;

const unwrap = <T>(response: AxiosResponse<ApiWrapper<T>>): T => {
  const payload = response.data as ApiWrapper<T>;
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};

export const adminTransportService = (client: AxiosInstance) => ({
  // ─── Bus Routes ────────────────────────────────────────────────────
  // Backend: [Route("api/[controller]")] → /api/BusRoutes
  getBusRoutes: async () => unwrap<BusRoute[]>(await client.get('/busroutes')),
  getBusRouteById: async (id: string) => unwrap<BusRoute>(await client.get(`/busroutes/${id}`)),
  createBusRoute: async (payload: Partial<BusRoute>) =>
    unwrap<BusRoute>(await client.post('/busroutes', payload)),
  updateBusRoute: async (id: string, payload: Partial<BusRoute>) =>
    unwrap<BusRoute>(await client.put(`/busroutes/${id}`, payload)),
  deleteBusRoute: async (id: string) => unwrap<void>(await client.delete(`/busroutes/${id}`)),

  // activate/deactivate not implemented in backend — no-op so UI actions don't throw
  activateBusRoute: async (_id: string): Promise<void> => {
    console.warn('[adminTransportService] activateBusRoute: endpoint not yet implemented on backend.');
  },
  deactivateBusRoute: async (_id: string): Promise<void> => {
    console.warn('[adminTransportService] deactivateBusRoute: endpoint not yet implemented on backend.');
  },

  // ─── Train Routes ──────────────────────────────────────────────────
  // Backend: [Route("api/[controller]")] → /api/TrainRoutes
  getTrainRoutes: async () => unwrap<TrainRoute[]>(await client.get('/trainroutes')),
  getTrainRouteById: async (id: string) => unwrap<TrainRoute>(await client.get(`/trainroutes/${id}`)),
  createTrainRoute: async (payload: Partial<TrainRoute>) =>
    unwrap<TrainRoute>(await client.post('/trainroutes', payload)),
  updateTrainRoute: async (id: string, payload: Partial<TrainRoute>) =>
    unwrap<TrainRoute>(await client.put(`/trainroutes/${id}`, payload)),
  deleteTrainRoute: async (id: string) => unwrap<void>(await client.delete(`/trainroutes/${id}`)),

  activateTrainRoute: async (_id: string): Promise<void> => {
    console.warn('[adminTransportService] activateTrainRoute: endpoint not yet implemented on backend.');
  },
  deactivateTrainRoute: async (_id: string): Promise<void> => {
    console.warn('[adminTransportService] deactivateTrainRoute: endpoint not yet implemented on backend.');
  },

  // ─── TukTuk Drivers ────────────────────────────────────────────────
  // Backend: [Route("api/[controller]")] → /api/TukTukDrivers
  getTukTukDrivers: async () => unwrap<any[]>(await client.get('/tuktukdrivers')),
  getTukTukDriverById: async (id: string | number) => unwrap<any>(await client.get(`/tuktukdrivers/${id}`)),
  createTukTukDriver: async (payload: any) =>
    unwrap<any>(await client.post('/tuktukdrivers', payload)),
  updateTukTukDriver: async (id: string | number, payload: any) =>
    unwrap<any>(await client.put(`/tuktukdrivers/${id}`, payload)),
  deleteTukTukDriver: async (id: string | number) => unwrap<void>(await client.delete(`/tuktukdrivers/${id}`)),

  // ─── Riders (Admin) ────────────────────────────────────────────────
  // Backend: GET /api/admin/riders, PUT /api/admin/riders/{id}/approve|reject|suspend
  getRiders: async (): Promise<AdminRider[]> => {
    const response = await client.get<any>('/admin/riders');
    // AdminController returns ApiResponse<{ total, page, pageSize, riders: [] }>
    const payload = response.data?.data ?? response.data;
    return (payload?.riders ?? payload) as AdminRider[];
  },
  getRiderById: async (id: string): Promise<AdminRider> => {
    // No single-rider endpoint in backend — filter from the list
    const response = await client.get<any>('/admin/riders');
    const payload = response.data?.data ?? response.data;
    const riders: AdminRider[] = payload?.riders ?? payload ?? [];
    const found = riders.find((r: any) => r.riderId === id || r.id === id);
    if (!found) throw new Error(`Rider ${id} not found.`);
    return found;
  },

  approveRider: async (id: string) =>
    unwrap<void>(await client.put(`/admin/riders/${id}/approve`)),
  rejectRider: async (id: string) =>
    unwrap<void>(await client.put(`/admin/riders/${id}/reject`)),
  suspendRider: async (id: string) =>
    unwrap<void>(await client.put(`/admin/riders/${id}/suspend`)),

  // reactivate not in backend — use approve to reinstate
  reactivateRider: async (id: string) =>
    unwrap<void>(await client.put(`/admin/riders/${id}/approve`)),

  // update/availability not implemented in AdminController — no-op
  updateRider: async (_id: string, _payload: Partial<AdminRider>): Promise<AdminRider> => {
    console.warn('[adminTransportService] updateRider: endpoint not yet implemented on backend.');
    return _payload as AdminRider;
  },
  updateRiderAvailability: async (_id: string, _payload: Pick<AdminRider, 'availability'>): Promise<AdminRider> => {
    console.warn('[adminTransportService] updateRiderAvailability: endpoint not yet implemented on backend.');
    return _payload as AdminRider;
  },
  deleteRider: async (_id: string): Promise<void> => {
    console.warn('[adminTransportService] deleteRider: endpoint not yet implemented on backend.');
  },

  // ─── Bookings (NOT IMPLEMENTED IN BACKEND) ─────────────────────────
  getBookings: async (): Promise<TransportBooking[]> => {
    console.warn('[adminTransportService] getBookings: endpoint not yet implemented on backend. Returning [].');
    return [];
  },
  getBookingById: async (_id: string): Promise<TransportBooking> => {
    throw new Error('getBookingById: endpoint not yet implemented on backend.');
  },
  cancelBooking: async (_id: string): Promise<void> => {
    console.warn('[adminTransportService] cancelBooking: endpoint not yet implemented on backend.');
  },

  // ─── Analytics (NOT IMPLEMENTED IN BACKEND) ────────────────────────
  // Compute a minimal summary from the live riders/routes data
  getAnalyticsOverview: async (): Promise<TransportAnalyticsSummary> => {
    console.warn('[adminTransportService] getAnalyticsOverview: endpoint not yet implemented on backend. Computing from riders/routes.');
    try {
      const [ridersResp, busResp, trainResp] = await Promise.all([
        client.get<any>('/admin/riders'),
        client.get<any>('/busroutes'),
        client.get<any>('/trainroutes'),
      ]);

      const ridersPayload = ridersResp.data?.data ?? ridersResp.data;
      const riders: any[] = ridersPayload?.riders ?? ridersPayload ?? [];
      const busRoutes: any[] = busResp.data ?? [];
      const trainRoutes: any[] = trainResp.data ?? [];

      return {
        riders: {
          pending:   riders.filter(r => r.approvalStatus === 'Pending').length,
          approved:  riders.filter(r => r.approvalStatus === 'Approved').length,
          suspended: riders.filter(r => r.approvalStatus === 'Suspended').length,
        },
        routes: {
          bus:   busRoutes.length,
          train: trainRoutes.length,
        },
        bookingsToday:   0,  // Not tracked by backend yet
        revenueTodayLkr: 0,  // Not tracked by backend yet
      };
    } catch {
      return {
        riders: { pending: 0, approved: 0, suspended: 0 },
        routes: { bus: 0, train: 0 },
        bookingsToday:   0,
        revenueTodayLkr: 0,
      };
    }
  },
  getAnalyticsRevenue: async () => {
    console.warn('[adminTransportService] getAnalyticsRevenue: endpoint not yet implemented on backend.');
    return null;
  },
  getAnalyticsPopularRoutes: async () => {
    console.warn('[adminTransportService] getAnalyticsPopularRoutes: endpoint not yet implemented on backend.');
    return null;
  },
  getAnalyticsBookingVolume: async () => {
    console.warn('[adminTransportService] getAnalyticsBookingVolume: endpoint not yet implemented on backend.');
    return null;
  },
});
