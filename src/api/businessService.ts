// businessService.ts — rewrite to use axiosPrivate
import { axiosPrivate } from './axios';

export interface BusinessStatus {
  id: string;
  businessName: string;
  businessType: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface FoodShopPayload {
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  category: string;
  photo?: File;
}

const businessService = {
  getStatus: async (): Promise<BusinessStatus> => {
    const res = await axiosPrivate.get('/business/status');
    return res.data.data;
  },

  getMyFoodShop: async () => {
    const res = await axiosPrivate.get('/business/food/me');
    return res.data.data;
  },

  createFoodShop: async (payload: FoodShopPayload) => {
    const formData = new FormData();
    formData.append('name', payload.name);
    if (payload.description) formData.append('description', payload.description);
    if (payload.address)     formData.append('address', payload.address);
    if (payload.phoneNumber) formData.append('phoneNumber', payload.phoneNumber);
    formData.append('category', payload.category);
    if (payload.photo)       formData.append('photo', payload.photo);

    const res = await axiosPrivate.post('/business/food', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data;
  }
};

export default businessService;