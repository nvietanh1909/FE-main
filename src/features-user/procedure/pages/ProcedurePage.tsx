import React, { useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { FaHome } from 'react-icons/fa';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import ProcedureSection from '../components/ProcedureSection.tsx';

const dataDomestic = [
  { id: 1, title: 'Thanh toán chi phí đi lại', description: 'Quy trình thanh toán chi phí đi lại trong công tác nội địa', progress: 85 },
  { id: 2, title: 'Thanh toán tiền ăn ở', description: 'Thanh toán chi phí ăn uống và lưu trú khi công tác', progress: 60 },
  { id: 3, title: 'Thanh toán phụ cấp công tác', description: 'Xử lý thanh toán các khoản phụ cấp công tác trong nước', progress: 92 },
];
const dataForeign = [
  { id: 4, title: 'Visa và hộ chiếu', description: 'Quy trình xin visa và làm hộ chiếu cho công tác nước ngoài', progress: 35 },
  { id: 5, title: 'Vé máy bay quốc tế', description: 'Đặt và thanh toán vé máy bay cho chuyến công tác nước ngoài', progress: 70 },
  { id: 6, title: 'Bảo hiểm du lịch', description: 'Mua bảo hiểm du lịch quốc tế cho nhân viên', progress: 25 },
];

export default function ProcedurePage() {
  nprogress.configure({ showSpinner: false });
  nprogress.start();

  useEffect(() => {
    nprogress.done();
  }, []);
  return (
    <div className="py-4 px-6">
      <Breadcrumbs sx={{fontSize: "14px"}} separator=">" aria-label="breadcrumb" className="text-base mb-4">
        <Link
          underline="none"
          color="inherit"
          href="/"
          className="flex items-center gap-1"
        >
          <FaHome className="text-lg" />
          <span>Trang chủ</span>
        </Link>
        <Typography sx={{fontSize: "14px"}} color="#2563eb" fontWeight={600}>
          Tra cứu thủ tục
        </Typography>
      </Breadcrumbs>
      <Box sx={{ 
        p: 3, 
        borderRadius: 3, 
        border: '1px solid #e5e7eb', 
        mt: 2,
        backgroundColor: '#fff'
      }}>
        <ProcedureSection
        title="Công tác phí trong nước"
        subtitle="Tra cứu quy trình và kết quả các thủ tục thanh toán công tác phí trong nước"
        link="/procedures/all/domestic"
        data={dataDomestic}
      />
      </Box>

      <Box sx={{ 
        p: 3, 
        borderRadius: 3, 
        border: '1px solid #e5e7eb', 
        mt: 2,
        backgroundColor: '#fff'
      }}>
        <ProcedureSection
          title="Công tác phí nước ngoài"
          subtitle="Tra cứu quy trình và kết quả các thủ tục thanh toán công tác phí đi công tác nước ngoài"
          link="/procedures/all/foreign"
          data={dataForeign}
        />
      </Box>
    </div>
  );
} 