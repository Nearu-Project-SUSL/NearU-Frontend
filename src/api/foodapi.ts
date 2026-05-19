// import axios from "./axios";

// const BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   'https://nearu-app-5ldre.ondigitalocean.app/api';

  
// export interface ShopResponse{
//   id: string;
//   name: string;
//   description: string | null;
//   address: string | null;
//   phoneNumber: string | null;
//   photoUrl: string | null;
//   createdAt: string;
//   category:string;
//   menuItemCount:number; 
// }

// export interface MenuItemResponse {
//   id: string;
//   foodShopId: string;
//   name: string;
//   description: string | null;
//   price: number;
//   photoUrl: string | null;
//   createdAt: string;
// }

// export interface GetShopsParams{
//   page?: number;
//   pageSize?: number;
//   category?: string;
//   search?: string;
// }

// export interface PagedShopResponse{
//   items: ShopResponse[];
//   currentPage:number;
//   pageSize:number;
//   totalCount:number;
//   totalPages:number;
//   hasPreviousPage: boolean;
//   hasNextPage: boolean;
// }

// export async function getAllShops(params: GetShopsParams = {}): Promise<PagedShopResponse>{
//   const{
//     page = 1,
//     pageSize = 9,
//     category,
//     search,
//   } = params;

//   const queryParams = new URLSearchParams();
//   queryParams.set('page', page.toString());
//   queryParams.set('pageSize', pageSize.toString());

//   if(category && category !== 'All'){
//     queryParams.set('category', category);
//   }

//   if(search && search.trim()){
//     queryParams.set('search', search.trim());
//   }
  
//   const response = await fetch(`${BASE_URL}/foodshops?${queryParams.toString()}`);

//   if(!response.ok){
//     throw new Error(`Failed to fetch shops: ${response.statusText}`)
//   }

//   return response.json();
// }


// export async function getShopById(id:string): Promise<ShopResponse>{
//   const response = await fetch(`${BASE_URL}/foodshops/${id}`);

//   if(!response.ok){
//     throw new Error(`Failed to fetch shop: ${response.statusText}`)
//   }

//   return response.json();
// }

// export async function getMenuItems(shopId: string): Promise<MenuItemResponse[]> {
//   const response = await fetch(`${BASE_URL}/foodshops/${shopId}/menuitems`);

//   if (!response.ok) {
//     throw new Error(`Failed to fetch menu items: ${response.statusText}`);
//   }

//   return response.json();
// }

// export async function getCategories(): Promise<string[]> {
//   const response = await fetch (`${BASE_URL}/foodshops/categories`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch categories');
//   }
//   return response.json();
// }

// export async function addMenuItem(
//   shopId: string,
//   data: {
//     name: string,
//     description: string,
//     price: number,
//     photo: File | null;
//   }
// ): Promise<MenuItemResponse> {
//   const formData = new FormData();

//   formData.append("name", data.name);
//   formData.append("description", data.description);
//   formData.append("price", String(data.price));

//   if (data.photo){
//     formData.append("photo", data.photo);
//   }

//   const response = await fetch(
//     `${BASE_URL}/foodshops/${shopId}/menuItems`,
//     {
//       method:"POST",
//       body: formData
//     }
//   );

//   if(!response.ok){
//     throw new Error(`Failed to add menu item: ${response.statusText}`);
//   }

//   return response.json();
// }

// export async function deleteMenuItem(
//   shopId: string,
//   itemId: string
// ): Promise<void>{
//   const response = await fetch(
//     `${BASE_URL}/foodshops/${shopId}/menuItems/${itemId}`,
//     {method: "DELETE"}
//   );

//   if(!response.ok){
//     throw new Error(`Failed to delete menu item: ${response.statusText}`);
//   }
// }

// export async function updateMenuItem(
//   shopId: string,
//   itemId: string,
//   data: {
//     name?: string;
//     description?: string;
//     price?: number;
//     photo?: File | null;
//   }
// ): Promise<MenuItemResponse> {
//   const formData = new FormData();

//   if (data.name) formData.append('name', data.name);
//   if (data.description !== undefined) formData.append('description', data.description);
//   if (data.price !== undefined) formData.append('price', String(data.price));
//   if (data.photo) formData.append('photo', data.photo);

