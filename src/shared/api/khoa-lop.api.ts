import { httpClient } from '@app/lib/http-client';
import { KhoaLopRequest, KhoaLopResponse } from '@app/shared/types/khoa-lop.type';

export const createKhoaLopBatchApi = async (payload: KhoaLopRequest): Promise<KhoaLopResponse> => {
  return httpClient.post('/api/v1/khoalop', payload);
};

export const updateKhoaLopBatchApi = async (payload: KhoaLopRequest): Promise<KhoaLopResponse> => {
  return httpClient.put('/api/v1/khoalop', payload);
};

export const deleteKhoaLopBatchApi = async (payload: KhoaLopRequest): Promise<KhoaLopResponse> => {
  return httpClient.delete('/api/v1/khoalop', { data: payload });
};
