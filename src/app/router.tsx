import BoDeRoute from '@app/app/pages/bo-de-route';
import GiaoVienDangKyRoute from '@app/app/pages/giao-vien-dang-ky-route';
import GiaoVienRoute from '@app/app/pages/giao-vien-route';
import KhoaLopRoute from '@app/app/pages/khoa-lop-route';
import LoginRoute from '@app/app/pages/login-route';
import MonHocRoute from '@app/app/pages/mon-hoc-route';
import RegisterRoute from '@app/app/pages/register-route';
import SinhVienRoute from '@app/app/pages/sinh-vien-route';
import { paths } from '@app/config/paths';
import { useAuth } from '@app/context/auth-context';
import AppLayout from '@app/shared/layouts/app-layout';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';

const ProtectedRoute = () => {
  const { userInfo } = useAuth();
  const location = useLocation();

  if (!userInfo) return <Navigate to={paths.auth.login.getHref(location.pathname)} replace />;
  return <Outlet />;
};

const DashboardNavigate = () => {
  return <Navigate to={paths.app.monHoc.path} replace />;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={paths.auth.login.path} element={<LoginRoute />} />
      <Route path={paths.auth.register.path} element={<RegisterRoute />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardNavigate />} />
          <Route path={paths.app.monHoc.path} element={<MonHocRoute />} />
          <Route path={paths.app.khoaLop.path} element={<KhoaLopRoute />} />
          <Route path={paths.app.sinhVien.path} element={<SinhVienRoute />} />
          <Route path={paths.app.giaoVien.path} element={<GiaoVienRoute />} />
          <Route path={paths.app.boDe.path} element={<BoDeRoute />} />
          <Route path={paths.app.giaoVienDangKy.path} element={<GiaoVienDangKyRoute />} />
        </Route>
      </Route>
    </Routes>
  );
};
