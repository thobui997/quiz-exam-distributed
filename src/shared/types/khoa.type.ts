export interface Khoa {
  makh: string;
  tenkh: string;
  macs: string;
}

export interface CreateKhoaRequest {
  makh: string;
  tenkh: string;
  macs: string;
}

export interface UpdateKhoaRequest {
  makh: string;
  tenkh: string;
  macs: string;
}

export interface KhoaResponse {
  status: string;
  message: string;
}
