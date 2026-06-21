import {useQuery} from '@tanstack/react-query';
import {getAllShops, getShopById, getMenuItems, getCategories, GetShopsParams, PagedShopResponse} from '../../api/foodapi';

export function useFoodShops(params: GetShopsParams = {}){
  const isDefaultQuery = !params.category && !params.search && (params.page === 1 || !params.page);
  return useQuery({
    queryKey: ['foodshops',  // when page changes React Query fetches new data automatically
      params.page ?? 1,
      params.pageSize ?? 9,
      params.category ?? '',
      params.search ?? ''
    ], // like a cache address in here cache under foodshops key
    //if anotherone calls foodshops it gets cached data

    queryFn: async () => {
      const data = await getAllShops(params);
      if (isDefaultQuery) {
        localStorage.setItem('nearu_cached_foodshops_default', JSON.stringify(data));
      }
      return data;
    },
  
    initialData: (): PagedShopResponse | undefined => {
      if (isDefaultQuery) {
        const cached = localStorage.getItem('nearu_cached_foodshops_default');
        return cached ? (JSON.parse(cached) as PagedShopResponse) : undefined;
      }
      return undefined;
    },
  
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