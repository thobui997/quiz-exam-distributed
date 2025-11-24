import { CauHoiThi, DapAnDaChon } from '@app/shared/types/thi-trac-nghiem.type';
import { Button, Card, Progress, Result, Space, Table } from 'antd';
import { CheckCircle, Home, RotateCcw, XCircle } from 'lucide-react';
import { useMemo } from 'react';

interface KetQuaThiProps {
  cauHoiList: CauHoiThi[];
  dapAnDaChon: DapAnDaChon[];
  diem: number;
  onLamLai: () => void;
  onQuayVe: () => void;
}

const KetQuaThi = ({ cauHoiList, dapAnDaChon, diem, onLamLai, onQuayVe }: KetQuaThiProps) => {
  const ketQuaChiTiet = useMemo(() => {
    return cauHoiList.map((ch, index) => {
      const dapAnChon = dapAnDaChon.find((da) => da.cauhoi === ch.cauhoi);
      const dung = dapAnChon?.dapan === ch.dapan;

      return {
        key: index,
        stt: index + 1,
        cauhoi: ch.cauhoi,
        noidung: ch.noidung,
        dapAnDung: ch.dapan,
        dapAnChon: dapAnChon?.dapan || 'Chưa trả lời',
        ketQua: dung
      };
    });
  }, [cauHoiList, dapAnDaChon]);

  const soCauDung = ketQuaChiTiet.filter((kq) => kq.ketQua).length;
  const tyLeDung = Math.round((soCauDung / cauHoiList.length) * 100);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 60,
      align: 'center' as const
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'noidung',
      key: 'noidung',
      ellipsis: true
    },
    {
      title: 'Đáp án đúng',
      dataIndex: 'dapAnDung',
      key: 'dapAnDung',
      width: 100,
      align: 'center' as const,
      render: (text: string) => <span className='font-bold text-green-600'>{text}</span>
    },
    {
      title: 'Đáp án đã chọn',
      dataIndex: 'dapAnChon',
      key: 'dapAnChon',
      width: 120,
      align: 'center' as const,
      render: (text: string, record: any) => (
        <span className={record.ketQua ? 'font-bold text-green-600' : 'font-bold text-red-600'}>{text}</span>
      )
    },
    {
      title: 'Kết quả',
      dataIndex: 'ketQua',
      key: 'ketQua',
      width: 100,
      align: 'center' as const,
      render: (dung: boolean) =>
        dung ? <CheckCircle className='text-green-500' size={24} /> : <XCircle className='text-red-500' size={24} />
    }
  ];

  return (
    <div className='!p-6'>
      <Card className='shadow-lg !mb-6'>
        <Result
          status={diem >= 5 ? 'success' : 'error'}
          title={
            <div>
              <p className='text-3xl font-bold !mb-2'>
                Điểm: <span className={diem >= 5 ? 'text-green-600' : 'text-red-600'}>{diem.toFixed(1)}</span>
              </p>
              <p className='text-xl text-gray-600'>
                Số câu đúng: {soCauDung}/{cauHoiList.length}
              </p>
            </div>
          }
          subTitle={
            <div className='!mt-4'>
              <Progress
                percent={tyLeDung}
                strokeColor={tyLeDung >= 50 ? '#52c41a' : '#ff4d4f'}
                status={tyLeDung >= 50 ? 'success' : 'exception'}
              />
            </div>
          }
          extra={
            <Space size='large' className='!mt-4'>
              <Button size='large' icon={<RotateCcw size={20} />} onClick={onLamLai}>
                Làm lại
              </Button>
              <Button type='primary' size='large' icon={<Home size={20} />} onClick={onQuayVe}>
                Quay về trang chủ
              </Button>
            </Space>
          }
        />
      </Card>

      <Card title='Chi tiết kết quả' className='shadow-lg'>
        <Table
          columns={columns}
          dataSource={ketQuaChiTiet}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} câu hỏi`
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default KetQuaThi;
