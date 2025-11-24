import { getBaoCaoDangKyApi } from '@app/shared/api/bao-cao-dang-ky.api';
import { GetBaoCaoDangKyRequest } from '@app/shared/types/bao-cao-dang-ky.type';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getBaoCaoDangKyQueryOptions = (params: GetBaoCaoDangKyRequest, enabled: boolean) => {
  return queryOptions({
    queryKey: ['bao-cao-dang-ky', params],
    queryFn: () => getBaoCaoDangKyApi(params),
    enabled: enabled && !!params.tungay && !!params.denngay
  });
};

export const useBaoCaoDangKy = (params: GetBaoCaoDangKyRequest, enabled: boolean) => {
  return useQuery(getBaoCaoDangKyQueryOptions(params, enabled));
};
