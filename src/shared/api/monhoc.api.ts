import { httpClient } from '@app/lib/http-client';
import { CreateMonHocRequest, MonHoc, MonHocResponse } from '@app/shared/types';

export const getMonHocListApi = async (): Promise<MonHoc[]> => {
  return httpClient.get('/api/v1/monhoc');
};

export const createMonHocApi = async (payload: CreateMonHocRequest[]): Promise<MonHocResponse> => {
  return httpClient.post('/api/v1/monhoc', payload);
};
