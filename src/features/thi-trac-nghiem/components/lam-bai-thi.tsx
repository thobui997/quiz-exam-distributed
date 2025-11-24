import { CauHoiThi, DapAnDaChon, ThongTinThi } from '@app/shared/types/thi-trac-nghiem.type';
import { Button, Card, Progress, Radio, Space, Statistic, Steps } from 'antd';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

const { Countdown } = Statistic;

interface LamBaiThiProps {
  cauHoiList: CauHoiThi[];
  thongTinThi: ThongTinThi;
  onSubmit: (dapAnList: DapAnDaChon[]) => void;
}

const LamBaiThi = ({ cauHoiList, thongTinThi, onSubmit }: LamBaiThiProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dapAnDaChon, setDapAnDaChon] = useState<DapAnDaChon[]>([]);
  const [deadline, setDeadline] = useState<number>(Date.now() + thongTinThi.thoigian * 60 * 1000);

  useEffect(() => {
    setDeadline(Date.now() + thongTinThi.thoigian * 60 * 1000);
  }, [thongTinThi.thoigian]);

  const currentCauHoi = cauHoiList[currentIndex];

  const handleChonDapAn = (dapan: string) => {
    const existingIndex = dapAnDaChon.findIndex((da) => da.cauhoi === currentCauHoi.cauhoi);

    if (existingIndex >= 0) {
      const newDapAn = [...dapAnDaChon];
      newDapAn[existingIndex] = { cauhoi: currentCauHoi.cauhoi, dapan };
      setDapAnDaChon(newDapAn);
    } else {
      setDapAnDaChon([...dapAnDaChon, { cauhoi: currentCauHoi.cauhoi, dapan }]);
    }
  };

  const getDapAnDaChon = (cauhoi: number): string | undefined => {
    return dapAnDaChon.find((da) => da.cauhoi === cauhoi)?.dapan;
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < cauHoiList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(dapAnDaChon);
  };

  const handleTimeUp = () => {
    onSubmit(dapAnDaChon);
  };

  const getStepStatus = (index: number) => {
    if (index === currentIndex) return 'process';
    if (getDapAnDaChon(cauHoiList[index].cauhoi)) return 'finish';
    return 'wait';
  };

  return (
    <div className='!p-6'>
      <div className='grid grid-cols-4 gap-6'>
        <div className='col-span-3'>
          <Card
            title={
              <div className='flex justify-between items-center'>
                <span className='text-xl font-semibold'>
                  Câu {currentIndex + 1}/{cauHoiList.length}
                </span>
                <Countdown
                  title='Thời gian còn lại'
                  value={deadline}
                  onFinish={handleTimeUp}
                  format='mm:ss'
                  valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                />
              </div>
            }
            className='shadow-lg min-h-[500px]'
          >
            <div className='!mb-6'>
              <p className='text-lg font-medium !mb-4'>{currentCauHoi.noidung}</p>

              <Radio.Group
                value={getDapAnDaChon(currentCauHoi.cauhoi)}
                onChange={(e) => handleChonDapAn(e.target.value)}
                className='w-full'
              >
                <Space direction='vertical' className='w-full' size='large'>
                  <Radio value='A' className='text-base !p-3 border rounded hover:bg-blue-50 w-full'>
                    <span className='font-medium'>A. </span>
                    {currentCauHoi.a}
                  </Radio>
                  <Radio value='B' className='text-base !p-3 border rounded hover:bg-blue-50 w-full'>
                    <span className='font-medium'>B. </span>
                    {currentCauHoi.b}
                  </Radio>
                  <Radio value='C' className='text-base !p-3 border rounded hover:bg-blue-50 w-full'>
                    <span className='font-medium'>C. </span>
                    {currentCauHoi.c}
                  </Radio>
                  <Radio value='D' className='text-base !p-3 border rounded hover:bg-blue-50 w-full'>
                    <span className='font-medium'>D. </span>
                    {currentCauHoi.d}
                  </Radio>
                </Space>
              </Radio.Group>
            </div>

            <div className='flex justify-between items-center !mt-8'>
              <Button
                size='large'
                icon={<ArrowLeft size={20} />}
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                Câu trước
              </Button>

              <Button type='primary' size='large' danger icon={<Send size={20} />} onClick={handleSubmit}>
                Nộp bài
              </Button>

              <Button
                size='large'
                icon={<ArrowRight size={20} />}
                iconPosition='end'
                onClick={handleNext}
                disabled={currentIndex === cauHoiList.length - 1}
              >
                Câu sau
              </Button>
            </div>
          </Card>
        </div>

        <div className='col-span-1'>
          <Card title='Danh sách câu hỏi' className='shadow-lg'>
            <div className='!mb-4'>
              <Progress
                percent={Math.round((dapAnDaChon.length / cauHoiList.length) * 100)}
                status='active'
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068'
                }}
              />
              <p className='text-center text-gray-600 !mt-2'>
                Đã làm: {dapAnDaChon.length}/{cauHoiList.length}
              </p>
            </div>

            <Steps
              direction='vertical'
              size='small'
              current={currentIndex}
              items={cauHoiList.map((_, index) => ({
                title: `Câu ${index + 1}`,
                status: getStepStatus(index),
                className: 'cursor-pointer',
                onClick: () => setCurrentIndex(index)
              }))}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LamBaiThi;
