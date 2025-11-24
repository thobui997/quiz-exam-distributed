export interface BangDiem {
  masv: string;
  ho: string;
  ten: string;
  diem: number;
  diemChu: string;
}

export interface GetBangDiemRequest {
  malop: string;
  mamh: string;
  lan: number;
  macs: string;
}

export interface BangDiemResponse {
  status: string;
  message: string;
}
