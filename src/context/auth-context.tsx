import { useNotification } from '@app/context/notification-context';
import useLocalStorage from '@app/hooks/use-local-storage';
import { loginApi } from '@app/shared/api';
import { LoginResponse } from '@app/shared/types/auth.type';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';

interface AuthContextType {
  userInfo: LoginResponse | null;
  loginAction: (payload: { username: string; password: string }) => Promise<void>;
  logoutAction: () => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [initialUserInfo, setStoredUserInfo] = useLocalStorage<LoginResponse | null>('userInfo', null);
  const [userInfo, setUserInfo] = useState<LoginResponse | null>(initialUserInfo);
  const notification = useNotification();

  const loginAction = async (payload: { username: string; password: string }) => {
    try {
      const response = await loginApi(payload);

      if (response.status === 'SUCCESS') {
        setStoredUserInfo(response);
        setUserInfo(response);
        notification.showNotification('success', 'Thành công', response.message);
        navigate('/', { replace: true });
      } else {
        notification.showNotification('error', 'Đăng nhập thất bại', response.message);
      }
    } catch (err: any) {
      notification.showNotification('error', 'Đăng nhập thất bại', err?.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const logoutAction = () => {
    setStoredUserInfo(null);
    setUserInfo(null);
    localStorage.removeItem('userInfo');
    navigate('/login', { replace: true });
  };

  return <AuthContext.Provider value={{ userInfo, loginAction, logoutAction }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
