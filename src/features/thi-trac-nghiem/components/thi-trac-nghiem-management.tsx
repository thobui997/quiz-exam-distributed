import { useNotification } from '@app/context/notification-context';
import { useLuuDiemThi } from '@app/features/thi-trac-nghiem/hooks';
import KetQuaThi from '@app/features/thi-trac-nghiem/components/ket-qua-thi';
import LamBaiThi from '@app/features/thi-trac-nghiem/components/lam-bai-thi';
import ThongTinThiForm from '@app/features/thi-trac-nghiem/components/thong-tin-thi-form';
import { CauHoiThi, DapAnDaChon, ThongTinThi } from '@app/shared/types/thi-trac-nghiem.type';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router';

type BuocThi = 'thong-tin' | 'lam-bai' | 'ket-qua';

const ThiTracNghiemManagement = () => {
  const [buocHienTai, setBuocHienTai] = useState<BuocThi>('thong-tin');
  const [cauHoiList, setCauHoiList] = useState<CauHoiThi[]>([]);
  const [thongTinThi, setThongTinThi] = useState<ThongTinThi | null>(null);
  const [dapAnDaChon, setDapAnDaChon] = useState<DapAnDaChon[]>([]);
  const [diem, setDiem] = useState<number>(0);
  const notification = useNotification();
  const navigate = useNavigate();

  const luuDiemThiMutation = useLuuDiemThi({
    onSuccess: (data) => {
      if (data.status === 'SUCCESS') {
        notification.showNotification('success', 'Thành công', 'Đã lưu điểm thi thành công!');
      } else {
        notification.showNotification('error', 'Cảnh báo', 'Không thể lưu điểm: ' + data.message);
      }
    },
    onError: (error: any) => {
      notification.showNotification(
        'error',
        'Thất bại',
        error?.response?.data?.message || 'Có lỗi xảy ra khi lưu điểm'
      );
    }
  });

  const handleStartExam = (danhSachCauHoi: CauHoiThi[], thongTin: ThongTinThi) => {
    setCauHoiList(danhSachCauHoi);
    setThongTinThi(thongTin);
    setBuocHienTai('lam-bai');
  };

  const handleSubmitExam = (dapAnList: DapAnDaChon[]) => {
    Modal.confirm({
      title: 'Xác nhận nộp bài',
      content: `Bạn đã trả lời ${dapAnList.length}/${cauHoiList.length} câu hỏi. Bạn có chắc chắn muốn nộp bài?`,
      okText: 'Nộp bài',
      cancelText: 'Hủy',
      onOk: () => {
        setDapAnDaChon(dapAnList);
        chamDiem(dapAnList);
      }
    });
  };

  const chamDiem = (dapAnList: DapAnDaChon[]) => {
    let soCauDung = 0;

    cauHoiList.forEach((cauHoi) => {
      const dapAn = dapAnList.find((da) => da.cauhoi === cauHoi.cauhoi);
      if (dapAn && dapAn.dapan === cauHoi.dapan) {
        soCauDung++;
      }
    });

    const diemTinh = (soCauDung / cauHoiList.length) * 10;
    setDiem(diemTinh);

    if (thongTinThi) {
      luuDiemThiMutation.mutate({
        masv: thongTinThi.masv,
        malop: thongTinThi.malop,
        mamh: thongTinThi.mamh,
        lan: thongTinThi.lan,
        ngaythi: dayjs().format('YYYY-MM-DD'),
        diem: diemTinh,
        macs: thongTinThi.macs
      });
    }

    setBuocHienTai('ket-qua');
  };

  const handleLamLai = () => {
    setBuocHienTai('thong-tin');
    setCauHoiList([]);
    setThongTinThi(null);
    setDapAnDaChon([]);
    setDiem(0);
  };

  const handleQuayVe = () => {
    navigate('/');
  };

  return (
    <div>
      {buocHienTai === 'thong-tin' && <ThongTinThiForm onStartExam={handleStartExam} />}

      {buocHienTai === 'lam-bai' && thongTinThi && (
        <LamBaiThi cauHoiList={cauHoiList} thongTinThi={thongTinThi} onSubmit={handleSubmitExam} />
      )}

      {buocHienTai === 'ket-qua' && (
        <KetQuaThi
          cauHoiList={cauHoiList}
          dapAnDaChon={dapAnDaChon}
          diem={diem}
          onLamLai={handleLamLai}
          onQuayVe={handleQuayVe}
        />
      )}
    </div>
  );
};

export default ThiTracNghiemManagement;