//   const response = await fetch(
//     `${BASE_URL}/foodshops/${shopId}/menuItems/${itemId}`,
//     {
//       method: 'PUT',
//       body: formData
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to update menu item: ${response.statusText}`);
//   }

//   return response.json();
// }

// export async function deleteShop(shopId: string): Promise<void>{
//   const response = await fetch(
//     `${BASE_URL}/foodshops/${shopId}`,
//     {method: 'DELETE'}
//   );

//   if (!response.ok){
//     throw new Error(`Failed to delete shop: ${response.statusText}`);
//   }
// }

// export async function updateShop(
//   shopId: string,
//   data: {
//     name ?: string,
//     description ?: string,
//     address ?: string,
//     phoneNumber?: string;
//     category?: string;
//     photo?: File | null;
//   }
// ): Promise<ShopResponse>{
//   const formData = new FormData();

//   if (data.name) formData.append('name', data.name);
//   if (data.description !== undefined) formData.append('description', data.description);
//   if (data.address !== undefined) formData.append('address', data.address);
//   if (data.phoneNumber !== undefined) formData.append('phoneNumber', data.phoneNumber);
//   if (data.category) formData.append('category', data.category);
//   if (data.photo) formData.append('photo', data.photo);

//   const response = await fetch(
//     `${BASE_URL}/foodshops/${shopId}`,
//     {method: 'PUT', body: formData}
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to update shop: ${response.statusText}`);
//   }

//   return response.json();
// }


import axios from "./axios";

export interface ShopResponse{
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;
  createdAt: string;
  category:string;
  menuItemCount:number; 
}

export interface MenuItemResponse {
  id: string;
  foodShopId: string;
  name: string;
  description: string | null;
  price: number;
  photoUrl: string | null;
  createdAt: string;
}

export interface GetShopsParams{
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
}

export interface PagedShopResponse{
  items: ShopResponse[];
  currentPage:number;
  pageSize:number;
  totalCount:number;
  totalPages:number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export async function getAllShops(params: GetShopsParams = {}): Promise<PagedShopResponse> {
  const { page = 1, pageSize = 9, category, search } = params;
  const queryParams = new URLSearchParams();
  queryParams.set('page', page.toString());
  queryParams.set('pageSize', pageSize.toString());
  if (category && category !== 'All') queryParams.set('category', category);
  if (search?.trim()) queryParams.set('search', search.trim());

  const response = await axios.get<PagedShopResponse>(`/foodshops?${queryParams.toString()}`);
  return response.data;
}

export async function getShopById(id: string): Promise<ShopResponse> {
  const response = await axios.get<ShopResponse>(`/foodshops/${id}`);
  return response.data;
}

export async function getMenuItems(shopId: string): Promise<MenuItemResponse[]> {
  const response = await axios.get<MenuItemResponse[]>(`/foodshops/${shopId}/menuitems`);
  return response.data;
}

export async function getCategories(): Promise<string[]> {
  const response = await axios.get<string[]>(`/foodshops/categories`);
  return response.data;
}

export async function addMenuItem(
  shopId: string,
  data: {
    name: string;
    description: string;
    price: number;
    photo: File | null;
  }
): Promise<MenuItemResponse> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", String(data.price));
  if (data.photo) formData.append("photo", data.photo);

  const response = await axios.post<MenuItemResponse>(`/foodshops/${shopId}/menuItems`, formData);
  return response.data;
}

export async function deleteMenuItem(shopId: string, itemId: string): Promise<void> {
  await axios.delete(`/foodshops/${shopId}/menuItems/${itemId}`);
}

console.log('BASE URL:', axios.defaults.baseURL);

export async function updateMenuItem(
  shopId: string,
  itemId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    photo?: File | null;
  }
): Promise<MenuItemResponse> {
  const formData = new FormData();
  if (data.name) formData.append('name', data.name);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.price !== undefined) formData.append('price', String(data.price));
  if (data.photo) formData.append('photo', data.photo);

  const response = await axios.put<MenuItemResponse>(`/foodshops/${shopId}/menuItems/${itemId}`, formData);
  return response.data;
}

export async function deleteShop(shopId: string): Promise<void> {
  await axios.delete(`/foodshops/${shopId}`);
}

export async function updateShop(
  shopId: string,
  data: {
    name?: string;
    description?: string;
    address?: string;
    phoneNumber?: string;
    category?: string;
    photo?: File | null;
  }
): Promise<ShopResponse> {
  const formData = new FormData();
  if (data.name) formData.append('name', data.name);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.address !== undefined) formData.append('address', data.address);
  if (data.phoneNumber !== undefined) formData.append('phoneNumber', data.phoneNumber);
  if (data.category) formData.append('category', data.category);
  if (data.photo) formData.append('photo', data.photo);

  const response = await axios.put<ShopResponse>(`/foodshops/${shopId}`, formData);
  return response.data;
}

