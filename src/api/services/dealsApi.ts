import defaultAxios, { axiosPrivate } from '../axios';
import type { ApiResponse } from '../authService';

export interface DealResponseDto {
  id: string;
  shopName: string;
  shopType: string;
  title: string;
  description: string;
  badgeText: string;
  badgeColor: string;
  imageUrl: string | null;
  validFrom: string | null;
  validTo: string | null;
  submittedByUserId: string;
  submittedByName: string;
  shopAddress: string | null;
  approvalStatus: string;
  rejectionReason: string | null;
  createdAt: string;
}

export interface AdminDealsListResponse {
  total: number;
  page: number;
  pageSize: number;
  deals: DealResponseDto[];
}

export const getApprovedDeals = async (): Promise<DealResponseDto[]> => {
  const response = await defaultAxios.get<ApiResponse<DealResponseDto[]>>('/deals');
  return response.data.data ?? [];
};

export const getMyDeals = async (): Promise<DealResponseDto[]> => {
  const response = await axiosPrivate.get<ApiResponse<DealResponseDto[]>>('/deals/my');
  return response.data.data ?? [];
};

export const createDeal = async (formData: FormData): Promise<DealResponseDto> => {
  const response = await axiosPrivate.post<ApiResponse<DealResponseDto>>('/deals', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data!;
};

export const getAdminDeals = async (
  status?: string,
  page = 1,
  pageSize = 20
): Promise<AdminDealsListResponse> => {
  const response = await axiosPrivate.get<ApiResponse<AdminDealsListResponse>>('/admin/deals', {
    params: { status, page, pageSize },
  });
  return response.data.data!;
};

export const approveDeal = async (dealId: string): Promise<DealResponseDto> => {
  const response = await axiosPrivate.put<ApiResponse<DealResponseDto>>(
    `/admin/deals/${dealId}/approve`
  );
  return response.data.data!;
};

export const rejectDeal = async (dealId: string, reason?: string): Promise<DealResponseDto> => {
  const response = await axiosPrivate.put<ApiResponse<DealResponseDto>>(
    `/admin/deals/${dealId}/reject`,
    { reason }
  );
  return response.data.data!;
};

export const deleteDeal = async (dealId: string): Promise<void> => {
  await axiosPrivate.delete(`/deals/${dealId}`);
};
