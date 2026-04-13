import {useQuery} from '@tanstack/react-query';
import {getAllShops, getShopById, getMenuItems} from '../../api/foodapi';

export function useFoodShops(){
  return useQuery({
    queryKey: ['foodshops'], // like a cache address in here cache under foodshops key
    //if anotherone calls foodshops it gets cached data

    queryFn: getAllShops  
  });
}

export function useFoodShop(id: string){
  return useQuery({
    queryKey: ['foodshops', id], //unique for shop

    queryFn: () => getShopById(id),

    enabled: !!id //only run if id exists
  });
}


export function useMenuItems(shopId: string){
  return useQuery({
    queryKey:['menuitems', shopId],

    queryFn: ()=> getMenuItems(shopId),
    enabled: !! shopId
  });
}