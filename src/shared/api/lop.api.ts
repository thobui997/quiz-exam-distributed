import { httpClient } from '@app/lib/http-client';
import { Lop, CreateLopRequest, LopResponse, UpdateLopRequest } from '@app/shared/types/lop.type';

export const getLopListApi = async (maKH: string): Promise<Lop[]> => {
  return httpClient.get(`/api/v1/${maKH}/lop`);
};

export const createLopApi = async (payload: CreateLopRequest): Promise<LopResponse> => {
  return httpClient.post(`/api/v1/${payload.makh}/lop`, payload);
};

export const updateLopApi = async (payload: UpdateLopRequest): Promise<LopResponse> => {
  return httpClient.put(`/api/v1/${payload.makh}/lop/${payload.malop}`, payload);
};

export const deleteLopApi = async (maKH: string, maLop: string): Promise<LopResponse> => {
  return httpClient.delete(`/api/v1/${maKH}/lop/${maLop}`);
};
