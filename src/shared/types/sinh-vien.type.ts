export interface SinhVien {
  masv: string;
  ho: string;
  ten: string;
  ngaysinh: string;
  diachi: string;
  malop: string;
}

export interface SinhVienBatchRequest {
  macs: string;
  listSinhVien: SinhVien[];
}

export interface SinhVienResponse {
  status: string;
  message: string;
}
