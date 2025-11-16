import { useNotification } from '@app/context/notification-context';
import { Button, Card, Form, Input, Select, Space, Table, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { KhoaLopRequest } from '@app/shared/types/khoa-lop.type';
import { Khoa } from '@app/shared/types/khoa.type';
import { Lop } from '@app/shared/types/lop.type';
import { useCreateKhoaLopBatch, useUpdateKhoaLopBatch, useDeleteKhoaLopBatch } from '@app/features/khoa-lop/hooks';

const { Title } = Typography;

interface KhoaWithLops extends Khoa {
  lops: Lop[];
}

const KhoaLopBatchForm = () => {
  const [selectedCS, setSelectedCS] = useState<string>('CS1');
  const [khoaList, setKhoaList] = useState<KhoaWithLops[]>([]);
  const [form] = Form.useForm();
  const notification = useNotification();

  const createBatchMutation = useCreateKhoaLopBatch({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Tạo khoa và lớp thành công!');
        setKhoaList([]);
        form.resetFields();
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
        setKhoaList([]);
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const handleAddKhoa = () => {
    form.validateFields(['newKhoaMa', 'newKhoaTen']).then((values) => {
      const newKhoa: KhoaWithLops = {
        makh: values.newKhoaMa,
        tenkh: values.newKhoaTen,
        macs: selectedCS,
        lops: []
      };
      setKhoaList([...khoaList, newKhoa]);
      form.setFieldsValue({ newKhoaMa: '', newKhoaTen: '' });
    });
  };

  const handleRemoveKhoa = (index: number) => {
    const newList = [...khoaList];
    newList.splice(index, 1);
    setKhoaList(newList);
  };

  const handleAddLop = (khoaIndex: number) => {
    form.validateFields([`lopMa_${khoaIndex}`, `lopTen_${khoaIndex}`]).then(() => {
      const lopMa = form.getFieldValue(`lopMa_${khoaIndex}`);
      const lopTen = form.getFieldValue(`lopTen_${khoaIndex}`);

      if (!lopMa || !lopTen) {
        notification.showNotification('warning', 'Cảnh báo', 'Vui lòng nhập đầy đủ mã và tên lớp!');
        return;
      }

      const newList = [...khoaList];
      const newLop: Lop = {
        malop: lopMa,
        tenlop: lopTen,
        makh: newList[khoaIndex].makh
      };
      newList[khoaIndex].lops.push(newLop);
      setKhoaList(newList);
      form.setFieldsValue({ [`lopMa_${khoaIndex}`]: '', [`lopTen_${khoaIndex}`]: '' });
    });
  };

  const handleRemoveLop = (khoaIndex: number, lopIndex: number) => {
    const newList = [...khoaList];
    newList[khoaIndex].lops.splice(lopIndex, 1);
    setKhoaList(newList);
  };

  const handleCreate = () => {
    if (khoaList.length === 0) {
      notification.showNotification('warning', 'Cảnh báo', 'Vui lòng thêm ít nhất một khoa!');
      return;
    }

    const payload: KhoaLopRequest = {
      macs: selectedCS,
      listKhoa: khoaList.map(({ lops, ...khoa }) => khoa),
      listLop: khoaList.flatMap((khoa) => khoa.lops)
    };

    createBatchMutation.mutate(payload);
  };

  const handleUpdate = () => {
    if (khoaList.length === 0) {
      notification.showNotification('warning', 'Cảnh báo', 'Vui lòng thêm ít nhất một khoa!');
      return;
    }

    const payload: KhoaLopRequest = {
      macs: selectedCS,
      listKhoa: khoaList.map(({ lops, ...khoa }) => khoa),
      listLop: khoaList.flatMap((khoa) => khoa.lops)
    };

    updateBatchMutation.mutate(payload);
  };

  const handleDelete = () => {
    if (khoaList.length === 0) {
      notification.showNotification('warning', 'Cảnh báo', 'Vui lòng thêm ít nhất một khoa để xóa!');
      return;
    }

    const payload: KhoaLopRequest = {
      macs: selectedCS,
      listKhoa: khoaList.map(({ lops, ...khoa }) => khoa),
      listLop: khoaList.flatMap((khoa) => khoa.lops)
    };

    deleteBatchMutation.mutate(payload);
  };

  const lopColumns = (khoaIndex: number) => [
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
          onClick={() => handleRemoveLop(khoaIndex, index)}
          size='small'
        >
          Xóa
        </Button>
      )
    }
  ];

  return (
    <div className='!p-6'>
      <div className='!mb-6'>
        <Title level={2}>Quản lý Khoa - Lớp (Batch)</Title>
        <p className='text-gray-600'>Tạo, cập nhật hoặc xóa nhiều khoa và lớp cùng lúc</p>
      </div>

      <Card className='!mb-4'>
        <div className='!mb-4'>
          <label className='block text-sm font-medium !mb-2'>Cơ sở</label>
          <Select
            value={selectedCS}
            onChange={setSelectedCS}
            style={{ width: 200 }}
            options={[
              { label: 'Cơ sở 1', value: 'CS1' },
              { label: 'Cơ sở 2', value: 'CS2' }
            ]}
          />
        </div>

        <Form form={form} layout='inline'>
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
            <Button type='dashed' icon={<PlusOutlined />} onClick={handleAddKhoa}>
              Thêm khoa
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <div className='space-y-4'>
        {khoaList.map((khoa, khoaIndex) => (
          <Card
            key={khoaIndex}
            title={
              <div className='flex justify-between items-center'>
                <span>
                  {khoa.makh} - {khoa.tenkh}
                </span>
                <Button type='link' danger icon={<DeleteOutlined />} onClick={() => handleRemoveKhoa(khoaIndex)}>
                  Xóa khoa
                </Button>
              </div>
            }
          >
            <Form form={form} layout='inline' className='mb-4'>
              <Form.Item name={`lopMa_${khoaIndex}`} rules={[{ max: 15, message: 'Mã lớp không quá 15 ký tự!' }]}>
                <Input placeholder='Mã lớp' style={{ width: 150 }} />
              </Form.Item>
              <Form.Item name={`lopTen_${khoaIndex}`} rules={[{ max: 40, message: 'Tên lớp không quá 40 ký tự!' }]}>
                <Input placeholder='Tên lớp' style={{ width: 300 }} />
              </Form.Item>
              <Form.Item>
                <Button type='dashed' icon={<PlusOutlined />} onClick={() => handleAddLop(khoaIndex)} size='small'>
                  Thêm lớp
                </Button>
              </Form.Item>
            </Form>

            <Table
              columns={lopColumns(khoaIndex)}
              dataSource={khoa.lops}
              rowKey='malop'
              pagination={false}
              size='small'
            />
          </Card>
        ))}
      </div>

      {khoaList.length > 0 && (
        <Card className='!mt-4'>
          <Space>
            <Button
              type='primary'
              icon={<SaveOutlined />}
              onClick={handleCreate}
              loading={createBatchMutation.isPending}
            >
              Tạo mới
            </Button>
            <Button icon={<SaveOutlined />} onClick={handleUpdate} loading={updateBatchMutation.isPending}>
              Cập nhật
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete} loading={deleteBatchMutation.isPending}>
              Xóa
            </Button>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default KhoaLopBatchForm;
