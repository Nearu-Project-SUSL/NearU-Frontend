import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getApprovedDeals,
  getMyDeals,
  createDeal,
  getAdminDeals,
  approveDeal,
  rejectDeal,
  DealResponseDto,
} from '../../api/services/dealsApi';

export const DEAL_QUERY_KEYS = {
  approved: ['deals', 'approved'] as const,
  mine: ['deals', 'mine'] as const,
  admin: (status?: string, page?: number) => ['deals', 'admin', status, page] as const,
};

export const useApprovedDeals = () => {
  return useQuery({
    queryKey: DEAL_QUERY_KEYS.approved,
    queryFn: async () => {
      const data = await getApprovedDeals();
      localStorage.setItem('nearu_cached_approved_deals', JSON.stringify(data));
      return data;
    },
    initialData: (): DealResponseDto[] | undefined => {
      const cached = localStorage.getItem('nearu_cached_approved_deals');
      return cached ? (JSON.parse(cached) as DealResponseDto[]) : undefined;
    },
    staleTime: 60 * 1000,
  });
};

export const useMyDeals = () => {
  return useQuery({
    queryKey: DEAL_QUERY_KEYS.mine,
    queryFn: getMyDeals,
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createDeal(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
};

export const useAdminDeals = (status = 'Pending', page = 1) => {
  return useQuery({
    queryKey: DEAL_QUERY_KEYS.admin(status, page),
    queryFn: () => getAdminDeals(status, page),
  });
};

export const useApproveDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dealId: string) => approveDeal(dealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
};

export const useRejectDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dealId, reason }: { dealId: string; reason?: string }) =>
      rejectDeal(dealId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
};
