import { httpClient } from '@app/lib/http-client';
import {
  BaoCaoDangKyApiResponse,
  BaoCaoDangKyResponse,
  GetBaoCaoDangKyRequest
} from '@app/shared/types/bao-cao-dang-ky.type';

export const getBaoCaoDangKyApi = async (params: GetBaoCaoDangKyRequest): Promise<BaoCaoDangKyResponse> => {
  const { tungay, denngay } = params;
  const apiResponse: any = await httpClient.get<BaoCaoDangKyApiResponse>(
    `/api/v1/job?tungay=${tungay}&denngay=${denngay}`
  );

  // Transform API response to expected format
  return {
    coSo1: apiResponse.cs1
      ? {
          macs: 'CS1',
          tenCoSo: 'CƠ SỞ 1',
          danhSach: apiResponse.cs1.map((item: any) => ({
            ...item,
            ghichu: item.ghichu || ''
          })),
          tongSoLuot: apiResponse.cs1.length
        }
      : null,
    coSo2: apiResponse.cs2
      ? {
          macs: 'CS2',
          tenCoSo: 'CƠ SỞ 2',
          danhSach: apiResponse.cs2.map((item: any) => ({
            ...item,
            ghichu: item.ghichu || ''
          })),
          tongSoLuot: apiResponse.cs2.length
        }
      : null
  };
};
