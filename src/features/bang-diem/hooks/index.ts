import { getBangDiemApi } from '@app/shared/api/bang-diem.api';
import { GetBangDiemRequest } from '@app/shared/types/bang-diem.type';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getBangDiemQueryOptions = (params: GetBangDiemRequest, enabled: boolean) => {
  return queryOptions({
    queryKey: ['bang-diem', params],
    queryFn: () => getBangDiemApi(params),
    enabled
  });
};

export const useBangDiem = (params: GetBangDiemRequest, enabled: boolean) => {
  return useQuery(getBangDiemQueryOptions(params, enabled));
};
