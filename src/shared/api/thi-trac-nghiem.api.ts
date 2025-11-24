import { httpClient } from '@app/lib/http-client';
import { BoDeThiRequest, CauHoiThi, LuuDiemRequest, LuuDiemResponse } from '@app/shared/types/thi-trac-nghiem.type';

export const getBoDeThiApi = async (payload: BoDeThiRequest): Promise<CauHoiThi[]> => {
  return httpClient.post('/api/v1/bode/thi', payload);
};

export const luuDiemThiApi = async (payload: LuuDiemRequest): Promise<LuuDiemResponse> => {
  return httpClient.post('/api/v1/bangdiem', payload);
};
