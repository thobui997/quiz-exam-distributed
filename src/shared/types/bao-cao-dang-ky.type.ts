export interface BaoCaoDangKyItem {
  stt: number;
  tenlop: string;
  tenmh: string;
  tenGiangVien: string;
  socauthi: number;
  ngaythi: string;
  dathi: boolean;
  ghichu: string;
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

export interface BaoCaoDangKyResponse {
  coSo1: BaoCaoDangKyCoSo;
  coSo2: BaoCaoDangKyCoSo;
}
