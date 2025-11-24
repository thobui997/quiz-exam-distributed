import { httpClient } from '@app/lib/http-client';
import { BaoCaoDangKyResponse, GetBaoCaoDangKyRequest } from '@app/shared/types/bao-cao-dang-ky.type';

export const getBaoCaoDangKyApi = async (params: GetBaoCaoDangKyRequest): Promise<BaoCaoDangKyResponse> => {
  const { tungay, denngay } = params;
  return httpClient.get(`/api/v1/job?tungay=${tungay}&denngay=${denngay}`);
};
