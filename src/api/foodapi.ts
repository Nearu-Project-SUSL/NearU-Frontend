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
  const response = await fetch(`${BASE_URL}/api/foodshops`);

  if(!response.ok){
    throw new Error(`Failed to fetch shops: ${response.statusText}`)
  }

  return response.json();
}


export async function getShopById(id:string): Promise<ShopResponse>{
  const response = await fetch(`${BASE_URL}/api/foodshops/${id}`);

  if(!response.ok){
    throw new Error(`Failed to fetch shop: ${response.statusText}`)
  }

  return response.json();
}

export async function getMenuItems(shopId: string): Promise<MenuItemResponse[]> {
  const response = await fetch(`${BASE_URL}/api/foodshops/${shopId}/menuitems`);

  if (!response.ok) {
    throw new Error(`Failed to fetch menu items: ${response.statusText}`);
  }

  return response.json();
}
