import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useNotification } from '@app/context/notification-context';
import { useBangDiem } from '@app/features/bang-diem/hooks';
import { useKhoaList } from '@app/features/khoa-lop/hooks/get-khoa-list';
import { useLopList } from '@app/features/khoa-lop/hooks/get-lop-list';
import { useMonHocList } from '@app/features/mon-hoc/hooks';
import { Button, Card, Form, InputNumber, Select, Space, Table } from 'antd';
import { useState } from 'react';

const BangDiemManagement = () => {
  const [form] = Form.useForm();
  const notification = useNotification();

  const [selectedCS, setSelectedCS] = useState<string>('CS1');
  const [selectedKhoa, setSelectedKhoa] = useState<string>('');
  const [selectedLop, setSelectedLop] = useState<string>('');
  const [selectedMonHoc, setSelectedMonHoc] = useState<string>('');
  const [selectedLan, setSelectedLan] = useState<number>(1);
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: khoaList, isLoading: isLoadingKhoa } = useKhoaList(selectedCS);
  const { data: lopList, isLoading: isLoadingLop } = useLopList(selectedKhoa);
  const { data: monHocList, isLoading: isLoadingMonHoc } = useMonHocList();

  const {
    data: bangDiemList,
    isLoading: isLoadingBangDiem,
    refetch
  } = useBangDiem(
    {
      malop: selectedLop,
      mamh: selectedMonHoc,
      lan: selectedLan,
      macs: selectedCS
    },
    shouldFetch
  );

  const handleCSChange = (value: string) => {
    setSelectedCS(value);
    setSelectedKhoa('');
    setSelectedLop('');
    setShouldFetch(false);
    form.setFieldsValue({ makh: undefined, malop: undefined });
  };

  const handleKhoaChange = (value: string) => {
    setSelectedKhoa(value);
    setSelectedLop('');
    setShouldFetch(false);
    form.setFieldsValue({ malop: undefined });
  };

  const handleLopChange = (value: string) => {
    setSelectedLop(value);
    setShouldFetch(false);
  };

  const handleMonHocChange = (value: string) => {
    setSelectedMonHoc(value);
    setShouldFetch(false);
  };

  const handleLanChange = (value: number | null) => {
    if (value) {
      setSelectedLan(value);
      setShouldFetch(false);
    }
  };

  const handleViewDiem = () => {
    form.validateFields().then(() => {
      if (!selectedLop || !selectedMonHoc || !selectedLan) {
        notification.showNotification('warning', 'Cảnh báo', 'Vui lòng chọn đầy đủ thông tin!');
        return;
      }
      setShouldFetch(true);
    });
  };

  const sortedBangDiemList = bangDiemList ? [...bangDiemList].sort((a, b) => b.diem - a.diem) : [];

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'Mã SV',
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
      title: 'Điểm',
      dataIndex: 'diem',
      key: 'diem',
      width: 100,
      align: 'center' as const,
      render: (diem: number) => (
        <span
          className={`font-bold ${
            diem >= 8
              ? 'text-green-600'
              : diem >= 6.5
                ? 'text-blue-600'
                : diem >= 5
                  ? 'text-yellow-600'
                  : 'text-red-600'
          }`}
        >
          {diem.toFixed(1)}
        </span>
      )
    },
    {
      title: 'Điểm chữ',
      dataIndex: 'diemChu',
      key: 'diemChu'
    }
  ];

  return (
    <div className='!p-6'>
      <h2 className='text-2xl font-semibold !mb-6'>Xem điểm thi</h2>

      <Card className='!mb-6 shadow-lg'>
        <Form form={form} layout='vertical'>
          <div className='grid grid-cols-5 gap-4'>
            <Form.Item label='Cơ sở' name='macs' initialValue={selectedCS}>
              <Select
                value={selectedCS}
                onChange={handleCSChange}
                options={[
                  { label: 'Cơ sở 1', value: 'CS1' },
                  { label: 'Cơ sở 2', value: 'CS2' }
                ]}
              />
            </Form.Item>

            <Form.Item label='Khoa' name='makh' rules={[{ required: true, message: 'Vui lòng chọn khoa!' }]}>
              <Select
                value={selectedKhoa}
                onChange={handleKhoaChange}
                placeholder='Chọn khoa'
                loading={isLoadingKhoa}
                disabled={!khoaList || khoaList.length === 0}
                options={khoaList?.map((khoa) => ({
                  label: `${khoa.makh} - ${khoa.tenkh}`,
                  value: khoa.makh
                }))}
              />
            </Form.Item>

            <Form.Item label='Lớp' name='malop' rules={[{ required: true, message: 'Vui lòng chọn lớp!' }]}>
              <Select
                value={selectedLop}
                onChange={handleLopChange}
                placeholder='Chọn lớp'
                loading={isLoadingLop}
                disabled={!lopList || lopList.length === 0}
                options={lopList?.map((lop) => ({
                  label: `${lop.malop} - ${lop.tenlop}`,
                  value: lop.malop
                }))}
              />
            </Form.Item>

            <Form.Item label='Môn học' name='mamh' rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
              <Select
                value={selectedMonHoc}
                onChange={handleMonHocChange}
                placeholder='Chọn môn học'
                loading={isLoadingMonHoc}
                disabled={!monHocList || monHocList.length === 0}
                options={monHocList?.map((mh) => ({
                  label: `${mh.mamh} - ${mh.tenmh}`,
                  value: mh.mamh
                }))}
              />
            </Form.Item>

            <Form.Item
              label='Lần thi'
              name='lan'
              initialValue={1}
              rules={[{ required: true, message: 'Vui lòng chọn lần thi!' }]}
            >
              <InputNumber
                value={selectedLan}
                onChange={handleLanChange}
                placeholder='Lần thi'
                min={1}
                max={2}
                className='w-full'
              />
            </Form.Item>
          </div>

          <div className='flex justify-end gap-4'>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()} disabled={!shouldFetch}>
              Tải lại
            </Button>
            <Button type='primary' icon={<SearchOutlined />} onClick={handleViewDiem}>
              Xem điểm
            </Button>
          </div>
        </Form>
      </Card>

      {shouldFetch && (
        <Card
          title={
            <div className='flex justify-between items-center'>
              <span className='text-xl font-semibold'>Bảng điểm</span>
              {bangDiemList && bangDiemList.length > 0 && (
                <Space>
                  <span className='text-gray-600'>
                    Điểm TB: {(bangDiemList.reduce((sum, item) => sum + item.diem, 0) / bangDiemList.length).toFixed(2)}
                  </span>
                  <span className='text-gray-600'>|</span>
                  <span className='text-gray-600'>
                    Cao nhất: {Math.max(...bangDiemList.map((item) => item.diem)).toFixed(1)}
                  </span>
                  <span className='text-gray-600'>|</span>
                  <span className='text-gray-600'>
                    Thấp nhất: {Math.min(...bangDiemList.map((item) => item.diem)).toFixed(1)}
                  </span>
                </Space>
              )}
            </div>
          }
          className='shadow-lg'
        >
          {!selectedLop || !selectedMonHoc ? (
            <div className='text-center py-12 text-gray-500'>
              <p className='text-lg'>Vui lòng chọn đầy đủ thông tin và nhấn "Xem điểm"</p>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={sortedBangDiemList}
              loading={isLoadingBangDiem}
              rowKey='masv'
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng ${total} sinh viên`
              }}
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default BangDiemManagement;
