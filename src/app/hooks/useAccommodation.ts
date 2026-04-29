import { useQuery } from '@tanstack/react-query';
import accommodationService from '../../api/accommodationService';

export function useAccommodations() {
  return useQuery({
    queryKey: ['accommodations'],
    queryFn: accommodationService.fetchAccommodations,
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
