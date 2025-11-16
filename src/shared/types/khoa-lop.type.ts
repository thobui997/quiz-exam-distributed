import { Khoa } from '@app/shared/types/khoa.type';
import { Lop } from '@app/shared/types/lop.type';

export interface KhoaLopRequest {
  macs: string;
  listKhoa: Khoa[];
  listLop: Lop[];
}

export interface KhoaLopResponse {
  status: string;
  message: string;
}
