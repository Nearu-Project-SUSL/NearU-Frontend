import axios from 'axios';

const API_BASE = 'http://localhost:5059/api';

const getAuthHeader = () => ({
  headers:{
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

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
  //check status
  getStatus: async () : Promise<BusinessStatus> => {
    const res = await axios.get(`${API_BASE}/business/status`, getAuthHeader());
    return res.data.data;
  },

  //check if profile exists
  getMyFoodShop: async () => {
    const res = await axios.get(`${API_BASE}/business/food/me`, getAuthHeader());
    return res.data.data;
  },

  // Submit food shop profile
  createFoodShop: async (payload: FoodShopPayload) => {
    const formData = new FormData();
    formData.append('name', payload.name);
    if (payload.description) formData.append('description', payload.description);
    if (payload.address) formData.append('address', payload.address);
    if (payload.phoneNumber) formData.append('phoneNumber', payload.phoneNumber);
    formData.append('category', payload.category);
    if (payload.photo) formData.append('photo', payload.photo);

    const res = await axios.post(`${API_BASE}/business/food`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.data;
  }
};

export default businessService;