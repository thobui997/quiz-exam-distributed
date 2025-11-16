import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNotification } from '@app/context/notification-context';
import {
  useCreateGiaoVienDangKy,
  useDeleteGiaoVienDangKy,
  useGiaoVienDangKyList,
  useUpdateGiaoVienDangKy
} from '@app/features/giao-vien-dang-ky/hooks';
import { useGiaoVienList } from '@app/features/giao-vien/hooks';
import { useKhoaList } from '@app/features/khoa-lop/hooks/get-khoa-list';
import { useLopList } from '@app/features/khoa-lop/hooks/get-lop-list';
import { useMonHocList } from '@app/features/mon-hoc/hooks';
import { GiaoVienDangKy } from '@app/shared/types/giao-vien-dang-ky.type';
import { Button, DatePicker, Form, InputNumber, Modal, Popconfirm, Select, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const GiaoVienDangKyManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGiaoVienDangKy, setEditingGiaoVienDangKy] = useState<GiaoVienDangKy | null>(null);
  const [selectedCS, setSelectedCS] = useState<string>('CS1');
  const [selectedKhoa, setSelectedKhoa] = useState<string>('');
  const [selectedKhoaInModal, setSelectedKhoaInModal] = useState<string>('');
  const [form] = Form.useForm();
  const notification = useNotification();

  const { data: khoaList, isLoading: isLoadingKhoa } = useKhoaList(selectedCS);
  const { data: lopListInModal, isLoading: isLoadingLopInModal } = useLopList(selectedKhoaInModal);
  const { data: monHocList, isLoading: isLoadingMonHoc } = useMonHocList();
  const { data: giaoVienList, isLoading: isLoadingGiaoVien } = useGiaoVienList(selectedCS);
  const { data: giaoVienDangKyList, isLoading: isLoadingGiaoVienDangKy, refetch } = useGiaoVienDangKyList(selectedCS);

  const createGiaoVienDangKyMutation = useCreateGiaoVienDangKy({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Tạo đăng ký thành công!');
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

  const updateGiaoVienDangKyMutation = useUpdateGiaoVienDangKy({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Cập nhật đăng ký thành công!');
        setIsModalOpen(false);
        setEditingGiaoVienDangKy(null);
        form.resetFields();
      } else {
        notification.showNotification('error', 'Thất bại', data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const deleteGiaoVienDangKyMutation = useDeleteGiaoVienDangKy({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Xóa đăng ký thành công!');
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
      const payloadData: GiaoVienDangKy = {
        magv: values.magv,
        mamh: values.mamh,
        malop: values.malop,
        trinhdo: values.trinhdo,
        ngaythi: values.ngaythi ? dayjs(values.ngaythi).format('YYYY-MM-DDTHH:mm:ss.SSS') : '',
        lan: values.lan,
        socauthi: values.socauthi,
        thoigian: values.thoigian
      };

      if (editingGiaoVienDangKy) {
        updateGiaoVienDangKyMutation.mutate({
          maCS: selectedCS,
          data: payloadData
        });
      } else {
        createGiaoVienDangKyMutation.mutate({
          maCS: selectedCS,
          data: payloadData
        });
      }
    });
  };

  const handleEdit = (record: GiaoVienDangKy) => {
    setEditingGiaoVienDangKy(record);

    form.setFieldsValue({
      magv: record.magv,
      mamh: record.mamh,
      malop: record.malop,
      khoaTemp: '',
      trinhdo: record.trinhdo,
      ngaythi: record.ngaythi ? dayjs(record.ngaythi) : null,
      lan: record.lan,
      socauthi: record.socauthi,
      thoigian: record.thoigian
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record: GiaoVienDangKy) => {
    deleteGiaoVienDangKyMutation.mutate({
      maCS: selectedCS,
      giaoVienDangKy: record
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGiaoVienDangKy(null);
    setSelectedKhoaInModal('');
    form.resetFields();
  };

  const handleCSChange = (value: string) => {
    setSelectedCS(value);
    setSelectedKhoa('');
  };

  const columns = [
    {
      title: 'Mã GV',
      dataIndex: 'magv',
      key: 'magv',
      width: 100
    },
    {
      title: 'Mã MH',
      dataIndex: 'mamh',
      key: 'mamh',
      width: 100
    },
    {
      title: 'Mã lớp',
      dataIndex: 'malop',
      key: 'malop',
      width: 120
    },
    {
      title: 'Trình độ',
      dataIndex: 'trinhdo',
      key: 'trinhdo',
      width: 80,
      render: (trinhdo: string) => (
        <span className='font-medium'>
          {trinhdo === 'A' ? 'A - Đại học chuyên ngành' : trinhdo === 'B' ? 'B - Đại học' : 'C - Cao đẳng'}
        </span>
      )
    },
    {
      title: 'Ngày thi',
      dataIndex: 'ngaythi',
      key: 'ngaythi',
      width: 150,
      render: (date: string) => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '')
    },
    {
      title: 'Lần',
      dataIndex: 'lan',
      key: 'lan',
      width: 60
    },
    {
      title: 'Số câu thi',
      dataIndex: 'socauthi',
      key: 'socauthi',
      width: 100
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'thoigian',
      key: 'thoigian',
      width: 120
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: GiaoVienDangKy) => (
        <Space size='middle'>
          <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} className='!p-0'>
            Sửa
          </Button>
          <Popconfirm
            title='Xác nhận xóa'
            description='Bạn có chắc chắn muốn xóa đăng ký này?'
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
      <h2 className='text-2xl font-semibold !mb-6'>Quản lý Đăng ký thi</h2>

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
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Tải lại
          </Button>
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Thêm đăng ký
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={giaoVienDangKyList}
        loading={isLoadingGiaoVienDangKy || deleteGiaoVienDangKyMutation.isPending}
        rowKey={(record) => `${record.malop}-${record.mamh}-${record.lan}`}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} đăng ký`
        }}
      />

      <Modal
        title={editingGiaoVienDangKy ? 'Cập nhật đăng ký thi' : 'Thêm đăng ký thi'}
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={handleCloseModal}
        confirmLoading={createGiaoVienDangKyMutation.isPending || updateGiaoVienDangKyMutation.isPending}
        okText={editingGiaoVienDangKy ? 'Cập nhật' : 'Thêm'}
        cancelText='Hủy'
        width={700}
      >
        <Form form={form} layout='vertical' className='!mt-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Form.Item
              label='Giảng viên'
              name='magv'
              rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
            >
              <Select
                placeholder='Chọn giảng viên'
                loading={isLoadingGiaoVien}
                disabled={!!editingGiaoVienDangKy || !giaoVienList || giaoVienList.length === 0}
                showSearch
                optionFilterProp='label'
                options={giaoVienList?.map((gv) => ({
                  label: `${gv.magv} - ${gv.ho} ${gv.ten}`,
                  value: gv.magv
                }))}
              />
            </Form.Item>

            <Form.Item label='Môn học' name='mamh' rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
              <Select
                placeholder='Chọn môn học'
                loading={isLoadingMonHoc}
                disabled={!!editingGiaoVienDangKy || !monHocList || monHocList.length === 0}
                options={monHocList?.map((mh) => ({
                  label: `${mh.mamh} - ${mh.tenmh}`,
                  value: mh.mamh
                }))}
              />
            </Form.Item>

            <Form.Item label='Khoa' name='khoaTemp'>
              <Select
                placeholder='Chọn khoa'
                loading={isLoadingKhoa}
                disabled={!khoaList || khoaList.length === 0}
                value={selectedKhoaInModal}
                onChange={(value) => {
                  setSelectedKhoaInModal(value);
                  form.setFieldValue('malop', undefined); // Reset lớp khi đổi khoa
                }}
                options={khoaList?.map((khoa) => ({
                  label: `${khoa.makh} - ${khoa.tenkh}`,
                  value: khoa.makh
                }))}
              />
            </Form.Item>

            <Form.Item label='Lớp' name='malop' rules={[{ required: true, message: 'Vui lòng chọn lớp!' }]}>
              <Select
                placeholder={selectedKhoaInModal ? 'Chọn lớp' : 'Vui lòng chọn khoa trước'}
                loading={isLoadingLopInModal}
                disabled={!selectedKhoaInModal || !lopListInModal || lopListInModal.length === 0}
                options={lopListInModal?.map((lop) => ({
                  label: `${lop.malop} - ${lop.tenlop}`,
                  value: lop.malop
                }))}
              />
            </Form.Item>

            <Form.Item label='Trình độ' name='trinhdo' rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}>
              <Select
                placeholder='Chọn trình độ'
                disabled={!!editingGiaoVienDangKy}
                options={[
                  { label: 'A - Đại học chuyên ngành', value: 'A' },
                  { label: 'B - Đại học', value: 'B' },
                  { label: 'C - Cao đẳng', value: 'C' }
                ]}
              />
            </Form.Item>

            <Form.Item label='Ngày thi' name='ngaythi' rules={[{ required: true, message: 'Vui lòng chọn ngày thi!' }]}>
              <DatePicker
                showTime
                placeholder='Chọn ngày và giờ thi'
                format='DD/MM/YYYY HH:mm'
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label='Lần thi'
              name='lan'
              rules={[
                { required: true, message: 'Vui lòng nhập lần thi!' },
                { type: 'number', min: 1, max: 2, message: 'Lần thi từ 1-2!' }
              ]}
            >
              <InputNumber placeholder='Nhập lần thi (1-2)' style={{ width: '100%' }} min={1} max={2} />
            </Form.Item>

            <Form.Item
              label='Số câu thi'
              name='socauthi'
              rules={[
                { required: true, message: 'Vui lòng nhập số câu thi!' },
                { type: 'number', min: 10, max: 100, message: 'Số câu thi từ 10-100!' }
              ]}
            >
              <InputNumber placeholder='Nhập số câu thi (10-100)' style={{ width: '100%' }} min={10} max={100} />
            </Form.Item>

            <Form.Item
              label='Thời gian (phút)'
              name='thoigian'
              rules={[
                { required: true, message: 'Vui lòng nhập thời gian!' },
                { type: 'number', min: 2, max: 60, message: 'Thời gian từ 2-60 phút!' }
              ]}
            >
              <InputNumber placeholder='Nhập thời gian (2-60)' style={{ width: '100%' }} min={2} max={60} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default GiaoVienDangKyManagement;
