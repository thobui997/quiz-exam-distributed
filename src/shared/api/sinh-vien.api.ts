import { httpClient } from '@app/lib/http-client';
import { SinhVien, SinhVienBatchRequest, SinhVienResponse } from '@app/shared/types/sinh-vien.type';

export const getSinhVienListApi = async (maLop: string): Promise<SinhVien[]> => {
  return httpClient.get(`/api/v1/${maLop}/sinhvien`);
};

export const createSinhVienBatchApi = async (payload: SinhVienBatchRequest): Promise<SinhVienResponse> => {
  return httpClient.post('/api/v1/sinhvien', payload);
};

export const updateSinhVienBatchApi = async (payload: SinhVienBatchRequest): Promise<SinhVienResponse> => {
  return httpClient.put('/api/v1/sinhvien', payload);
};

export const deleteSinhVienBatchApi = async (payload: SinhVienBatchRequest): Promise<SinhVienResponse> => {
  return httpClient.delete('/api/v1/sinhvien', { data: payload });
};
