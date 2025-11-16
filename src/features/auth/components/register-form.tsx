import { useNotification } from '@app/context/notification-context';
import { registerApi } from '@app/shared/api';
import { UserRoleEnum } from '@app/shared/enums';
import { RegisterRequest } from '@app/shared/types/auth.type';
import { Button, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const RegisterForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload: RegisterRequest = {
        username: values.username,
        password: values.password,
        role: values.role,
        maCS: values.maCS
      };

      const response = await registerApi(payload);

      if (response.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', response.message);
        form.resetFields();
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        notification.showNotification('error', 'Đăng ký thất bại', response.message);
      }
    } catch (err: any) {
      if (err?.response?.data?.message) {
        notification.showNotification('error', 'Đăng ký thất bại', err.response.data.message);
      } else {
        notification.showNotification('error', 'Đăng ký thất bại', 'Có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center w-full h-full bg-gray-100'>
      <div className='shadow-lg bg-white rounded-lg border border-gray-300 !p-6 min-w-[500px]'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Đăng ký tài khoản</h2>
        <Form form={form} layout='vertical' onFinish={handleRegister} size='large'>
          <Form.Item
            label='Tên đăng nhập'
            name='username'
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
              { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' },
              { max: 50, message: 'Tên đăng nhập không quá 50 ký tự!' }
            ]}
          >
            <Input className='w-full' placeholder='Nhập tên đăng nhập' />
          </Form.Item>

          <Form.Item
            label='Mật khẩu'
            name='password'
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              { max: 30, message: 'Mật khẩu không quá 30 ký tự!' }
            ]}
          >
            <Input.Password className='w-full' placeholder='Nhập mật khẩu' />
          </Form.Item>

          <Form.Item
            label='Xác nhận mật khẩu'
            name='confirmPassword'
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                }
              })
            ]}
          >
            <Input.Password className='w-full' placeholder='Nhập lại mật khẩu' />
          </Form.Item>

          <Form.Item label='Vai trò' name='role' rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
            <Select className='w-full' placeholder='Chọn vai trò'>
              <Select.Option value={UserRoleEnum.TRUONG}>Trường</Select.Option>
              <Select.Option value={UserRoleEnum.COSO}>Cơ sở</Select.Option>
              <Select.Option value={UserRoleEnum.GIAOVIEN}>Giảng viên</Select.Option>
              <Select.Option value={UserRoleEnum.SINHVIEN}>Sinh viên</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label='Cơ sở' name='maCS' rules={[{ required: true, message: 'Vui lòng chọn cơ sở!' }]}>
            <Select className='w-full' placeholder='Chọn cơ sở'>
              <Select.Option value='CS1'>Cơ sở 1</Select.Option>
              <Select.Option value='CS2'>Cơ sở 2</Select.Option>
            </Select>
          </Form.Item>
        </Form>

        <Button type='primary' className='w-full !mt-4' size='large' loading={loading} onClick={handleRegister}>
          Đăng ký
        </Button>

        <div className='text-center !mt-4'>
          <span className='text-gray-600'>Đã có tài khoản? </span>
          <a onClick={() => navigate('/login')} className='text-blue-600 hover:text-blue-700 cursor-pointer'>
            Đăng nhập ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
