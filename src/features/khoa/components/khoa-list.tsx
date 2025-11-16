import { useAuth } from '@app/context/auth-context';
import { useNotification } from '@app/context/notification-context';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useKhoaList } from '@app/features/khoa/hooks/get-khoa-list';
import { Khoa } from '@app/shared/types/khoa.type';

const KhoaList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKhoa, setEditingKhoa] = useState<Khoa | null>(null);
  const [selectedCS, setSelectedCS] = useState<string>('CS1');
  const [form] = Form.useForm();
  const notification = useNotification();
  const { userInfo } = useAuth();

  const { data: khoaList, isLoading, refetch } = useKhoaList(selectedCS);

  // const createKhoaMutation = useCreateKhoa({
  //   onSuccess: (data) => {
  //     if (data.status === 'SUCCESS') {
  //       notification.showNotification('success', 'Thành công', data.message);
  //       setIsModalOpen(false);
  //       form.resetFields();
  //     } else {
  //       notification.showNotification('error', 'Thất bại', data.message);
  //     }
  //   },
  //   onError: (error: any) => {
  //     notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
  //   }
  // });

  // const updateKhoaMutation = useUpdateKhoa({
  //   onSuccess: (data) => {
  //     if (data.status === 'SUCCESS') {
  //       notification.showNotification('success', 'Thành công', data.message);
  //       setIsModalOpen(false);
  //       setEditingKhoa(null);
  //       form.resetFields();
  //     } else {
  //       notification.showNotification('error', 'Thất bại', data.message);
  //     }
  //   },
  //   onError: (error: any) => {
  //     notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
  //   }
  // });

  // const deleteKhoaMutation = useDeleteKhoa({
  //   onSuccess: (data) => {
  //     if (data.status === 'SUCCESS') {
  //       notification.showNotification('success', 'Thành công', data.message);
  //     } else {
  //       notification.showNotification('error', 'Thất bại', data.message);
  //     }
  //   },
  //   onError: (error: any) => {
  //     notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
  //   }
  // });

  // const handleCreate = () => {
  //   form.validateFields().then((values) => {
  //     if (editingKhoa) {
  //       updateKhoaMutation.mutate({
  //         makh: editingKhoa.makh,
  //         tenkh: values.tenkh,
  //         macs: selectedCS
  //       });
  //     } else {
  //       createKhoaMutation.mutate({
  //         makh: values.makh,
  //         tenkh: values.tenkh,
  //         macs: selectedCS
  //       });
  //     }
  //   });
  // };

  // const handleEdit = (record: Khoa) => {
  //   setEditingKhoa(record);
  //   form.setFieldsValue({
  //     makh: record.makh,
  //     tenkh: record.tenkh
  //   });
  //   setIsModalOpen(true);
  // };

  // const handleDelete = (record: Khoa) => {
  //   deleteKhoaMutation.mutate({
  //     maCS: record.macs,
  //     maKH: record.makh
  //   });
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKhoa(null);
    form.resetFields();
  };

  const handleCSChange = (value: string) => {
    setSelectedCS(value);
  };

  const columns = [
    {
      title: 'Mã khoa',
      dataIndex: 'makh',
      key: 'makh',
      width: 150
    },
    {
      title: 'Tên khoa',
      dataIndex: 'tenkh',
      key: 'tenkh'
    },
    {
      title: 'Cơ sở',
      dataIndex: 'macs',
      key: 'macs',
      width: 100
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: Khoa) => (
        <Space size='middle'>
          <Button type='link' icon={<EditOutlined />}>
            Sửa
          </Button>
          <Popconfirm
            title='Xác nhận xóa'
            description='Bạn có chắc chắn muốn xóa khoa này?'
            okText='Xóa'
            cancelText='Hủy'
            okButtonProps={{ danger: true }}
          >
            <Button type='link' danger icon={<DeleteOutlined />} className='!p-0'>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className='!p-6'>
      <div className='!mb-4 flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <h2 className='text-2xl font-semibold'>Quản lý khoa</h2>
          <Select
            value={selectedCS}
            onChange={handleCSChange}
            style={{ width: 150 }}
            options={[
              { label: 'Cơ sở 1', value: 'CS1' },
              { label: 'Cơ sở 2', value: 'CS2' }
            ]}
          />
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Tải lại
          </Button>
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Thêm khoa
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={khoaList}
        loading={isLoading}
        rowKey='makh'
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} khoa`
        }}
      />

      <Modal
        title={editingKhoa ? 'Cập nhật khoa' : 'Thêm khoa'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        okText={editingKhoa ? 'Cập nhật' : 'Thêm'}
        cancelText='Hủy'
      >
        <Form form={form} layout='vertical' className='!mt-4'>
          <Form.Item
            label='Mã khoa'
            name='makh'
            rules={[
              { required: true, message: 'Vui lòng nhập mã khoa!' },
              { max: 8, message: 'Mã khoa không quá 8 ký tự!' }
            ]}
          >
            <Input placeholder='Nhập mã khoa' disabled={!!editingKhoa} />
          </Form.Item>

          <Form.Item
            label='Tên khoa'
            name='tenkh'
            rules={[
              { required: true, message: 'Vui lòng nhập tên khoa!' },
              { max: 50, message: 'Tên khoa không quá 50 ký tự!' }
            ]}
          >
            <Input placeholder='Nhập tên khoa' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KhoaList;
