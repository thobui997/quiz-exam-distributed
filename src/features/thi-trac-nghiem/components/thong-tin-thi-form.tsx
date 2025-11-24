import { useNotification } from '@app/context/notification-context';
import { useGetBoDeThi } from '@app/features/thi-trac-nghiem/hooks';
import { useGiaoVienList } from '@app/features/giao-vien/hooks';
import { useMonHocList } from '@app/features/mon-hoc/hooks';
import { CauHoiThi, ThongTinThi } from '@app/shared/types/thi-trac-nghiem.type';
import { Button, Card, Form, InputNumber, Select } from 'antd';
import { useState } from 'react';

interface ThongTinThiFormProps {
  onStartExam: (cauHoiList: CauHoiThi[], thongTinThi: ThongTinThi) => void;
}

const ThongTinThiForm = ({ onStartExam }: ThongTinThiFormProps) => {
  const [form] = Form.useForm();
  const [selectedCS, setSelectedCS] = useState<string>('CS1');
  const notification = useNotification();

  const { data: giaoVienList, isLoading: isLoadingGiaoVien } = useGiaoVienList(selectedCS);
  const { data: monHocList, isLoading: isLoadingMonHoc } = useMonHocList();

  const getBoDeThiMutation = useGetBoDeThi({
    onSuccess: (data) => {
      if (data && data.length > 0) {
        const values = form.getFieldsValue();
        const thongTinThi: ThongTinThi = {
          magv: values.magv,
          mamh: values.mamh,
          trinhdo: values.trinhdo,
          socauthi: values.socauthi,
          macs: selectedCS,
          thoigian: values.thoigian,
          masv: values.masv,
          malop: values.malop,
          lan: values.lan
        };
        onStartExam(data, thongTinThi);
        notification.showNotification('success', 'Thành công', 'Đã tải đề thi thành công!');
      } else {
        notification.showNotification('error', 'Thất bại', 'Không tìm thấy câu hỏi phù hợp!');
      }
    },
    onError: (error: any) => {
      notification.showNotification('error', 'Thất bại', error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const handleStartExam = () => {
    form.validateFields().then((values) => {
      getBoDeThiMutation.mutate({
        magv: values.magv,
        mamh: values.mamh,
        trinhdo: values.trinhdo,
        socauthi: values.socauthi,
        macs: selectedCS
      });
    });
  };

  return (
    <div className='flex justify-center items-center min-h-[80vh]'>
      <Card title='Thông tin bài thi' className='w-full max-w-2xl shadow-lg'>
        <Form form={form} layout='vertical' size='large'>
          <Form.Item label='Cơ sở'>
            <Select
              value={selectedCS}
              onChange={setSelectedCS}
              options={[
                { label: 'Cơ sở 1', value: 'CS1' },
                { label: 'Cơ sở 2', value: 'CS2' }
              ]}
            />
          </Form.Item>

          <Form.Item
            label='Mã sinh viên'
            name='masv'
            rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
          >
            <Select
              placeholder='Chọn mã sinh viên'
              showSearch
              optionFilterProp='label'
              options={[
                { label: 'SV001 - Nguyễn Văn A', value: 'SV001' },
                { label: 'SV002 - Trần Thị B', value: 'SV002' }
              ]}
            />
          </Form.Item>

          <Form.Item label='Mã lớp' name='malop' rules={[{ required: true, message: 'Vui lòng nhập mã lớp!' }]}>
            <Select
              placeholder='Chọn lớp'
              options={[
                { label: 'L001 - Lớp CNTT K1', value: 'L001' },
                { label: 'L002 - Lớp CNTT K2', value: 'L002' }
              ]}
            />
          </Form.Item>

          <Form.Item label='Giảng viên' name='magv' rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}>
            <Select
              placeholder='Chọn giảng viên'
              loading={isLoadingGiaoVien}
              disabled={!giaoVienList || giaoVienList.length === 0}
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

          <div className='grid grid-cols-3 gap-4'>
            <Form.Item
              label='Số câu thi'
              name='socauthi'
              rules={[
                { required: true, message: 'Vui lòng nhập số câu thi!' },
                { type: 'number', min: 10, max: 100, message: 'Số câu thi từ 10-100!' }
              ]}
            >
              <InputNumber placeholder='10-100' className='w-full' min={10} max={100} />
            </Form.Item>

            <Form.Item
              label='Thời gian (phút)'
              name='thoigian'
              rules={[
                { required: true, message: 'Vui lòng nhập thời gian!' },
                { type: 'number', min: 2, max: 60, message: 'Thời gian từ 2-60 phút!' }
              ]}
            >
              <InputNumber placeholder='2-60' className='w-full' min={2} max={60} />
            </Form.Item>

            <Form.Item
              label='Lần thi'
              name='lan'
              rules={[
                { required: true, message: 'Vui lòng nhập lần thi!' },
                { type: 'number', min: 1, max: 2, message: 'Lần thi từ 1-2!' }
              ]}
            >
              <InputNumber placeholder='1-2' className='w-full' min={1} max={2} />
            </Form.Item>
          </div>

          <Button
            type='primary'
            size='large'
            className='w-full !mt-4'
            onClick={handleStartExam}
            loading={getBoDeThiMutation.isPending}
          >
            BẮT ĐẦU THI
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ThongTinThiForm;
