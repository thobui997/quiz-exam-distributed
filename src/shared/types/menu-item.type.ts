import { UserRoleEnumType } from '@app/shared/enums';
import { ReactNode } from 'react';

interface MenuItem {
  code: string;
  label: string;
  path: string;
  icon?: ReactNode;
  children?: MenuItem[];
  roles?: UserRoleEnumType[];
}

export type MenuChild = Omit<MenuItem, 'children'>;
export type MenuList = MenuItem[];
