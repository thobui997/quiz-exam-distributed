import { useNotification } from '@app/context/notification-context';

import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  useCreateKhoa,
  useCreateLop,
  useDeleteKhoa,
  useDeleteLop,
  useUpdateKhoa,
  useUpdateLop
} from '@app/features/khoa-lop/hooks';
import { useKhoaList } from '@app/features/khoa-lop/hooks/get-khoa-list';
import { useLopList } from '@app/features/khoa-lop/hooks/get-lop-list';
import { Khoa } from '@app/shared/types/khoa.type';
import { Lop } from '@app/shared/types/lop.type';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tabs } from 'antd';
import { useState } from 'react';

const KhoaLopManagement = () => {
  const [activeTab, setActiveTab] = useState('khoa');
  const notification = useNotification();

  // ==================== KHOA TAB STATE & HOOKS ====================
  const [isKhoaModalOpen, setIsKhoaModalOpen] = useState(false);
  const [editingKhoa, setEditingKhoa] = useState<Khoa | null>(null);
  const [selectedCSKhoa, setSelectedCSKhoa] = useState<string>('CS1');
  const [khoaForm] = Form.useForm();

  const { data: khoaList, isLoading: isLoadingKhoa, refetch: refetchKhoa } = useKhoaList(selectedCSKhoa);

  // ==================== LOP TAB STATE & HOOKS ====================
  const [isLopModalOpen, setIsLopModalOpen] = useState(false);
  const [editingLop, setEditingLop] = useState<Lop | null>(null);
  const [selectedCSLop, setSelectedCSLop] = useState<string>('CS1');
  const [selectedKhoaLop, setSelectedKhoaLop] = useState<string>('');
  const [lopForm] = Form.useForm();

  const { data: khoaListForLop, isLoading: isLoadingKhoaForLop } = useKhoaList(selectedCSLop);
  const { data: lopList, isLoading: isLoadingLop, refetch: refetchLop } = useLopList(selectedKhoaLop);

  // ==================== SINGLE RECORD MUTATIONS ====================

  const createKhoaMutation = useCreateKhoa({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Tạo khoa thành công!');
        handleCloseKhoaModal();
        refetchKhoa();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const updateKhoaMutation = useUpdateKhoa({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Cập nhật khoa thành công!');
        handleCloseKhoaModal();
        refetchKhoa();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const deleteKhoaMutation = useDeleteKhoa({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Xóa khoa thành công!');
        refetchKhoa();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const createLopMutation = useCreateLop({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Tạo lớp thành công!');
        handleCloseLopModal();
        refetchLop();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const updateLopMutation = useUpdateLop({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Cập nhật lớp thành công!');
        handleCloseLopModal();
        refetchLop();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const deleteLopMutation = useDeleteLop({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Xóa lớp thành công!');
        refetchLop();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  // ==================== KHOA HANDLERS ====================

  const handleOpenCreateKhoaModal = () => {
    setEditingKhoa(null);
    khoaForm.resetFields();
    setIsKhoaModalOpen(true);
  };

  const handleEditKhoa = (record: Khoa) => {
    setEditingKhoa(record);
    khoaForm.setFieldsValue({
      makh: record.makh,
      tenkh: record.tenkh
    });
    setIsKhoaModalOpen(true);
  };

  const handleDeleteKhoa = (record: Khoa) => {
    deleteKhoaMutation.mutate({
      maCS: selectedCSKhoa,
      data: record
    });
  };

  const handleCloseKhoaModal = () => {
    setIsKhoaModalOpen(false);
    setEditingKhoa(null);
    khoaForm.resetFields();
  };

  const handleCreateOrUpdateKhoa = () => {
    khoaForm.validateFields().then((values) => {
      const payload: Khoa = {
        makh: values.makh,
        tenkh: values.tenkh,
        macs: selectedCSKhoa
      };

      if (editingKhoa) {
        updateKhoaMutation.mutate({
          maCS: selectedCSKhoa,
          data: payload
        });
      } else {
        createKhoaMutation.mutate({
          maCS: selectedCSKhoa,
          data: payload
        });
      }
    });
  };

  // ==================== LOP HANDLERS ====================

  const handleOpenCreateLopModal = () => {
    if (!selectedKhoaLop) {
      notification.showNotification('warning', 'Cảnh báo', 'Vui lòng chọn khoa để thêm lớp!');
      return;
    }
    setEditingLop(null);
    lopForm.resetFields();
    setIsLopModalOpen(true);
  };

  const handleEditLop = (record: Lop) => {
    setEditingLop(record);
    lopForm.setFieldsValue({
      malop: record.malop,
      tenlop: record.tenlop
    });
    setIsLopModalOpen(true);
  };

  const handleDeleteLop = (record: Lop) => {
    deleteLopMutation.mutate({
      maCS: selectedCSLop, // Lấy CS từ state Lớp đang xem
      data: record
    });
  };

  const handleCloseLopModal = () => {
    setIsLopModalOpen(false);
    setEditingLop(null);
    lopForm.resetFields();
  };

  const handleCSLopChange = (value: string) => {
    setSelectedCSLop(value);
    setSelectedKhoaLop('');
  };

  const handleCreateOrUpdateLop = () => {
    lopForm.validateFields().then((values) => {
      const payload: Lop = {
        malop: values.malop,
        tenlop: values.tenlop,
        makh: selectedKhoaLop
      };

      if (editingLop) {
        updateLopMutation.mutate({
          maCS: selectedCSLop,
          data: payload
        });
      } else {
        createLopMutation.mutate({
          maCS: selectedCSLop,
          data: payload
        });
      }
    });
  };

  // ==================== COLUMNS ====================
  const khoaColumns = [
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
          <Button type='link' icon={<EditOutlined />} onClick={() => handleEditKhoa(record)} className='!p-0'>
            Sửa
          </Button>
          <Popconfirm
            title='Xác nhận xóa'
            description='Bạn có chắc chắn muốn xóa khoa này?'
            onConfirm={() => handleDeleteKhoa(record)}
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

  const lopColumns = [
    {
      title: 'Mã lớp',
      dataIndex: 'malop',
      key: 'malop',
      width: 150
    },
    {
      title: 'Tên lớp',
      dataIndex: 'tenlop',
      key: 'tenlop'
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
      render: (_: any, record: Lop) => (
        <Space size='middle'>
          <Button type='link' icon={<EditOutlined />} onClick={() => handleEditLop(record)} className='!p-0'>
            Sửa
          </Button>
          <Popconfirm
            title='Xác nhận xóa'
            description='Bạn có chắc chắn muốn xóa lớp này?'
            onConfirm={() => handleDeleteLop(record)}
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
      <h2 className='text-2xl font-semibold !mb-6'>Quản lý Khoa - Lớp</h2>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* ==================== TAB KHOA ==================== */}
        <Tabs.TabPane tab='Quản lý Khoa' key='khoa'>
          <div className='!mb-4 flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <Select
                value={selectedCSKhoa}
                onChange={setSelectedCSKhoa}
                style={{ width: 150 }}
                options={[
                  { label: 'Cơ sở 1', value: 'CS1' },
                  { label: 'Cơ sở 2', value: 'CS2' }
                ]}
              />
            </div>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => refetchKhoa()}>
                Tải lại
              </Button>
              <Button type='primary' icon={<PlusOutlined />} onClick={handleOpenCreateKhoaModal}>
                Thêm khoa
              </Button>
            </Space>
          </div>

          <Table
            columns={khoaColumns}
            dataSource={khoaList}
            loading={isLoadingKhoa || deleteKhoaMutation.isPending}
            rowKey='makh'
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng ${total} khoa`
            }}
          />
        </Tabs.TabPane>

        {/* ==================== TAB LOP ==================== */}
        <Tabs.TabPane tab='Quản lý Lớp' key='lop'>
          <div className='!mb-4 flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <Select
                value={selectedCSLop}
                onChange={handleCSLopChange}
                style={{ width: 150 }}
                options={[
                  { label: 'Cơ sở 1', value: 'CS1' },
                  { label: 'Cơ sở 2', value: 'CS2' }
                ]}
              />
              <Select
                value={selectedKhoaLop}
                onChange={setSelectedKhoaLop}
                placeholder='Chọn khoa'
                style={{ width: 250 }}
                loading={isLoadingKhoaForLop}
                disabled={!khoaListForLop || khoaListForLop.length === 0}
                options={khoaListForLop?.map((khoa) => ({
                  label: `${khoa.makh} - ${khoa.tenkh}`,
                  value: khoa.makh
                }))}
              />
            </div>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => refetchLop()} disabled={!selectedKhoaLop}>
                Tải lại
              </Button>
              <Button type='primary' icon={<PlusOutlined />} onClick={handleOpenCreateLopModal}>
                Thêm lớp
              </Button>
            </Space>
          </div>

          {!selectedKhoaLop ? (
            <div className='text-center py-12 text-gray-500'>
              <p className='text-lg'>Vui lòng chọn khoa để xem danh sách lớp</p>
            </div>
          ) : (
            <Table
              columns={lopColumns}
              dataSource={lopList}
              loading={isLoadingLop || deleteLopMutation.isPending}
              rowKey='malop'
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng ${total} lớp`
              }}
            />
          )}
        </Tabs.TabPane>

        {/* ==================== TAB BATCH (ĐÃ BỊ LOẠI BỎ) ==================== */}
      </Tabs>

      {/* ==================== KHOA MODAL ==================== */}
      <Modal
        title={editingKhoa ? 'Cập nhật khoa' : 'Thêm khoa'}
        open={isKhoaModalOpen}
        onOk={handleCreateOrUpdateKhoa}
        onCancel={handleCloseKhoaModal}
        confirmLoading={createKhoaMutation.isPending || updateKhoaMutation.isPending}
        okText={editingKhoa ? 'Cập nhật' : 'Thêm'}
        cancelText='Hủy'
      >
        <Form form={khoaForm} layout='vertical' className='mt-4'>
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

      {/* ==================== LOP MODAL ==================== */}
      <Modal
        title={editingLop ? 'Cập nhật lớp' : 'Thêm lớp'}
        open={isLopModalOpen}
        onOk={handleCreateOrUpdateLop}
        onCancel={handleCloseLopModal}
        confirmLoading={createLopMutation.isPending || updateLopMutation.isPending}
        okText={editingLop ? 'Cập nhật' : 'Thêm'}
        cancelText='Hủy'
      >
        <Form form={lopForm} layout='vertical' className='mt-4'>
          <Form.Item
            label='Mã lớp'
            name='malop'
            rules={[
              { required: true, message: 'Vui lòng nhập mã lớp!' },
              { max: 15, message: 'Mã lớp không quá 15 ký tự!' }
            ]}
          >
            <Input placeholder='Nhập mã lớp' disabled={!!editingLop} />
          </Form.Item>

          <Form.Item
            label='Tên lớp'
            name='tenlop'
            rules={[
              { required: true, message: 'Vui lòng nhập tên lớp!' },
              { max: 40, message: 'Tên lớp không quá 40 ký tự!' }
            ]}
          >
            <Input placeholder='Nhập tên lớp' />
          </Form.Item>

          <Form.Item label='Khoa'>
            <Input
              value={khoaListForLop?.find((k) => k.makh === selectedKhoaLop)?.tenkh}
              disabled
              placeholder='Khoa: Tự động chọn'
            />
            <Input type='hidden' value={selectedKhoaLop} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KhoaLopManagement;
