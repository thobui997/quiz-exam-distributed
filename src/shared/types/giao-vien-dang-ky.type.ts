export interface GiaoVienDangKy {
  magv: string;
  mamh: string;
  malop: string;
  trinhdo: string;
  ngaythi: string;
  lan: number;
  socauthi: number;
  thoigian: number;
}

export interface GiaoVienDangKyBatchRequest {
  macs: string;
  listGiaovienDangky: GiaoVienDangKy[];
}

export interface GiaoVienDangKyResponse {
  status: string;
  message: string;
}
