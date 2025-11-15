export const UserRoleEnum = {
  TRUONG: 'TRUONG',
  COSO: 'COSO',
  GIAOVIEN: 'GIAOVIEN',
  SINHVIEN: 'SINHVIEN'
} as const;

export type UserRoleEnumType = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];
