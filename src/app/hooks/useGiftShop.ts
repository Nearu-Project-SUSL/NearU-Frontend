import { useQuery } from "@tanstack/react-query";
import {
  getGiftShopById,
  getGiftShops,
  type GiftShopQueryParams,
} from "../../api/services/giftShopApi";

/**
 * Fetches the list of gift shops with optional keyword/location filters.
 * Results are cached under ["giftshops", keyword, location].
 * Previous data is shown while new data loads (placeholderData) for a smooth UX.
 */
export function useGiftShops(params: GiftShopQueryParams = {}) {
  return useQuery({
    queryKey: ["giftshops", params.keyword ?? "", params.location ?? ""],
    queryFn: () => getGiftShops(params),
    placeholderData: (previousData) => previousData, // keeps old list visible during refetch
  });
}

/**
 * Fetches a single gift shop by ID, including its products.
 * Only runs when a non-empty id is provided.
 */
export function useGiftShop(id: string) {
  return useQuery({
    queryKey: ["giftshop", id],
    queryFn: () => getGiftShopById(id),
    enabled: !!id,
  });
}
