import { error } from "node:console";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://nearu-app-5ldre.ondigitalocean.app';

  
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

export async function getAllShops(): Promise<ShopResponse[]>{
  const response = await fetch(`${BASE_URL}/foodshops`);

  if(!response.ok){
    throw new Error(`Failed to fetch shops: ${response.statusText}`)
  }

  return response.json();
}


export async function getShopById(id:string): Promise<ShopResponse>{
  const response = await fetch(`${BASE_URL}/foodshops/${id}`);

  if(!response.ok){
    throw new Error(`Failed to fetch shop: ${response.statusText}`)
  }

  return response.json();
}

export async function getMenuItems(shopId: string): Promise<MenuItemResponse[]> {
  const response = await fetch(`${BASE_URL}/foodshops/${shopId}/menuitems`);

  if (!response.ok) {
    throw new Error(`Failed to fetch menu items: ${response.statusText}`);
  }

  return response.json();
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch (`${BASE_URL}/foodshops/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function addMenuItem(
  shopId: string,
  data: {
    name: string,
    description: string,
    price: number,
    photo: File | null;
  }
): Promise<MenuItemResponse> {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", String(data.price));

  if (data.photo){
    formData.append("photo", data.photo);
  }

  const response = await fetch(
    `${BASE_URL}/foodshops/${shopId}/menuItems`,
    {
      method:"POST",
      body: formData
    }
  );

  if(!response.ok){
    throw new Error(`Failed to add menu item: ${response.statusText}`);
  }

  return response.json();
}
