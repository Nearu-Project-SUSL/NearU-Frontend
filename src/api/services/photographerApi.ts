import api, { axiosPrivate } from "../axios";

export interface PhotographyPackageResponseDto {
  id: string;
  photographerId: string;
  name: string;
  price: number;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhotographerResponseDto {
  id: string;
  name: string;
  bio?: string | null;
  baseRatePerHour: number;
  locationName: string;
  phone: string;
  email?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  ownerId?: string | null;
  createdAt: string;
  updatedAt: string;
  packages: PhotographyPackageResponseDto[];
}

export interface PhotographerQueryParams {
  keyword?: string;
  location?: string;
  isActive?: boolean;
}

// ── Public reads ─────────────────────────────────────────────────────────────

export const getPhotographers = async (params?: PhotographerQueryParams) => {
  const response = await api.get<PhotographerResponseDto[]>("/Photographers", { params });
  return response.data;
};

export const getPhotographerById = async (id: string) => {
  const response = await api.get<PhotographerResponseDto>(`/Photographers/${id}`);
  return response.data;
};

// ── Authenticated writes (Business/Admin) ────────────────────────────────────

export const createPhotographer = async (formData: FormData) => {
  const response = await axiosPrivate.post<PhotographerResponseDto>("/Photographers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updatePhotographer = async (id: string, formData: FormData) => {
  const response = await axiosPrivate.put<PhotographerResponseDto>(`/Photographers/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deletePhotographer = async (id: string) => {
  const response = await axiosPrivate.delete<{ message: string }>(`/Photographers/${id}`);
  return response.data;
};

export const addPhotographyPackage = async (photographerId: string, data: { name: string; price: number; description?: string; isActive?: boolean }) => {
  const response = await axiosPrivate.post<PhotographyPackageResponseDto>(
    `/Photographers/${photographerId}/packages`,
    data
  );
  return response.data;
};

export const updatePhotographyPackage = async (packageId: string, data: { name: string; price: number; description?: string; isActive?: boolean }) => {
  const response = await axiosPrivate.put<PhotographyPackageResponseDto>(
    `/Photographers/packages/${packageId}`,
    data
  );
  return response.data;
};

export const deletePhotographyPackage = async (packageId: string) => {
  const response = await axiosPrivate.delete<{ message: string }>(`/Photographers/packages/${packageId}`);
  return response.data;
};
