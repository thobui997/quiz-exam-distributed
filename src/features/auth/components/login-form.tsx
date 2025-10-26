import { useAuth } from '@app/context/auth-context';
import { Button, Form, Input, Select } from 'antd';

const LoginForm = () => {
  const [form] = Form.useForm();
  const auth = useAuth();

  const handleLogin = () => {
    form.validateFields().then((values) => {
      auth.loginAction({ email: values.username, password: values.password });
    });
  };

  return (
    <div className='flex justify-center items-center w-full h-full bg-gray-100'>
      <div className='shadow-lg bg-white rounded-lg border border-gray-300 !p-6 min-w-[500px]'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Đăng nhập</h2>
        <Form form={form} layout='vertical' onFinish={handleLogin} size='large'>
          <Form.Item label='Cơ sở' name='username'>
            <Select className='w-full' placeholder='Chọn cơ sở'>
              <Select.Option value='1'>Cơ sở 1</Select.Option>
              <Select.Option value='2'>Cơ sở 2</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label='Tên dăng nhập'
            name='username'
            rules={[{ required: true, message: 'Vui lòng nhập tên nhập!' }]}
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
      </div>
    </div>
  );
};

export default LoginForm;
