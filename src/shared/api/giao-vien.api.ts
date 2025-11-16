import { httpClient } from '@app/lib/http-client';
import {
  GiaoVien,
  CreateGiaoVienRequest,
  GiaoVienResponse,
  UpdateGiaoVienRequest
} from '@app/shared/types/giao-vien.type';

export const getGiaoVienListApi = async (maCS: string): Promise<GiaoVien[]> => {
  return httpClient.get(`/api/v1/${maCS}/giaovien`);
};

export const createGiaoVienApi = async (maCS: string, payload: CreateGiaoVienRequest): Promise<GiaoVienResponse> => {
  return httpClient.post('/api/v1/giaovien', {
    macs: maCS,
    listGiaoVien: [payload]
  });
};

export const updateGiaoVienApi = async (maCS: string, payload: UpdateGiaoVienRequest): Promise<GiaoVienResponse> => {
  return httpClient.put('/api/v1/giaovien', {
    macs: maCS,
    listGiaoVien: [payload]
  });
};

export const deleteGiaoVienApi = async (maCS: string, giaoVien: GiaoVien): Promise<GiaoVienResponse> => {
  return httpClient.delete('/api/v1/giaovien', {
    data: {
      macs: maCS,
      listGiaoVien: [giaoVien]
    }
  });
};
