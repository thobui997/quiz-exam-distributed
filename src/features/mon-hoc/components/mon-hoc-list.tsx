import { useNotification } from '@app/context/notification-context';
import { Button, Form, Input, Modal, Space, Table } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useMonHocList } from '@app/features/mon-hoc/api/get-mon-hoc-list';
import { useCreateMonHoc } from '@app/features/mon-hoc/api/create-mon-hoc';

const MonHocList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const notification = useNotification();

  const { data: monHocList, isLoading, refetch } = useMonHocList();
  const createMonHocMutation = useCreateMonHoc({
    onSuccess: (data) => {
      notification.showNotification('success', 'Thành công', data.message);
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const handleCreate = () => {
    form.validateFields().then((values) => {
      createMonHocMutation.mutate([
        {
          mamh: values.mamh,
          tenmh: values.tenmh
        }
      ]);
    });
  };

  const columns = [
    {
      title: 'Mã môn học',
      dataIndex: 'mamh',
      key: 'mamh',
      width: 150
    },
    {
      title: 'Tên môn học',
      dataIndex: 'tenmh',
      key: 'tenmh'
    }
  ];

  return (
    <div className='!p-6'>
      <div className='!mb-4 flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Quản lý môn học</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Tải lại
          </Button>
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Thêm môn học
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={monHocList}
        loading={isLoading}
        rowKey='mamh'
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} môn học`
        }}
      />

      <Modal
        title='Thêm môn học'
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        confirmLoading={createMonHocMutation.isPending}
        okText='Thêm'
        cancelText='Hủy'
      >
        <Form form={form} layout='vertical' className='!mt-4'>
          <Form.Item
            label='Mã môn học'
            name='mamh'
            rules={[
              { required: true, message: 'Vui lòng nhập mã môn học!' },
              { max: 5, message: 'Mã môn học không quá 5 ký tự!' }
            ]}
          >
            <Input placeholder='Nhập mã môn học' />
          </Form.Item>

          <Form.Item
            label='Tên môn học'
            name='tenmh'
            rules={[
              { required: true, message: 'Vui lòng nhập tên môn học!' },
              { max: 50, message: 'Tên môn học không quá 50 ký tự!' }
            ]}
          >
            <Input placeholder='Nhập tên môn học' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MonHocList;
