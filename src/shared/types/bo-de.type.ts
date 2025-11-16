export interface BoDe {
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

export interface CreateBoDeRequest {
  cauhoi?: number;
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

export interface UpdateBoDeRequest {
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

export interface BoDeResponse {
  status: string;
  message: string;
}
