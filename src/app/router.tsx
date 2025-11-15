import KhoaRoute from '@app/app/pages/khoa-route';
import LoginRoute from '@app/app/pages/login-route';
import MonHocRoute from '@app/app/pages/mon-hoc-route';
import RegisterRoute from '@app/app/pages/register-route';
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
          <Route path={paths.app.khoa.path} element={<KhoaRoute />} />
        </Route>
      </Route>
    </Routes>
  );
};
