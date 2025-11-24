import { SearchOutlined, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNotification } from '@app/context/notification-context';
import { useBaoCaoDangKy } from '@app/features/bao-cao-dang-ky/hooks';
import { BaoCaoDangKyItem } from '@app/shared/types/bao-cao-dang-ky.type';
import { Button, Card, DatePicker, Form, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const { RangePicker } = DatePicker;

const BaoCaoDangKyManagement = () => {
  const [form] = Form.useForm();
  const notification = useNotification();

  const [tungay, setTungay] = useState<string>('');
  const [denngay, setDenngay] = useState<string>('');
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: baoCaoData, isLoading, refetch } = useBaoCaoDangKy({ tungay, denngay }, shouldFetch);

  const handleSearch = () => {
    form.validateFields().then((values) => {
      if (!values.dateRange || values.dateRange.length !== 2) {
        notification.showNotification('warning', 'Cảnh báo', 'Vui lòng chọn khoảng thời gian!');
        return;
      }

      const [start, end] = values.dateRange;
      setTungay(start.format('YYYY-MM-DD'));
      setDenngay(end.format('YYYY-MM-DD'));
      setShouldFetch(true);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 60,
      align: 'center' as const
    },
    {
      title: 'TÊN LỚP',
      dataIndex: 'tenlop',
      key: 'tenlop',
      width: 150
    },
    {
      title: 'TÊN MÔN HỌC',
      dataIndex: 'tenmh',
      key: 'tenmh',
      width: 200
    },
    {
      title: 'GIẢNG VIÊN ĐĂNG KÝ',
      dataIndex: 'tenGiangVien',
      key: 'tenGiangVien',
      width: 200
    },
    {
      title: 'SỐ CÂU THI',
      dataIndex: 'socauthi',
      key: 'socauthi',
      width: 100,
      align: 'center' as const
    },
    {
      title: 'NGÀY THI',
      dataIndex: 'ngaythi',
      key: 'ngaythi',
      width: 150,
      render: (date: string) => (date ? dayjs(date).format('DD/MM/YYYY') : '')
    },
    {
      title: 'ĐÃ THI (X)',
      dataIndex: 'dathi',
      key: 'dathi',
      width: 100,
      align: 'center' as const,
      render: (dathi: boolean) => <span className='text-lg font-bold'>{dathi ? 'X' : ''}</span>
    },
    {
      title: 'GHI CHÚ',
      dataIndex: 'ghichu',
      key: 'ghichu',
      ellipsis: true
    }
  ];

  const renderCoSoTable = (title: string, data: BaoCaoDangKyItem[], tongSoLuot: number) => {
    return (
      <Card
        title={
          <div className='text-center'>
            <h3 className='text-xl font-bold uppercase'>{title}</h3>
            <p className='text-base font-normal mt-2'>
              TỪ NGÀY {tungay ? dayjs(tungay).format('DD/MM/YYYY') : ''} ĐÉN NGÀY{' '}
              {denngay ? dayjs(denngay).format('DD/MM/YYYY') : ''}
            </p>
          </div>
        }
        className='!mb-6 shadow-lg print-section'
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={isLoading}
          rowKey={(record) => `${record.stt}`}
          pagination={false}
          bordered
          size='middle'
          footer={() => <div className='text-base font-semibold'>Tổng cộng số lượt đăng ký: {tongSoLuot}</div>}
        />
      </Card>
    );
  };

  return (
    <div className='!p-6'>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-section, .print-section * {
              visibility: visible;
            }
            .print-section {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            @page {
              size: A4 landscape;
              margin: 1cm;
            }
          }
        `}
      </style>

      <div className='flex flex-col gap-6'>
        <h2 className='text-2xl font-semibold' style={{ marginBottom: 24 }}>
          Báo cáo đăng ký thi trắc nghiệm
        </h2>

        <Card className='!mb-6 shadow-lg'>
          <Form form={form} layout='vertical'>
            <Form.Item
              label='Khoảng thời gian'
              name='dateRange'
              rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian!' }]}
            >
              <RangePicker format='DD/MM/YYYY' placeholder={['Từ ngày', 'Đến ngày']} style={{ width: 300 }} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type='primary' icon={<SearchOutlined />} onClick={handleSearch} loading={isLoading}>
                  Xem báo cáo
                </Button>
                <Button icon={<ReloadOutlined />} onClick={() => refetch()} disabled={!shouldFetch}>
                  Tải lại
                </Button>
                <Button icon={<PrinterOutlined />} onClick={handlePrint} disabled={!baoCaoData}>
                  In báo cáo
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {shouldFetch && !baoCaoData?.coSo1 && !baoCaoData?.coSo2 && !isLoading && (
        <Card className='shadow-lg'>
          <div className='text-center py-12 text-gray-500'>
            <p className='text-lg'>Không có dữ liệu trong khoảng thời gian đã chọn</p>
          </div>
        </Card>
      )}

      {baoCaoData && (
        <>
          {baoCaoData.coSo1 &&
            baoCaoData.coSo1.danhSach.length > 0 &&
            renderCoSoTable(
              `DANH SÁCH ĐĂNG KÝ THI TRẮC NGHIỆM ${baoCaoData.coSo1.tenCoSo}`,
              baoCaoData.coSo1.danhSach,
              baoCaoData.coSo1.tongSoLuot
            )}

          {baoCaoData.coSo2 &&
            baoCaoData.coSo2.danhSach.length > 0 &&
            renderCoSoTable(
              `DANH SÁCH ĐĂNG KÝ THI TRẮC NGHIỆM ${baoCaoData.coSo2.tenCoSo}`,
              baoCaoData.coSo2.danhSach,
              baoCaoData.coSo2.tongSoLuot
            )}
        </>
      )}
    </div>
  );
};

export default BaoCaoDangKyManagement;
