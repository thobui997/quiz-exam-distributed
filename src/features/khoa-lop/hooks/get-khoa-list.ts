import { getKhoaListApi } from '@app/shared/api/khoa.api';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getKhoaListQueryOptions = (maCS: string) => {
  return queryOptions({
    queryKey: ['khoa', maCS],
    queryFn: () => getKhoaListApi(maCS),
    enabled: !!maCS
  });
};

export const useKhoaList = (maCS: string) => {
  return useQuery(getKhoaListQueryOptions(maCS));
};
