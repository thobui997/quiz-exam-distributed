import { httpClient } from '@app/lib/http-client';
import { BangDiem, GetBangDiemRequest } from '@app/shared/types/bang-diem.type';

export const getBangDiemApi = async (params: GetBangDiemRequest): Promise<BangDiem[]> => {
  const { malop, mamh, lan, macs } = params;
  return httpClient.get(`/api/v1/bangdiem?malop=${malop}&mamh=${mamh}&lan=${lan}&macs=${macs}`);
};
