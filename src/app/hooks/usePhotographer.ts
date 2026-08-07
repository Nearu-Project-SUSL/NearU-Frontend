import { useQuery } from "@tanstack/react-query";
import {
  getPhotographerById,
  getPhotographers,
  type PhotographerQueryParams,
} from "../../api/services/photographerApi";

/**
 * Fetches the list of photographers with optional keyword/location filters.
 */
export function usePhotographers(params: PhotographerQueryParams = {}) {
  return useQuery({
    queryKey: ["photographers", params.keyword ?? "", params.location ?? ""],
    queryFn: () => getPhotographers(params),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetches a single photographer profile by ID, including packages.
 */
export function usePhotographer(id: string) {
  return useQuery({
    queryKey: ["photographer", id],
    queryFn: () => getPhotographerById(id),
    enabled: !!id,
  });
}
