import { getMonHocListApi } from '@app/shared/api/monhoc.api';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getMonHocListQueryOptions = () => {
  return queryOptions({
    queryKey: ['mon-hoc'],
    queryFn: () => getMonHocListApi()
  });
};

export const useMonHocList = () => {
  return useQuery(getMonHocListQueryOptions());
};
