export interface Lop {
  malop: string;
  tenlop: string;
  makh: string;
}

export interface CreateLopRequest {
  malop: string;
  tenlop: string;
  makh: string;
}

export interface UpdateLopRequest {
  malop: string;
  tenlop: string;
  makh: string;
}

export interface LopResponse {
  status: string;
  message: string;
}
