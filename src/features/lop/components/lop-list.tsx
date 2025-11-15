import { useNotification } from '@app/context/notification-context';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useKhoaList } from '@app/features/khoa/hooks/get-khoa-list';
import { useLopList } from '@app/features/lop/hooks/get-lop-list';
import { Lop } from '@app/shared/types/lop.type';

const LopList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLop, setEditingLop] = useState<Lop | null>(null);
  const [selectedCS, setSelectedCS] = useState<string>('CS1');
  const [selectedKhoa, setSelectedKhoa] = useState<string>('');
  const [form] = Form.useForm();
  const notification = useNotification();

  // Get danh sách khoa theo cơ sở
  const { data: khoaList, isLoading: isLoadingKhoa } = useKhoaList(selectedCS);

  // Get danh sách lớp theo khoa
  const { data: lopList, isLoading: isLoadingLop, refetch } = useLopList(selectedKhoa);

  // const createLopMutation = useCreateLop({
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

  // const updateLopMutation = useUpdateLop({
  //   onSuccess: (data) => {
  //     if (data.status === 'SUCCESS') {
  //       notification.showNotification('success', 'Thành công', data.message);
  //       setIsModalOpen(false);
  //       setEditingLop(null);
  //       form.resetFields();
  //     } else {
  //       notification.showNotification('error', 'Thất bại', data.message);
  //     }
  //   },
  //   onError: (error: any) => {
  //     notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
  //   }
  // });

  // const deleteLopMutation = useDeleteLop({
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
  //     if (editingLop) {
  //       updateLopMutation.mutate({
  //         malop: editingLop.malop,
  //         tenlop: values.tenlop,
  //         makh: selectedKhoa
  //       });
  //     } else {
  //       createLopMutation.mutate({
  //         malop: values.malop,
  //         tenlop: values.tenlop,
  //         makh: selectedKhoa
  //       });
  //     }
  //   });
  // };

  // const handleEdit = (record: Lop) => {
  //   setEditingLop(record);
  //   form.setFieldsValue({
  //     malop: record.malop,
  //     tenlop: record.tenlop
  //   });
  //   setIsModalOpen(true);
  // };

  // const handleDelete = (record: Lop) => {
  //   deleteLopMutation.mutate({
  //     maKH: record.makh,
  //     maLop: record.malop
  //   });
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLop(null);
    form.resetFields();
  };

  const handleCSChange = (value: string) => {
    setSelectedCS(value);
    setSelectedKhoa(''); // Reset khoa khi đổi cơ sở
  };

  const handleKhoaChange = (value: string) => {
    setSelectedKhoa(value);
  };

  const columns = [
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
          <Button type='link' icon={<EditOutlined />} className='!p-0'>
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

  return (
    <div className='p-6'>
      <div className='mb-4 flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <h2 className='text-2xl font-semibold'>Quản lý lớp</h2>
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
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()} disabled={!selectedKhoa}>
            Tải lại
          </Button>
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} disabled={!selectedKhoa}>
            Thêm lớp
          </Button>
        </Space>
      </div>

      {!selectedKhoa ? (
        <div className='text-center py-12 text-gray-500'>
          <p className='text-lg'>Vui lòng chọn khoa để xem danh sách lớp</p>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={lopList}
          loading={isLoadingLop}
          rowKey='malop'
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} lớp`
          }}
        />
      )}

      <Modal
        title={editingLop ? 'Cập nhật lớp' : 'Thêm lớp'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        okText={editingLop ? 'Cập nhật' : 'Thêm'}
        cancelText='Hủy'
      >
        <Form form={form} layout='vertical' className='mt-4'>
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
              value={khoaList?.find((k) => k.makh === selectedKhoa)?.tenkh}
              disabled
              placeholder='Khoa được chọn từ dropdown'
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LopList;
