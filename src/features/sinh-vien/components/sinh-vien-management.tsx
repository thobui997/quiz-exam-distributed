import { useNotification } from '@app/context/notification-context';

import { Button, Card, DatePicker, Form, Input, Select, Space, Table, Tabs } from 'antd';
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useKhoaList } from '@app/features/khoa-lop/hooks/get-khoa-list';
import { useLopList } from '@app/features/khoa-lop/hooks/get-lop-list';
import {
  useSinhVienList,
  useCreateSinhVienBatch,
  useUpdateSinhVienBatch,
  useDeleteSinhVienBatch
} from '@app/features/sinh-vien/hooks';
import { SinhVien, SinhVienBatchRequest } from '@app/shared/types/sinh-vien.type';

const SinhVienManagement = () => {
  const [activeTab, setActiveTab] = useState('view');
  const notification = useNotification();

  // ==================== VIEW TAB STATE ====================
  const [selectedCSView, setSelectedCSView] = useState<string>('CS1');
  const [selectedKhoaView, setSelectedKhoaView] = useState<string>('');
  const [selectedLopView, setSelectedLopView] = useState<string>('');

  const { data: khoaListView, isLoading: isLoadingKhoaView } = useKhoaList(selectedCSView);
  const { data: lopListView, isLoading: isLoadingLopView } = useLopList(selectedKhoaView);
  const {
    data: sinhVienList,
    isLoading: isLoadingSinhVien,
    refetch: refetchSinhVien
  } = useSinhVienList(selectedLopView);

  // ==================== BATCH TAB STATE ====================
  const [selectedCSBatch, setSelectedCSBatch] = useState<string>('CS1');
  const [selectedKhoaBatch, setSelectedKhoaBatch] = useState<string>('');
  const [selectedLopBatch, setSelectedLopBatch] = useState<string>('');
  const [sinhVienBatchList, setSinhVienBatchList] = useState<SinhVien[]>([]);
  const [batchForm] = Form.useForm();

  const { data: khoaListBatch, isLoading: isLoadingKhoaBatch } = useKhoaList(selectedCSBatch);
  const { data: lopListBatch, isLoading: isLoadingLopBatch } = useLopList(selectedKhoaBatch);

  const createBatchMutation = useCreateSinhVienBatch({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Tạo sinh viên thành công!');
        setSinhVienBatchList([]);
        batchForm.resetFields();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const updateBatchMutation = useUpdateSinhVienBatch({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Cập nhật sinh viên thành công!');
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const deleteBatchMutation = useDeleteSinhVienBatch({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Xóa sinh viên thành công!');
        setSinhVienBatchList([]);
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  // ==================== VIEW HANDLERS ====================
  const handleCSViewChange = (value: string) => {
    setSelectedCSView(value);
    setSelectedKhoaView('');
    setSelectedLopView('');
  };

  const handleKhoaViewChange = (value: string) => {
    setSelectedKhoaView(value);
    setSelectedLopView('');
  };

  // ==================== BATCH HANDLERS ====================
  const handleCSBatchChange = (value: string) => {
    setSelectedCSBatch(value);
    setSelectedKhoaBatch('');
    setSelectedLopBatch('');
  };

  const handleKhoaBatchChange = (value: string) => {
    setSelectedKhoaBatch(value);
    setSelectedLopBatch('');
  };

  const handleAddSinhVien = () => {
    if (!selectedLopBatch) {
      notification.showNotification('warning', 'Cảnh báo', 'Vui lòng chọn lớp!');
      return;
    }

    batchForm.validateFields().then((values) => {
      const newSinhVien: SinhVien = {
        masv: values.masv,
        ho: values.ho,
        ten: values.ten,
        ngaysinh: values.ngaysinh ? dayjs(values.ngaysinh).format('YYYY-MM-DD') : '',
        diachi: values.diachi || '',
        malop: selectedLopBatch
      };
      setSinhVienBatchList([...sinhVienBatchList, newSinhVien]);
      batchForm.resetFields();
    });
  };

  const handleRemoveSinhVien = (index: number) => {
    const newList = [...sinhVienBatchList];
    newList.splice(index, 1);
    setSinhVienBatchList(newList);
  };

  const handleCreateBatch = () => {
    if (sinhVienBatchList.length === 0) {
      notification.showNotification('warning', 'Cảnh báo', 'Vui lòng thêm ít nhất một sinh viên!');
      return;
    }

    const payload: SinhVienBatchRequest = {
      macs: selectedCSBatch,
      listSinhVien: sinhVienBatchList
    };

    createBatchMutation.mutate(payload);
  };

  const handleUpdateBatch = () => {
    if (sinhVienBatchList.length === 0) {
      notification.showNotification('warning', 'Cảnh báo', 'Vui lòng thêm ít nhất một sinh viên!');
      return;
    }

    const payload: SinhVienBatchRequest = {
      macs: selectedCSBatch,
      listSinhVien: sinhVienBatchList
    };

    updateBatchMutation.mutate(payload);
  };

  const handleDeleteBatch = () => {
    if (sinhVienBatchList.length === 0) {
      notification.showNotification('warning', 'Cảnh báo', 'Vui lòng thêm ít nhất một sinh viên để xóa!');
      return;
    }

    const payload: SinhVienBatchRequest = {
      macs: selectedCSBatch,
      listSinhVien: sinhVienBatchList
    };

    deleteBatchMutation.mutate(payload);
  };

  // ==================== COLUMNS ====================
  const viewColumns = [
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
    }
  ];

  const batchColumns = [
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
      width: 120
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
      width: 100,
      render: (_: any, __: any, index: number) => (
        <Button type='link' danger icon={<DeleteOutlined />} onClick={() => handleRemoveSinhVien(index)} size='small'>
          Xóa
        </Button>
      )
    }
  ];

  // ==================== RENDER ====================
  return (
    <div className='!p-6'>
      <h2 className='text-2xl font-semibold !mb-6'>Quản lý Sinh viên</h2>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* ==================== TAB VIEW ==================== */}
        <Tabs.TabPane tab='Xem danh sách' key='view'>
          <div className='!mb-4 flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <Select
                value={selectedCSView}
                onChange={handleCSViewChange}
                style={{ width: 150 }}
                options={[
                  { label: 'Cơ sở 1', value: 'CS1' },
                  { label: 'Cơ sở 2', value: 'CS2' }
                ]}
              />
              <Select
                value={selectedKhoaView}
                onChange={handleKhoaViewChange}
                placeholder='Chọn khoa'
                style={{ width: 250 }}
                loading={isLoadingKhoaView}
                disabled={!khoaListView || khoaListView.length === 0}
                options={khoaListView?.map((khoa) => ({
                  label: `${khoa.makh} - ${khoa.tenkh}`,
                  value: khoa.makh
                }))}
              />
              <Select
                value={selectedLopView}
                onChange={setSelectedLopView}
                placeholder='Chọn lớp'
                style={{ width: 250 }}
                loading={isLoadingLopView}
                disabled={!lopListView || lopListView.length === 0}
                options={lopListView?.map((lop) => ({
                  label: `${lop.malop} - ${lop.tenlop}`,
                  value: lop.malop
                }))}
              />
            </div>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => refetchSinhVien()} disabled={!selectedLopView}>
                Tải lại
              </Button>
            </Space>
          </div>

          {!selectedLopView ? (
            <div className='text-center py-12 text-gray-500'>
              <p className='text-lg'>Vui lòng chọn lớp để xem danh sách sinh viên</p>
            </div>
          ) : (
            <Table
              columns={viewColumns}
              dataSource={sinhVienList}
              loading={isLoadingSinhVien}
              rowKey='masv'
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng ${total} sinh viên`
              }}
            />
          )}
        </Tabs.TabPane>

        {/* ==================== TAB BATCH ==================== */}
        <Tabs.TabPane tab='Batch Operations' key='batch'>
          <Card className='!mb-4'>
            <div className='!mb-4 flex gap-4'>
              <div>
                <label className='block text-sm font-medium !mb-2'>Cơ sở</label>
                <Select
                  value={selectedCSBatch}
                  onChange={handleCSBatchChange}
                  style={{ width: 150 }}
                  options={[
                    { label: 'Cơ sở 1', value: 'CS1' },
                    { label: 'Cơ sở 2', value: 'CS2' }
                  ]}
                />
              </div>
              <div>
                <label className='block text-sm font-medium !mb-2'>Khoa</label>
                <Select
                  value={selectedKhoaBatch}
                  onChange={handleKhoaBatchChange}
                  placeholder='Chọn khoa'
                  style={{ width: 250 }}
                  loading={isLoadingKhoaBatch}
                  disabled={!khoaListBatch || khoaListBatch.length === 0}
                  options={khoaListBatch?.map((khoa) => ({
                    label: `${khoa.makh} - ${khoa.tenkh}`,
                    value: khoa.makh
                  }))}
                />
              </div>
              <div>
                <label className='block text-sm font-medium !mb-2'>Lớp</label>
                <Select
                  value={selectedLopBatch}
                  onChange={setSelectedLopBatch}
                  placeholder='Chọn lớp'
                  style={{ width: 250 }}
                  loading={isLoadingLopBatch}
                  disabled={!lopListBatch || lopListBatch.length === 0}
                  options={lopListBatch?.map((lop) => ({
                    label: `${lop.malop} - ${lop.tenlop}`,
                    value: lop.malop
                  }))}
                />
              </div>
            </div>

            <Form form={batchForm} layout='inline'>
              <Form.Item
                name='masv'
                rules={[
                  { required: true, message: 'Vui lòng nhập MSSV!' },
                  { max: 8, message: 'MSSV không quá 8 ký tự!' }
                ]}
                style={{ marginBottom: 16 }}
              >
                <Input placeholder='MSSV' style={{ width: 100 }} />
              </Form.Item>
              <Form.Item
                name='ho'
                rules={[
                  { required: true, message: 'Vui lòng nhập họ!' },
                  { max: 50, message: 'Họ không quá 50 ký tự!' }
                ]}
                style={{ marginBottom: 16 }}
              >
                <Input placeholder='Họ' style={{ width: 150 }} />
              </Form.Item>
              <Form.Item
                name='ten'
                rules={[
                  { required: true, message: 'Vui lòng nhập tên!' },
                  { max: 10, message: 'Tên không quá 10 ký tự!' }
                ]}
                style={{ marginBottom: 16 }}
              >
                <Input placeholder='Tên' style={{ width: 100 }} />
              </Form.Item>
              <Form.Item name='ngaysinh' rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                <DatePicker placeholder='Ngày sinh' format='DD/MM/YYYY' />
              </Form.Item>
              <Form.Item name='diachi' style={{ marginBottom: 16 }}>
                <Input placeholder='Địa chỉ' style={{ width: 200 }} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 16 }}>
                <Button type='dashed' icon={<PlusOutlined />} onClick={handleAddSinhVien}>
                  Thêm sinh viên
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {sinhVienBatchList.length > 0 && (
            <>
              <Table
                columns={batchColumns}
                dataSource={sinhVienBatchList}
                rowKey='masv'
                pagination={false}
                size='small'
                className='!mb-4'
              />

              <Card>
                <Space>
                  <Button
                    type='primary'
                    icon={<SaveOutlined />}
                    onClick={handleCreateBatch}
                    loading={createBatchMutation.isPending}
                  >
                    Tạo mới
                  </Button>
                  <Button icon={<SaveOutlined />} onClick={handleUpdateBatch} loading={updateBatchMutation.isPending}>
                    Cập nhật
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDeleteBatch}
                    loading={deleteBatchMutation.isPending}
                  >
                    Xóa
                  </Button>
                </Space>
              </Card>
            </>
          )}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default SinhVienManagement;
