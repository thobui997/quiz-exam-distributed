export interface BaoCaoDangKyItem {
  stt: number;
  tenlop: string;
  tenmh: string;
  giangvien_dangky: string;
  socauthi: number;
  ngaythi: string;
  dathi: boolean;
  macs: string;
  ghichu?: string;
}

export interface BaoCaoDangKyCoSo {
  macs: string;
  tenCoSo: string;
  danhSach: BaoCaoDangKyItem[];
  tongSoLuot: number;
}

export interface GetBaoCaoDangKyRequest {
  tungay: string;
  denngay: string;
}

// API response structure
export interface BaoCaoDangKyApiResponse {
  cs1: BaoCaoDangKyItem[];
  cs2: BaoCaoDangKyItem[];
}

// Transformed response
export interface BaoCaoDangKyResponse {
  coSo1: BaoCaoDangKyCoSo | null;
  coSo2: BaoCaoDangKyCoSo | null;
}
