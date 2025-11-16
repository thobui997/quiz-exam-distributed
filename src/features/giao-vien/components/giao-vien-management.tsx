import { useNotification } from '@app/context/notification-context';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import {
  useGiaoVienList,
  useCreateGiaoVien,
  useUpdateGiaoVien,
  useDeleteGiaoVien
} from '@app/features/giao-vien/hooks';
import { useKhoaList } from '@app/features/khoa-lop/hooks/get-khoa-list';
import { GiaoVien } from '@app/shared/types/giao-vien.type';

const GiaoVienManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGiaoVien, setEditingGiaoVien] = useState<GiaoVien | null>(null);
  const [selectedCS, setSelectedCS] = useState<string>('CS1');
  const [form] = Form.useForm();
  const notification = useNotification();

  const { data: khoaList, isLoading: isLoadingKhoa } = useKhoaList(selectedCS);
  const { data: giaoVienList, isLoading: isLoadingGiaoVien, refetch } = useGiaoVienList(selectedCS);

  const createGiaoVienMutation = useCreateGiaoVien({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Tạo giáo viên thành công!');
        setIsModalOpen(false);
        form.resetFields();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const updateGiaoVienMutation = useUpdateGiaoVien({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Cập nhật giáo viên thành công!');
        setIsModalOpen(false);
        setEditingGiaoVien(null);
        form.resetFields();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const deleteGiaoVienMutation = useDeleteGiaoVien({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Xóa giáo viên thành công!');
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const handleCreate = () => {
    form.validateFields().then((values) => {
      if (editingGiaoVien) {
        updateGiaoVienMutation.mutate({
          maCS: selectedCS,
          data: {
            magv: editingGiaoVien.magv,
            ho: values.ho,
            ten: values.ten,
            diachi: values.diachi || '',
            makh: values.makh
          }
        });
      } else {
        createGiaoVienMutation.mutate({
          maCS: selectedCS,
          data: {
            magv: values.magv,
            ho: values.ho,
            ten: values.ten,
            diachi: values.diachi || '',
            makh: values.makh
          }
        });
      }
    });
  };

  const handleEdit = (record: GiaoVien) => {
    setEditingGiaoVien(record);
    form.setFieldsValue({
      magv: record.magv,
      ho: record.ho,
      ten: record.ten,
      diachi: record.diachi,
      makh: record.makh
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record: GiaoVien) => {
    deleteGiaoVienMutation.mutate({
      maCS: selectedCS,
      giaoVien: record
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGiaoVien(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Mã GV',
      dataIndex: 'magv',
      key: 'magv',
      width: 100
    },
    {
      title: 'Họ',
      dataIndex: 'ho',
      key: 'ho',
      width: 150
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      key: 'ten',
      width: 100
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diachi',
      key: 'diachi'
    },
    {
      title: 'Mã khoa',
      dataIndex: 'makh',
      key: 'makh',
      width: 120
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: GiaoVien) => (
        <Space size='middle'>
          <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} className='!p-0'>
            Sửa
          </Button>
          <Popconfirm
            title='Xác nhận xóa'
            description='Bạn có chắc chắn muốn xóa giáo viên này?'
            onConfirm={() => handleDelete(record)}
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
      <h2 className='text-2xl font-semibold !mb-6'>Quản lý Giáo viên</h2>

      <div className='!mb-4 flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Select
            value={selectedCS}
            onChange={setSelectedCS}
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
            Thêm giáo viên
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={giaoVienList}
        loading={isLoadingGiaoVien || deleteGiaoVienMutation.isPending}
        rowKey='magv'
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} giáo viên`
        }}
      />

      <Modal
        title={editingGiaoVien ? 'Cập nhật giáo viên' : 'Thêm giáo viên'}
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={handleCloseModal}
        confirmLoading={createGiaoVienMutation.isPending || updateGiaoVienMutation.isPending}
        okText={editingGiaoVien ? 'Cập nhật' : 'Thêm'}
        cancelText='Hủy'
        width={600}
      >
        <Form form={form} layout='vertical' className='!mt-4'>
          <Form.Item
            label='Mã giáo viên'
            name='magv'
            rules={[
              { required: true, message: 'Vui lòng nhập mã giáo viên!' },
              { max: 8, message: 'Mã giáo viên không quá 8 ký tự!' }
            ]}
          >
            <Input placeholder='Nhập mã giáo viên' disabled={!!editingGiaoVien} />
          </Form.Item>

          <Form.Item
            label='Họ'
            name='ho'
            rules={[
              { required: true, message: 'Vui lòng nhập họ!' },
              { max: 40, message: 'Họ không quá 40 ký tự!' }
            ]}
          >
            <Input placeholder='Nhập họ' />
          </Form.Item>

          <Form.Item
            label='Tên'
            name='ten'
            rules={[
              { required: true, message: 'Vui lòng nhập tên!' },
              { max: 10, message: 'Tên không quá 10 ký tự!' }
            ]}
          >
            <Input placeholder='Nhập tên' />
          </Form.Item>

          <Form.Item label='Địa chỉ' name='diachi'>
            <Input placeholder='Nhập địa chỉ' />
          </Form.Item>

          <Form.Item label='Khoa' name='makh' rules={[{ required: true, message: 'Vui lòng chọn khoa!' }]}>
            <Select
              placeholder='Chọn khoa'
              loading={isLoadingKhoa}
              disabled={!khoaList || khoaList.length === 0}
              options={khoaList?.map((khoa) => ({
                label: `${khoa.makh} - ${khoa.tenkh}`,
                value: khoa.makh
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GiaoVienManagement;
