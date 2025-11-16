export interface GiaoVien {
  magv: string;
  ho: string;
  ten: string;
  diachi: string;
  makh: string;
}

export interface CreateGiaoVienRequest {
  magv: string;
  ho: string;
  ten: string;
  diachi: string;
  makh: string;
}

export interface UpdateGiaoVienRequest {
  magv: string;
  ho: string;
  ten: string;
  diachi: string;
  makh: string;
}

export interface GiaoVienResponse {
  status: string;
  message: string;
}
