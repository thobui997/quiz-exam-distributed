import { useNotification } from '@app/context/notification-context';
import { Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { MonHoc } from '@app/shared/types';
import { useCreateMonHoc, useDeleteMonHoc, useMonHocList, useUpdateMonHoc } from '@app/features/mon-hoc/hooks';

const MonHocList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const notification = useNotification();
  const [editingMonHoc, setEditingMonHoc] = useState<MonHoc | null>(null);

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

  const updateMHMutation = useUpdateMonHoc({
    onSuccess: (data) => {
      notification.showNotification('success', 'Thành công', 'Cập nhật môn học thành công!');
      setIsModalOpen(false);
      setEditingMonHoc(null);
      form.resetFields();
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const deleteMHMutation = useDeleteMonHoc({
    onSuccess: (data) => {
      notification.showNotification('success', 'Thành công', 'Xóa môn học thành công!');
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const handleCreate = () => {
    form.validateFields().then((values) => {
      if (editingMonHoc) {
        updateMHMutation.mutate({
          mamh: values.mamh,
          tenmh: values.tenmh
        });
      } else {
        createMonHocMutation.mutate([
          {
            mamh: values.mamh,
            tenmh: values.tenmh
          }
        ]);
      }
    });
  };

  const handleEdit = (record: MonHoc) => {
    setEditingMonHoc(record);
    form.setFieldsValue({
      mamh: record.mamh,
      tenmh: record.tenmh
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record: MonHoc) => {
    deleteMHMutation.mutate({
      mamh: record.mamh,
      tenmh: record.tenmh
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
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: MonHoc) => (
        <Space size='middle'>
          <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} className='!p-0'>
            Sửa
          </Button>
          <Popconfirm
            title='Xác nhận xóa'
            description='Bạn có chắc chắn muốn xóa môn học này?'
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
        title={editingMonHoc ? 'Cập nhật môn học' : 'Thêm môn học'}
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        confirmLoading={createMonHocMutation.isPending}
        okText={editingMonHoc ? 'Cập nhật' : 'Thêm'}
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
            <Input placeholder='Nhập mã môn học' disabled={!!editingMonHoc} />
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
