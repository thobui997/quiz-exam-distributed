import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNotification } from '@app/context/notification-context';
import { useBoDeList, useCreateBoDe, useDeleteBoDe, useUpdateBoDe } from '@app/features/bo-de/hooks';
import { useMonHocList } from '@app/features/mon-hoc/hooks';
import { useGiaoVienList } from '@app/features/giao-vien/hooks';
import { BoDe } from '@app/shared/types/bo-de.type';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';

const BoDeManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBoDe, setEditingBoDe] = useState<BoDe | null>(null);
  const [selectedCS, setSelectedCS] = useState<string>('CS1');
  const [form] = Form.useForm();
  const notification = useNotification();

  const { data: monHocList, isLoading: isLoadingMonHoc } = useMonHocList();
  const { data: giaoVienList, isLoading: isLoadingGiaoVien } = useGiaoVienList(selectedCS);
  const { data: boDeList, isLoading: isLoadingBoDe, refetch } = useBoDeList(selectedCS);

  const createBoDeMutation = useCreateBoDe({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Tạo câu hỏi thành công!');
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

  const updateBoDeMutation = useUpdateBoDe({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Cập nhật câu hỏi thành công!');
        setIsModalOpen(false);
        setEditingBoDe(null);
        form.resetFields();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const deleteBoDeMutation = useDeleteBoDe({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Xóa câu hỏi thành công!');
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
      if (editingBoDe) {
        updateBoDeMutation.mutate({
          maCS: selectedCS,
          data: {
            cauhoi: editingBoDe.cauhoi,
            mamh: values.mamh,
            trinhdo: values.trinhdo,
            noidung: values.noidung,
            a: values.a,
            b: values.b,
            c: values.c,
            d: values.d,
            dapan: values.dapan,
            magv: values.magv
          }
        });
      } else {
        createBoDeMutation.mutate({
          maCS: selectedCS,
          data: {
            mamh: values.mamh,
            trinhdo: values.trinhdo,
            noidung: values.noidung,
            a: values.a,
            b: values.b,
            c: values.c,
            d: values.d,
            dapan: values.dapan,
            magv: values.magv
          }
        });
      }
    });
  };

  const handleEdit = (record: BoDe) => {
    setEditingBoDe(record);
    form.setFieldsValue({
      mamh: record.mamh,
      trinhdo: record.trinhdo,
      noidung: record.noidung,
      a: record.a,
      b: record.b,
      c: record.c,
      d: record.d,
      dapan: record.dapan,
      magv: record.magv
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record: BoDe) => {
    deleteBoDeMutation.mutate({
      maCS: selectedCS,
      boDe: record
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBoDe(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Câu hỏi',
      dataIndex: 'cauhoi',
      key: 'cauhoi',
      width: 100
    },
    {
      title: 'Môn học',
      dataIndex: 'mamh',
      key: 'mamh',
      width: 100
    },
    {
      title: 'Trình độ',
      dataIndex: 'trinhdo',
      key: 'trinhdo',
      width: 90,
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded ${
            value === 'A'
              ? 'bg-red-100 text-red-700'
              : value === 'B'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
          }`}
        >
          {value}
        </span>
      )
    },
    {
      title: 'Nội dung',
      dataIndex: 'noidung',
      key: 'noidung',
      ellipsis: true
    },
    {
      title: 'Đáp án',
      dataIndex: 'dapan',
      key: 'dapan',
      width: 80
    },
    {
      title: 'Giảng viên',
      dataIndex: 'magv',
      key: 'magv',
      width: 120
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: BoDe) => (
        <Space size='middle'>
          <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} className='!p-0'>
            Sửa
          </Button>
          <Popconfirm
            title='Xác nhận xóa'
            description='Bạn có chắc chắn muốn xóa câu hỏi này?'
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
      <h2 className='text-2xl font-semibold !mb-6'>Quản lý Bộ đề</h2>

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
            Thêm câu hỏi
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={boDeList}
        loading={isLoadingBoDe || deleteBoDeMutation.isPending}
        rowKey='cauhoi'
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} câu hỏi`
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div className='bg-gray-50 p-4 rounded'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='font-semibold mb-2'>Câu trả lời:</p>
                  <p className='mb-1'>
                    <span className='font-medium'>A:</span> {record.a}
                  </p>
                  <p className='mb-1'>
                    <span className='font-medium'>B:</span> {record.b}
                  </p>
                  <p className='mb-1'>
                    <span className='font-medium'>C:</span> {record.c}
                  </p>
                  <p>
                    <span className='font-medium'>D:</span> {record.d}
                  </p>
                </div>
                <div>
                  <p className='font-semibold mb-2'>Thông tin:</p>
                  <p className='mb-1'>
                    <span className='font-medium'>Đáp án đúng:</span>{' '}
                    <span className='text-green-600 font-bold'>{record.dapan}</span>
                  </p>
                  <p className='mb-1'>
                    <span className='font-medium'>Môn học:</span> {record.mamh}
                  </p>
                  <p>
                    <span className='font-medium'>Trình độ:</span> {record.trinhdo}
                  </p>
                </div>
              </div>
            </div>
          )
        }}
      />

      <Modal
        title={editingBoDe ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi'}
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={handleCloseModal}
        confirmLoading={createBoDeMutation.isPending || updateBoDeMutation.isPending}
        okText={editingBoDe ? 'Cập nhật' : 'Thêm'}
        cancelText='Hủy'
        width={800}
      >
        <Form form={form} layout='vertical' className='!mt-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Form.Item label='Môn học' name='mamh' rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
              <Select
                placeholder='Chọn môn học'
                loading={isLoadingMonHoc}
                disabled={!monHocList || monHocList.length === 0}
                options={monHocList?.map((mh) => ({
                  label: `${mh.mamh} - ${mh.tenmh}`,
                  value: mh.mamh
                }))}
              />
            </Form.Item>

            <Form.Item label='Trình độ' name='trinhdo' rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}>
              <Select
                placeholder='Chọn trình độ'
                options={[
                  { label: 'A - Đại học chuyên ngành', value: 'A' },
                  { label: 'B - Đại học không chuyên ngành', value: 'B' },
                  { label: 'C - Cao đẳng', value: 'C' }
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item
            label='Nội dung câu hỏi'
            name='noidung'
            rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
          >
            <TextArea rows={3} placeholder='Nhập nội dung câu hỏi' />
          </Form.Item>

          <div className='grid grid-cols-2 gap-4'>
            <Form.Item label='Đáp án A' name='a' rules={[{ required: true, message: 'Vui lòng nhập đáp án A!' }]}>
              <Input placeholder='Nhập đáp án A' />
            </Form.Item>

            <Form.Item label='Đáp án B' name='b' rules={[{ required: true, message: 'Vui lòng nhập đáp án B!' }]}>
              <Input placeholder='Nhập đáp án B' />
            </Form.Item>

            <Form.Item label='Đáp án C' name='c' rules={[{ required: true, message: 'Vui lòng nhập đáp án C!' }]}>
              <Input placeholder='Nhập đáp án C' />
            </Form.Item>

            <Form.Item label='Đáp án D' name='d' rules={[{ required: true, message: 'Vui lòng nhập đáp án D!' }]}>
              <Input placeholder='Nhập đáp án D' />
            </Form.Item>
          </div>

          <Form.Item
            label='Đáp án đúng'
            name='dapan'
            rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng!' }]}
          >
            <Select
              placeholder='Chọn đáp án đúng'
              options={[
                { label: 'A', value: 'A' },
                { label: 'B', value: 'B' },
                { label: 'C', value: 'C' },
                { label: 'D', value: 'D' }
              ]}
            />
          </Form.Item>

          <Form.Item label='Giảng viên' name='magv' rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}>
            <Select
              placeholder='Chọn giảng viên'
              loading={isLoadingGiaoVien}
              disabled={!giaoVienList || giaoVienList.length === 0}
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={giaoVienList?.map((gv) => ({
                label: `${gv.magv} - ${gv.ho} ${gv.ten}`,
                value: gv.magv
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BoDeManagement;
