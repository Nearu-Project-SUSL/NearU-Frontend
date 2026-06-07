import { useCallback, useEffect, useState } from 'react';
import { adminTransportService } from '../../api/adminTransportService';
import useAxiosPrivate from './useAxiosPrivate';
import {
  AdminRider,
  BusRoute,
  TrainRoute,
  TransportBooking,
  TransportAnalyticsSummary
} from '../../types/adminTransport';

const useAdminTransport = () => {
  const axiosPrivate = useAxiosPrivate();
  const service = adminTransportService(axiosPrivate);

  const [riders, setRiders] = useState<AdminRider[]>([]);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
  const [trainRoutes, setTrainRoutes] = useState<TrainRoute[]>([]);
  const [bookings, setBookings] = useState<TransportBooking[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<TransportAnalyticsSummary>({
    riders: { pending: 0, approved: 0, suspended: 0 },
    routes: { bus: 0, train: 0 },
    bookingsToday: 0,
    revenueTodayLkr: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ridersData, busData, trainData, bookingsData, analyticsData] = await Promise.all([
        service.getRiders(),
        service.getBusRoutes(),
        service.getTrainRoutes(),
        service.getBookings(),
        service.getAnalyticsOverview()
      ]);
      setRiders(ridersData);
      setBusRoutes(busData);
      setTrainRoutes(trainData);
      setBookings(bookingsData);
      setAnalyticsSummary(analyticsData);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load admin transport data.');
    } finally {
      setLoading(false);
    }
  }, [service]);

  const runAction = useCallback(async (action: () => Promise<unknown>, fallbackMessage: string) => {
    setError(null);
    try {
      await action();
      await refreshAll();
    } catch (err: any) {
      setError(err?.message ?? fallbackMessage);
      throw err;
    }
  }, [refreshAll]);

  const approveRider = useCallback((id: string) => runAction(
    () => service.approveRider(id),
    'Failed to approve rider.'
  ), [runAction, service]);

  const rejectRider = useCallback((id: string) => runAction(
    () => service.rejectRider(id),
    'Failed to reject rider.'
  ), [runAction, service]);

  const suspendRider = useCallback((id: string) => runAction(
    () => service.suspendRider(id),
    'Failed to suspend rider.'
  ), [runAction, service]);

  const reactivateRider = useCallback((id: string) => runAction(
    () => service.reactivateRider(id),
    'Failed to reactivate rider.'
  ), [runAction, service]);

  const updateRiderAvailability = useCallback(
    (id: string, availability: AdminRider['availability']) => runAction(
      () => service.updateRiderAvailability(id, { availability }),
      'Failed to update rider availability.'
    ),
    [runAction, service]
  );

  const activateBusRoute = useCallback((id: string) => runAction(
    () => service.activateBusRoute(id),
    'Failed to activate bus route.'
  ), [runAction, service]);

  const deactivateBusRoute = useCallback((id: string) => runAction(
    () => service.deactivateBusRoute(id),
    'Failed to deactivate bus route.'
  ), [runAction, service]);

  const deleteBusRoute = useCallback((id: string) => runAction(
    () => service.deleteBusRoute(id),
    'Failed to delete bus route.'
  ), [runAction, service]);

  const activateTrainRoute = useCallback((id: string) => runAction(
    () => service.activateTrainRoute(id),
    'Failed to activate train route.'
  ), [runAction, service]);

  const deactivateTrainRoute = useCallback((id: string) => runAction(
    () => service.deactivateTrainRoute(id),
    'Failed to deactivate train route.'
  ), [runAction, service]);

  const deleteTrainRoute = useCallback((id: string) => runAction(
    () => service.deleteTrainRoute(id),
    'Failed to delete train route.'
  ), [runAction, service]);

  const cancelBooking = useCallback((id: string) => runAction(
    () => service.cancelBooking(id),
    'Failed to cancel booking.'
  ), [runAction, service]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    riders,
    busRoutes,
    trainRoutes,
    bookings,
    analyticsSummary,
    loading,
    error,
    refreshAll,
    approveRider,
    rejectRider,
    suspendRider,
    reactivateRider,
    updateRiderAvailability,
    activateBusRoute,
    deactivateBusRoute,
    deleteBusRoute,
    activateTrainRoute,
    deactivateTrainRoute,
    deleteTrainRoute,
    cancelBooking
  };
};

export default useAdminTransport;
