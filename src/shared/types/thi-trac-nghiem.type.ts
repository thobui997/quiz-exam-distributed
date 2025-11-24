export interface BoDeThiRequest {
  magv: string;
  mamh: string;
  trinhdo: string;
  socauthi: number;
  macs: string;
}

export interface CauHoiThi {
  cauhoi: number;
  mamh: string;
  trinhdo: string;
  noidung: string;
  a: string;
  b: string;
  c: string;
  d: string;
  dapan: string;
  magv: string;
}

export interface DapAnDaChon {
  cauhoi: number;
  dapan: string;
}

export interface LuuDiemRequest {
  masv: string;
  malop: string;
  mamh: string;
  lan: number;
  ngaythi: string;
  diem: number;
  macs: string;
}

export interface LuuDiemResponse {
  status: string;
  message: string;
}

export interface ThongTinThi {
  magv: string;
  mamh: string;
  trinhdo: string;
  socauthi: number;
  macs: string;
  thoigian: number;
  masv: string;
  malop: string;
  lan: number;
}
