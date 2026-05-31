import { axiosPrivate } from './axios';
import { ApiResponse } from './authService';

export interface AdminStats {
  totalRides: number;
  activeRides: number;
  totalRiders: number;
  onlineRiders: number;
  pendingApprovals: number;
}

export interface AdminRider {
  riderId: string;
  name: string;
  email: string;
  approvalStatus: string; // 'Pending' | 'Approved' | 'Rejected' | 'Suspended'
  riderTier: string;      // 'Standard' | 'Premium'
  isOnline: boolean;
  lastSeen: string;
}

export interface AdminBusiness {
  id: string;
  userId: string;
  ownerEmail: string;
  businessName: string;
  businessType: string;
  ownerName: string;
  phone: string;
  address: string;
  status: string;
  submittedAt: string;
}

export interface GetRidersResponse {
  total: number;
  page: number;
  pageSize: number;
  riders: AdminRider[];
}

export interface GetBusinessesResponse {
  total: number;
  page: number;
  pageSize: number;
  applications: AdminBusiness[];
}


const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await axiosPrivate.get<ApiResponse<AdminStats>>('/admin/stats');
    return response.data.data;
  },

  getRiders: async (status?: string, page = 1, pageSize = 20): Promise<GetRidersResponse> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    
    const response = await axiosPrivate.get<ApiResponse<GetRidersResponse>>(`/admin/riders?${params.toString()}`);
    return response.data.data;
  },

  approveRider: async (riderId: string): Promise<any> => {
    const response = await axiosPrivate.put<ApiResponse<any>>(`/admin/riders/${riderId}/approve`);
    return response.data.data;
  },

  rejectRider: async (riderId: string): Promise<any> => {
    const response = await axiosPrivate.put<ApiResponse<any>>(`/admin/riders/${riderId}/reject`);
    return response.data.data;
  },

  suspendRider: async (riderId: string): Promise<any> => {
    const response = await axiosPrivate.put<ApiResponse<any>>(`/admin/riders/${riderId}/suspend`);
    return response.data.data;
  },

  setRiderTier: async (riderId: string, tier: 'Standard' | 'Premium'): Promise<any> => {
    const tierValue = tier === 'Premium' ? 1 : 0;
    const response = await axiosPrivate.put<ApiResponse<any>>(`/admin/riders/${riderId}/tier`, { tier: tierValue });
    return response.data.data;
  },

  getBusinessApplications: async (status?: string, page = 1, pageSize = 50): Promise<GetBusinessesResponse> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await axiosPrivate.get<ApiResponse<GetBusinessesResponse>>(
      `/admin/businesses?${params.toString()}`
    );
    return response.data.data;
  },

  approveBusiness: async (id: string): Promise<void> => {
    await axiosPrivate.put(`/admin/businesses/${id}/approve`);
  },

  rejectBusiness: async (id: string, reason: string): Promise<void> => {
    await axiosPrivate.put(`/admin/businesses/${id}/reject`, { reason });
  },

};

export default adminService;
