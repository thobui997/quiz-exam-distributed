import { UserRoleEnumType } from '../enums';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: UserRoleEnumType;
  maCS: string;
}

export interface LoginResponse {
  code: string;
  status: string;
  message: string;
  username: string;
  userRole: UserRoleEnumType;
  dateLogin: string;
  lastLogin: string;
  ho: string;
  ten: string;
  ngaySinh: string;
  diaChi: string;
  maLop: string;
  tenLop: string;
  maKh: string;
  tenKh: string;
  maCS: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
}
