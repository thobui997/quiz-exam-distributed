import { paths } from '@app/config/paths';
import { MenuList } from '@app/shared/types';
import { BookOpen, Building2 } from 'lucide-react';
import React from 'react';

const menuList: MenuList = [
  {
    code: paths.app.monHoc.path,
    label: 'Quản lý môn học',
    path: paths.app.monHoc.path,
    icon: React.createElement(BookOpen, { size: 20 })
  },
  {
    code: paths.app.khoa.path,
    label: 'Quản lý khoa',
    path: paths.app.khoa.path,
    icon: React.createElement(Building2, { size: 20 })
  }
];

export default menuList;
