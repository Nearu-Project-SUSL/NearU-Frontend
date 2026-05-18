import { useQuery } from "@tanstack/react-query";
import {
  getGiftShopById,
  getGiftShops,
  type GiftShopQueryParams,
} from "../../api/services/giftShopApi";

export function useGiftShops(params: GiftShopQueryParams = {}) {
  return useQuery({
    queryKey: ["giftshops", params.keyword ?? "", params.location ?? ""],
    queryFn: () => getGiftShops(params),
  });
}

export function useGiftShop(id: string) {
  return useQuery({
    queryKey: ["giftshop", id],
    queryFn: () => getGiftShopById(id),
    enabled: !!id,
  });
}
