import { paths } from '@app/config/paths';
import { MenuList } from '@app/shared/types';
import { LayoutDashboard } from 'lucide-react';
import React from 'react';

const menuList: MenuList = [
  {
    code: paths.app.lectureManagement.path,
    label: 'Quản lý môn học',
    path: paths.app.lectureManagement.path,
    icon: React.createElement(LayoutDashboard, { size: 20 })
  }
];

export default menuList;
