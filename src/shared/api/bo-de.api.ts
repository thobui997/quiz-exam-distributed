import { httpClient } from '@app/lib/http-client';
import { BoDe, CreateBoDeRequest, BoDeResponse, UpdateBoDeRequest } from '@app/shared/types/bo-de.type';

export const getBoDeListApi = async (maCS: string): Promise<BoDe[]> => {
  return httpClient.get(`/api/v1/${maCS}/bode`);
};

export const createBoDeApi = async (maCS: string, payload: CreateBoDeRequest): Promise<BoDeResponse> => {
  return httpClient.post('/api/v1/bode', {
    macs: maCS,
    listBoDe: [payload]
  });
};

export const updateBoDeApi = async (maCS: string, payload: UpdateBoDeRequest): Promise<BoDeResponse> => {
  return httpClient.put('/api/v1/bode', {
    macs: maCS,
    listBoDe: [payload]
  });
};

export const deleteBoDeApi = async (maCS: string, boDe: BoDe): Promise<BoDeResponse> => {
  return httpClient.delete('/api/v1/bode', {
    data: {
      macs: maCS,
      listBoDe: [boDe]
    }
  });
};
