import { useAuth } from '@app/context/auth-context';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router';

const LoginForm = () => {
  const [form] = Form.useForm();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    form.validateFields().then((values) => {
      auth.loginAction({ username: values.username, password: values.password });
    });
  };

  return (
    <div className='flex justify-center items-center w-full h-full bg-gray-100'>
      <div className='shadow-lg bg-white rounded-lg border border-gray-300 !p-6 min-w-[500px]'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Đăng nhập</h2>
        <Form form={form} layout='vertical' onFinish={handleLogin} size='large'>
          <Form.Item
            label='Tên đăng nhập'
            name='username'
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input className='w-full' placeholder='Nhập tên đăng nhập' />
          </Form.Item>

          <Form.Item label='Mật khẩu' name='password' rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password className='w-full' placeholder='Nhập mật khẩu' />
          </Form.Item>
        </Form>

        <Button type='primary' className='w-full !mt-4' size='large' onClick={handleLogin}>
          Đăng nhập
        </Button>

        <div className='text-center mt-4'>
          <span className='text-gray-600'>Chưa có tài khoản? </span>
          <a onClick={() => navigate('/register')} className='text-blue-600 hover:text-blue-700 cursor-pointer'>
            Đăng ký ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
