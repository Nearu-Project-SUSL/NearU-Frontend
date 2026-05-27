import api from "../axios";

export interface GiftProductResponseDto {
  id: string;
  giftShopId: string;
  name: string;
  photoUrl?: string | null;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GiftShopResponseDto {
  id: string;
  name: string;
  imageUrl?: string | null;
  locationName: string;
  phone: string;
  email?: string | null;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products: GiftProductResponseDto[];
}

export interface GiftShopQueryParams {
  keyword?: string;
  location?: string;
  isActive?: boolean;
}

export const getGiftShops = async (params?: GiftShopQueryParams) => {
  const response = await api.get<GiftShopResponseDto[]>("/GiftShops", { params });
  return response.data;
};

export const getGiftShopById = async (id: string) => {
  const response = await api.get<GiftShopResponseDto>(`/GiftShops/${id}`);
  return response.data;
};

export const createGiftShop = async (formData: FormData) => {
  const response = await api.post<GiftShopResponseDto>("/GiftShops", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateGiftShop = async (id: string, formData: FormData) => {
  const response = await api.put<GiftShopResponseDto>(`/GiftShops/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteGiftShop = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/GiftShops/${id}`);
  return response.data;
};

export const addGiftProduct = async (giftShopId: string, formData: FormData) => {
  const response = await api.post<GiftProductResponseDto>(
    `/GiftShops/${giftShopId}/products`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const updateGiftProduct = async (productId: string, formData: FormData) => {
  const response = await api.put<GiftProductResponseDto>(
    `/GiftShops/products/${productId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const deleteGiftProduct = async (productId: string) => {
  const response = await api.delete<{ message: string }>(`/GiftShops/products/${productId}`);
  return response.data;
};