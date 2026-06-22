import axiosPrivate  from './axios';
import { TukTukDriver, BusRoute, TrainRoute } from '../types/transport';

export const getTukTukDrivers = async (): Promise<TukTukDriver[]> => {
  const res = await axiosPrivate.get('/tuktukdrivers');
  return res.data;
};

export const getBusRoutes = async (): Promise<BusRoute[]> => {
  const res = await axiosPrivate.get('/busroutes');
  return res.data;
};

export const getTrainRoutes = async (): Promise<TrainRoute[]> => {
  const res = await axiosPrivate.get('/trainroutes');
  return res.data;
};