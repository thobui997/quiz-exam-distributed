import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNotification } from '@app/context/notification-context';
import { useKhoaList } from '@app/features/khoa-lop/hooks/get-khoa-list';
import { useLopList } from '@app/features/khoa-lop/hooks/get-lop-list';
import {
  useCreateSinhVien,
  useDeleteSinhVien,
  useSinhVienList,
  useUpdateSinhVien
} from '@app/features/sinh-vien/hooks';
import { SinhVien } from '@app/shared/types/sinh-vien.type';
import { Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Space, Table, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const SinhVienManagement = () => {
  const [_, setActiveTab] = useState('view');
  const notification = useNotification();

  // ==================== STATE ====================
  const [selectedCS, setSelectedCS] = useState<string>('CS1');
  const [selectedKhoa, setSelectedKhoa] = useState<string>('');
  const [selectedLop, setSelectedLop] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSinhVien, setEditingSinhVien] = useState<SinhVien | null>(null);
  const [form] = Form.useForm();

  // ==================== DATA FETCHING ====================
  const { data: khoaList, isLoading: isLoadingKhoa } = useKhoaList(selectedCS);
  const { data: lopList, isLoading: isLoadingLop } = useLopList(selectedKhoa);
  const { data: sinhVienList, isLoading: isLoadingSinhVien, refetch: refetchSinhVien } = useSinhVienList(selectedLop);

  useEffect(() => {
    if (editingSinhVien) {
      form.setFieldsValue({
        masv: editingSinhVien.masv,
        ho: editingSinhVien.ho,
        ten: editingSinhVien.ten,
        ngaysinh: editingSinhVien.ngaysinh ? dayjs(editingSinhVien.ngaysinh) : null,
        diachi: editingSinhVien.diachi,
        malop: editingSinhVien.malop
      });
    }
  }, [editingSinhVien, form]);

  const createSinhVienMutation = useCreateSinhVien({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Tạo sinh viên thành công!');
        handleCloseModal();
        refetchSinhVien();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const updateSinhVienMutation = useUpdateSinhVien({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Cập nhật sinh viên thành công!');
        handleCloseModal();
        refetchSinhVien();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const deleteSinhVienMutation = useDeleteSinhVien({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Xóa sinh viên thành công!');
        refetchSinhVien();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  // ==================== HANDLERS ====================
  const handleCSChange = (value: string) => {
    setSelectedCS(value);
    setSelectedKhoa('');
    setSelectedLop('');
  };

  const handleKhoaChange = (value: string) => {
    setSelectedKhoa(value);
    setSelectedLop('');
  };

  const handleLopChange = (value: string) => {
    setSelectedLop(value);
  };

  const handleOpenCreateModal = () => {
    if (!selectedLop) {
      notification.showNotification('warning', 'Cảnh báo', 'Vui lòng chọn lớp để thêm sinh viên!');
      return;
    }
    setEditingSinhVien(null);
    form.resetFields();
    form.setFieldValue('malop', selectedLop);
    setIsModalOpen(true);
  };

  const handleEdit = (record: SinhVien) => {
    setEditingSinhVien(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record: SinhVien) => {
    deleteSinhVienMutation.mutate({
      maCS: selectedCS,
      sinhVien: record
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSinhVien(null);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payloadData: SinhVien = {
        masv: values.masv,
        ho: values.ho,
        ten: values.ten,
        ngaysinh: values.ngaysinh ? dayjs(values.ngaysinh).format('YYYY-MM-DD') : '',
        diachi: values.diachi || '',
        malop: selectedLop
      };

      if (editingSinhVien) {
        updateSinhVienMutation.mutate({
          maCS: selectedCS,
          data: payloadData
        });
      } else {
        createSinhVienMutation.mutate({
          maCS: selectedCS,
          data: payloadData
        });
      }
    });
  };

  // ==================== COLUMNS ====================
  const columns = [
    {
      title: 'MSSV',
      dataIndex: 'masv',
      key: 'masv',
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
      title: 'Ngày sinh',
      dataIndex: 'ngaysinh',
      key: 'ngaysinh',
      width: 120,
      render: (date: string) => (date ? dayjs(date).format('DD/MM/YYYY') : '')
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diachi',
      key: 'diachi'
    },
    {
      title: 'Mã lớp',
      dataIndex: 'malop',
      key: 'malop',
      width: 120
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: SinhVien) => (
        <Space size='middle'>
          <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} className='!p-0'>
            Sửa
          </Button>
          <Popconfirm
            title='Xác nhận xóa'
            description='Bạn có chắc chắn muốn xóa sinh viên này?'
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

  // ==================== RENDER ====================
  return (
    <div className='!p-6'>
      <h2 className='text-2xl font-semibold !mb-6'>Quản lý Sinh viên</h2>

      <Tabs activeKey='view' onChange={setActiveTab}>
        <Tabs.TabPane tab='Xem danh sách' key='view'>
          <div className='!mb-4 flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <Select
                value={selectedCS}
                onChange={handleCSChange}
                style={{ width: 150 }}
                options={[
                  { label: 'Cơ sở 1', value: 'CS1' },
                  { label: 'Cơ sở 2', value: 'CS2' }
                ]}
              />
              <Select
                value={selectedKhoa}
                onChange={handleKhoaChange}
                placeholder='Chọn khoa'
                style={{ width: 250 }}
                loading={isLoadingKhoa}
                disabled={!khoaList || khoaList.length === 0}
                options={khoaList?.map((khoa) => ({
                  label: `${khoa.makh} - ${khoa.tenkh}`,
                  value: khoa.makh
                }))}
              />
              <Select
                value={selectedLop}
                onChange={handleLopChange}
                placeholder='Chọn lớp'
                style={{ width: 250 }}
                loading={isLoadingLop}
                disabled={!lopList || lopList.length === 0}
                options={lopList?.map((lop) => ({
                  label: `${lop.malop} - ${lop.tenlop}`,
                  value: lop.malop
                }))}
              />
            </div>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => refetchSinhVien()} disabled={!selectedLop}>
                Tải lại
              </Button>
              <Button type='primary' icon={<PlusOutlined />} onClick={handleOpenCreateModal} disabled={!selectedLop}>
                Thêm sinh viên
              </Button>
            </Space>
          </div>

          {!selectedLop ? (
            <div className='text-center py-12 text-gray-500'>
              <p className='text-lg'>Vui lòng chọn lớp để xem danh sách sinh viên</p>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={sinhVienList}
              loading={isLoadingSinhVien || deleteSinhVienMutation.isPending}
              rowKey='masv'
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng ${total} sinh viên`
              }}
            />
          )}
        </Tabs.TabPane>
      </Tabs>

      {/* Modal Thêm/Sửa Sinh viên */}
      <Modal
        title={editingSinhVien ? 'Cập nhật sinh viên' : 'Thêm sinh viên'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        confirmLoading={createSinhVienMutation.isPending || updateSinhVienMutation.isPending}
        okText={editingSinhVien ? 'Cập nhật' : 'Thêm'}
        cancelText='Hủy'
        width={600}
      >
        <Form form={form} layout='vertical' className='!mt-4'>
          <Form.Item
            label='Mã sinh viên'
            name='masv'
            rules={[
              { required: true, message: 'Vui lòng nhập MSSV!' },
              { max: 8, message: 'MSSV không quá 8 ký tự!' }
            ]}
          >
            <Input placeholder='Nhập MSSV' disabled={!!editingSinhVien} />
          </Form.Item>
          <Form.Item label='Mã lớp' name='malop' hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label='Họ'
            name='ho'
            rules={[
              { required: true, message: 'Vui lòng nhập họ!' },
              { max: 50, message: 'Họ không quá 50 ký tự!' }
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

          <Form.Item
            label='Ngày sinh'
            name='ngaysinh'
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker placeholder='Chọn ngày sinh' format='DD/MM/YYYY' style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label='Địa chỉ' name='diachi'>
            <Input placeholder='Nhập địa chỉ' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SinhVienManagement;
