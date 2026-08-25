import { useQuery } from '@tanstack/react-query';
import accommodationService from '../../api/accommodationService';
import type { Accommodation } from '../pages/data/accommodations';

export function useAccommodations() {
  return useQuery({
    queryKey: ['accommodations'],
    queryFn: async () => {
      const data = await accommodationService.fetchAccommodations();
      localStorage.setItem('nearu_cached_accommodations', JSON.stringify(data));
      return data;
    },
    initialData: (): Accommodation[] | undefined => {
      const cached = localStorage.getItem('nearu_cached_accommodations');
      return cached ? (JSON.parse(cached) as Accommodation[]) : undefined;
    },
  });
}

export function useAccommodation(id: string) {
  return useQuery({
    queryKey: ['accommodations', id],
    queryFn: () => accommodationService.getAccommodationById(id),
    enabled: !!id,
  });
}

export function useAccommodationItems(accommodationId: string) {
  return useQuery({
    queryKey: ['accommodationItems', accommodationId],
    queryFn: () => accommodationService.fetchAccommodationItems(accommodationId),
    enabled: !!accommodationId,
  });
}
