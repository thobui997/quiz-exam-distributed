import menuList from '@app/config/menu';
import { useAuth } from '@app/context/auth-context';
import { Affix, Avatar, Dropdown, Layout, Space, theme } from 'antd';
import { LogOut, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import './app-layout.scss';
import MenuComponent from './menu';
import { UserOutlined } from '@ant-design/icons';

const { Content, Header, Sider } = Layout;

const AppLayout = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const location = useLocation();
  const { userInfo, logoutAction } = useAuth();

  const [openKey, setOpenkey] = useState<string>('');
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);

  if (location.pathname !== selectedKey) {
    setSelectedKey(location.pathname);
  }

  const filteredMenuList = useMemo(() => {
    if (!userInfo?.userRole) return [];

    return menuList
      .filter((item) => {
        if (!item.roles || item.roles.length === 0) return true;
        return item.roles.includes(userInfo.userRole);
      })
      .map((item) => ({
        ...item,
        children: item.children?.filter((child) => {
          if (!child.roles || child.roles.length === 0) return true;
          return child.roles.includes(userInfo.userRole);
        })
      }));
  }, [userInfo?.userRole]);

  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <div className='flex items-center gap-2'>
          <User size={16} />
          <span>Thông tin cá nhân</span>
        </div>
      )
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      label: (
        <div className='flex items-center gap-2'>
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </div>
      ),
      onClick: logoutAction
    }
  ];

  return (
    <Layout className='layout-page'>
      <Affix offsetTop={0}>
        <Sider
          className='layout-page-sider'
          style={{ background: colorBgContainer, height: '100vh' }}
          trigger={null}
          collapsible
          width={250}
        >
          <div className='logo-container'>
            <div className='logo-vertical'>
              <div className='logo-image'>
                <span className='text-white font-bold'>QE</span>
              </div>
              <div className='logo-text'>Quiz Exam</div>
            </div>
          </div>
          <MenuComponent
            menuList={filteredMenuList}
            openKey={openKey}
            onChangeOpenKey={(k) => setOpenkey(k || '')}
            selectedKey={selectedKey}
            onChangeSelectedKey={(k) => setSelectedKey(k)}
          />
        </Sider>
      </Affix>

      <Layout>
        <Header style={{ background: colorBgContainer, padding: '0 24px' }} className='layout-page-header'>
          <div></div>
          <div className='layout-page-header-actions'>
            <Dropdown menu={{ items: userMenuItems }} placement='bottomRight'>
              <Space className='cursor-pointer'>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <div className='flex flex-col items-start'>
                  <p className='font-medium'>
                    {userInfo?.ho} {userInfo?.ten} -
                    <span className='text-xs text-gray-500'>
                      (
                      {userInfo?.userRole === 'TRUONG'
                        ? 'Trường'
                        : userInfo?.userRole === 'COSO'
                          ? 'Cơ sở'
                          : userInfo?.userRole === 'GIAOVIEN'
                            ? 'Giảng viên'
                            : 'Sinh viên'}
                      )
                    </span>
                  </p>
                </div>
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content className='!m-6 overflow-y-auto h-[calc(100dvh_-_32px_-_64px)]'>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
