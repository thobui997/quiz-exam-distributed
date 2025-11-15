import { httpClient } from '@app/lib/http-client';
import { CreateKhoaRequest, Khoa, KhoaResponse, UpdateKhoaRequest } from '@app/shared/types/khoa.type';

export const getKhoaListApi = async (maCS: string): Promise<Khoa[]> => {
  return httpClient.get(`/api/v1/${maCS}/khoa`);
};

export const createKhoaApi = async (payload: CreateKhoaRequest): Promise<KhoaResponse> => {
  return httpClient.post(`/api/v1/${payload.macs}/khoa`, payload);
};

export const updateKhoaApi = async (payload: UpdateKhoaRequest): Promise<KhoaResponse> => {
  return httpClient.put(`/api/v1/${payload.macs}/khoa/${payload.makh}`, payload);
};

export const deleteKhoaApi = async (maCS: string, maKH: string): Promise<KhoaResponse> => {
  return httpClient.delete(`/api/v1/${maCS}/khoa/${maKH}`);
};
