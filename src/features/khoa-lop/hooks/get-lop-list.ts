import { getLopListApi } from '@app/shared/api/lop.api';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getLopListQueryOptions = (maKH: string) => {
  return queryOptions({
    queryKey: ['lop', maKH],
    queryFn: () => getLopListApi(maKH),
    enabled: !!maKH
  });
};

export const useLopList = (maKH: string) => {
  return useQuery(getLopListQueryOptions(maKH));
};
