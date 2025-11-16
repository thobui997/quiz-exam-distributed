import { useNotification } from '@app/context/notification-context';

import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Khoa } from '@app/shared/types/khoa.type';
import { useCreateKhoaLopBatch, useUpdateKhoaLopBatch, useDeleteKhoaLopBatch } from '@app/features/khoa-lop/hooks';
import { useKhoaList } from '@app/features/khoa/hooks/get-khoa-list';
import { useLopList } from '@app/features/lop/hooks/get-lop-list';
import { KhoaLopRequest } from '@app/shared/types/khoa-lop.type';
import { Lop } from '@app/shared/types/lop.type';
import { Form, Space, Button, Popconfirm, Tabs, Select, Table, Card, Input, Modal } from 'antd';

interface KhoaWithLops extends Khoa {
  lops: Lop[];
}

const KhoaLopManagement = () => {
  const [activeTab, setActiveTab] = useState('khoa');
  const notification = useNotification();

  // ==================== KHOA TAB STATE ====================
  const [isKhoaModalOpen, setIsKhoaModalOpen] = useState(false);
  const [editingKhoa, setEditingKhoa] = useState<Khoa | null>(null);
  const [selectedCSKhoa, setSelectedCSKhoa] = useState<string>('CS1');
  const [khoaForm] = Form.useForm();

  const { data: khoaList, isLoading: isLoadingKhoa, refetch: refetchKhoa } = useKhoaList(selectedCSKhoa);

  // ==================== LOP TAB STATE ====================
  const [isLopModalOpen, setIsLopModalOpen] = useState(false);
  const [editingLop, setEditingLop] = useState<Lop | null>(null);
  const [selectedCSLop, setSelectedCSLop] = useState<string>('CS1');
  const [selectedKhoaLop, setSelectedKhoaLop] = useState<string>('');
  const [lopForm] = Form.useForm();

  const { data: khoaListForLop, isLoading: isLoadingKhoaForLop } = useKhoaList(selectedCSLop);
  const { data: lopList, isLoading: isLoadingLop, refetch: refetchLop } = useLopList(selectedKhoaLop);

  // ==================== BATCH TAB STATE ====================
  const [selectedCSBatch, setSelectedCSBatch] = useState<string>('CS1');
  const [khoaBatchList, setKhoaBatchList] = useState<KhoaWithLops[]>([]);
  const [batchForm] = Form.useForm();

  const createBatchMutation = useCreateKhoaLopBatch({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Tạo khoa và lớp thành công!');
        setKhoaBatchList([]);
        batchForm.resetFields();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const updateBatchMutation = useUpdateKhoaLopBatch({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Cập nhật khoa và lớp thành công!');
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const deleteBatchMutation = useDeleteKhoaLopBatch({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Xóa khoa và lớp thành công!');
        setKhoaBatchList([]);
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  // ==================== KHOA HANDLERS ====================

  const handleEditKhoa = (record: Khoa) => {
    setEditingKhoa(record);
    khoaForm.setFieldsValue({
      makh: record.makh,
      tenkh: record.tenkh
    });
    setIsKhoaModalOpen(true);
  };

  const handleCloseKhoaModal = () => {
    setIsKhoaModalOpen(false);
    setEditingKhoa(null);
    khoaForm.resetFields();
  };

  // ==================== LOP HANDLERS ====================
  const handleEditLop = (record: Lop) => {
    setEditingLop(record);
    lopForm.setFieldsValue({
      malop: record.malop,
      tenlop: record.tenlop
    });
    setIsLopModalOpen(true);
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

  // ==================== BATCH HANDLERS ====================
  const handleAddKhoaBatch = () => {
    batchForm.validateFields(['newKhoaMa', 'newKhoaTen']).then((values) => {
      const newKhoa: KhoaWithLops = {
        makh: values.newKhoaMa,
        tenkh: values.newKhoaTen,
        macs: selectedCSBatch,
        lops: []
      };
      setKhoaBatchList([...khoaBatchList, newKhoa]);
      batchForm.setFieldsValue({ newKhoaMa: '', newKhoaTen: '' });
    });
  };

  const handleRemoveKhoaBatch = (index: number) => {
    const newList = [...khoaBatchList];
    newList.splice(index, 1);
    setKhoaBatchList(newList);
  };

  const handleAddLopBatch = (khoaIndex: number) => {
    batchForm.validateFields([`lopMa_${khoaIndex}`, `lopTen_${khoaIndex}`]).then(() => {
      const lopMa = batchForm.getFieldValue(`lopMa_${khoaIndex}`);
      const lopTen = batchForm.getFieldValue(`lopTen_${khoaIndex}`);

      if (!lopMa || !lopTen) {
        notification.showNotification('warning', 'Cảnh báo', 'Vui lòng nhập đầy đủ mã và tên lớp!');
        return;
      }

      const newList = [...khoaBatchList];
      const newLop: Lop = {
        malop: lopMa,
        tenlop: lopTen,
        makh: newList[khoaIndex].makh
      };
      newList[khoaIndex].lops.push(newLop);
      setKhoaBatchList(newList);
      batchForm.setFieldsValue({ [`lopMa_${khoaIndex}`]: '', [`lopTen_${khoaIndex}`]: '' });
    });
  };

  const handleRemoveLopBatch = (khoaIndex: number, lopIndex: number) => {
    const newList = [...khoaBatchList];
    newList[khoaIndex].lops.splice(lopIndex, 1);
    setKhoaBatchList(newList);
  };

  const handleCreateBatch = () => {
    if (khoaBatchList.length === 0) {
      notification.showNotification('warning', 'Cảnh báo', 'Vui lòng thêm ít nhất một khoa!');
      return;
    }

    const payload: KhoaLopRequest = {
      macs: selectedCSBatch,
      listKhoa: khoaBatchList.map(({ lops, ...khoa }) => khoa),
      listLop: khoaBatchList.flatMap((khoa) => khoa.lops)
    };

    createBatchMutation.mutate(payload);
  };

  const handleUpdateBatch = () => {
    if (khoaBatchList.length === 0) {
      notification.showNotification('warning', 'Cảnh báo', 'Vui lòng thêm ít nhất một khoa!');
      return;
    }

    const payload: KhoaLopRequest = {
      macs: selectedCSBatch,
      listKhoa: khoaBatchList.map(({ lops, ...khoa }) => khoa),
      listLop: khoaBatchList.flatMap((khoa) => khoa.lops)
    };

    updateBatchMutation.mutate(payload);
  };

  const handleDeleteBatch = () => {
    if (khoaBatchList.length === 0) {
      notification.showNotification('warning', 'Cảnh báo', 'Vui lòng thêm ít nhất một khoa để xóa!');
      return;
    }

    const payload: KhoaLopRequest = {
      macs: selectedCSBatch,
      listKhoa: khoaBatchList.map(({ lops, ...khoa }) => khoa),
      listLop: khoaBatchList.flatMap((khoa) => khoa.lops)
    };

    deleteBatchMutation.mutate(payload);
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

  const lopBatchColumns = (khoaIndex: number) => [
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
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: any, __: any, index: number) => (
        <Button
          type='link'
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveLopBatch(khoaIndex, index)}
          size='small'
        >
          Xóa
        </Button>
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
            </Space>
          </div>

          <Table
            columns={khoaColumns}
            dataSource={khoaList}
            loading={isLoadingKhoa}
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
              loading={isLoadingLop}
              rowKey='malop'
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng ${total} lớp`
              }}
            />
          )}
        </Tabs.TabPane>

        {/* ==================== TAB BATCH ==================== */}
        <Tabs.TabPane tab='Khoa - Lớp (Batch)' key='batch'>
          <Card className='!mb-4'>
            <div className='!mb-4'>
              <label className='block text-sm font-medium !mb-2'>Cơ sở</label>
              <Select
                value={selectedCSBatch}
                onChange={setSelectedCSBatch}
                style={{ width: 200 }}
                options={[
                  { label: 'Cơ sở 1', value: 'CS1' },
                  { label: 'Cơ sở 2', value: 'CS2' }
                ]}
              />
            </div>

            <Form form={batchForm} layout='inline'>
              <Form.Item
                name='newKhoaMa'
                rules={[{ max: 8, message: 'Mã khoa không quá 8 ký tự!' }]}
                style={{ marginBottom: 16 }}
              >
                <Input placeholder='Mã khoa' style={{ width: 150 }} />
              </Form.Item>
              <Form.Item
                name='newKhoaTen'
                rules={[{ max: 50, message: 'Tên khoa không quá 50 ký tự!' }]}
                style={{ marginBottom: 16 }}
              >
                <Input placeholder='Tên khoa' style={{ width: 300 }} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 16 }}>
                <Button type='dashed' icon={<PlusOutlined />} onClick={handleAddKhoaBatch}>
                  Thêm khoa
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <div className='space-y-4'>
            {khoaBatchList.map((khoa, khoaIndex) => (
              <Card
                key={khoaIndex}
                title={
                  <div className='flex justify-between items-center'>
                    <span>
                      {khoa.makh} - {khoa.tenkh}
                    </span>
                    <Button
                      type='link'
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveKhoaBatch(khoaIndex)}
                    >
                      Xóa khoa
                    </Button>
                  </div>
                }
              >
                <Form form={batchForm} layout='inline' className='!mb-4'>
                  <Form.Item name={`lopMa_${khoaIndex}`} rules={[{ max: 15, message: 'Mã lớp không quá 15 ký tự!' }]}>
                    <Input placeholder='Mã lớp' style={{ width: 150 }} />
                  </Form.Item>
                  <Form.Item name={`lopTen_${khoaIndex}`} rules={[{ max: 40, message: 'Tên lớp không quá 40 ký tự!' }]}>
                    <Input placeholder='Tên lớp' style={{ width: 300 }} />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type='dashed'
                      icon={<PlusOutlined />}
                      onClick={() => handleAddLopBatch(khoaIndex)}
                      size='small'
                    >
                      Thêm lớp
                    </Button>
                  </Form.Item>
                </Form>

                <Table
                  columns={lopBatchColumns(khoaIndex)}
                  dataSource={khoa.lops}
                  rowKey='malop'
                  pagination={false}
                  size='small'
                />
              </Card>
            ))}
          </div>

          {khoaBatchList.length > 0 && (
            <Card className='!mt-4'>
              <Space>
                <Button
                  type='primary'
                  icon={<SaveOutlined />}
                  onClick={handleCreateBatch}
                  loading={createBatchMutation.isPending}
                >
                  Tạo mới
                </Button>
                {/* <Button icon={<SaveOutlined />} onClick={handleUpdateBatch} loading={updateBatchMutation.isPending}>
                  Cập nhật
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteBatch}
                  loading={deleteBatchMutation.isPending}
                >
                  Xóa
                </Button> */}
              </Space>
            </Card>
          )}
        </Tabs.TabPane>
      </Tabs>

      {/* ==================== KHOA MODAL ==================== */}
      <Modal
        title={editingKhoa ? 'Cập nhật khoa' : 'Thêm khoa'}
        open={isKhoaModalOpen}
        onCancel={handleCloseKhoaModal}
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
        onCancel={handleCloseLopModal}
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
              placeholder='Khoa được chọn từ dropdown'
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KhoaLopManagement;
