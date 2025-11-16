import { httpClient } from '@app/lib/http-client';
import {
  GiaoVienDangKy,
  GiaoVienDangKyBatchRequest,
  GiaoVienDangKyResponse
} from '@app/shared/types/giao-vien-dang-ky.type';

export const getGiaoVienDangKyListApi = async (maCS: string): Promise<GiaoVienDangKy[]> => {
  return httpClient.get(`/api/v1/${maCS}/giaovien/dangky`);
};

export const createGiaoVienDangKyBatchApi = async (
  payload: GiaoVienDangKyBatchRequest
): Promise<GiaoVienDangKyResponse> => {
  return httpClient.post('/api/v1/giaovien/dangky', payload);
};

export const updateGiaoVienDangKyBatchApi = async (
  payload: GiaoVienDangKyBatchRequest
): Promise<GiaoVienDangKyResponse> => {
  return httpClient.put('/api/v1/giaovien/dangky', payload);
};

export const deleteGiaoVienDangKyBatchApi = async (
  payload: GiaoVienDangKyBatchRequest
): Promise<GiaoVienDangKyResponse> => {
  return httpClient.delete('/api/v1/giaovien/dangky', { data: payload });
};
