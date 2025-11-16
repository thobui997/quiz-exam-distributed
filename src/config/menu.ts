import { paths } from '@app/config/paths';
import { MenuList } from '@app/shared/types';
import { BookOpen, FolderTree, GraduationCap, UserCheck, ClipboardList, FileQuestion } from 'lucide-react';
import React from 'react';

const menuList: MenuList = [
  {
    code: paths.app.monHoc.path,
    label: 'Quản lý môn học',
    path: paths.app.monHoc.path,
    icon: React.createElement(BookOpen, { size: 20 })
  },
  {
    code: paths.app.khoaLop.path,
    label: 'Quản lý Khoa - Lớp',
    path: paths.app.khoaLop.path,
    icon: React.createElement(FolderTree, { size: 20 })
  },
  {
    code: paths.app.sinhVien.path,
    label: 'Quản lý Sinh viên',
    path: paths.app.sinhVien.path,
    icon: React.createElement(GraduationCap, { size: 20 })
  },
  {
    code: paths.app.giaoVien.path,
    label: 'Quản lý Giáo viên',
    path: paths.app.giaoVien.path,
    icon: React.createElement(UserCheck, { size: 20 })
  },
  {
    code: paths.app.boDe.path,
    label: 'Quản lý Bộ đề',
    path: paths.app.boDe.path,
    icon: React.createElement(FileQuestion, { size: 20 })
  },
  {
    code: paths.app.giaoVienDangKy.path,
    label: 'Chuẩn bị thi',
    path: paths.app.giaoVienDangKy.path,
    icon: React.createElement(ClipboardList, { size: 20 })
  }
];

export default menuList;
