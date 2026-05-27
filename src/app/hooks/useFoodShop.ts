import {useQuery} from '@tanstack/react-query';
import {getAllShops, getShopById, getMenuItems, getCategories, GetShopsParams} from '../../api/foodapi';

export function useFoodShops(params: GetShopsParams = {}){
  return useQuery({
    queryKey: ['foodshops',  // when page changes React Query fetches new data automatically
      params.page ?? 1,
      params.pageSize ?? 9,
      params.category ?? '',
      params.search ?? ''
    ], // like a cache address in here cache under foodshops key
    //if anotherone calls foodshops it gets cached data

    queryFn: () => getAllShops(params),  //calls backend
  
    placeholderData:(previousData) => previousData, //old data visible until new data arrive
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

export function useFoodCategories(){
  return useQuery({
    queryKey: ['foodcategories'],

    queryFn: getCategories,
    staleTime: Infinity, // never change cache
  })
}