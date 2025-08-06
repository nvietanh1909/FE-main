import React, { useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FaHome } from 'react-icons/fa';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import ProcedureSection from '../components/ProcedureSection.tsx';

const dataDomestic = [
  { id: 1, title: 'Thủ tục 1', description: 'Báo cáo kết quả công tác', progress: 80 },
  { id: 2, title: 'Thủ tục 1', description: 'Báo cáo kết quả công tác', progress: 60 },
  { id: 3, title: 'Thủ tục 1', description: 'Báo cáo kết quả công tác', progress: 90 },
];
const dataForeign = [
  { id: 4, title: 'Thủ tục 1', description: 'Báo cáo kết quả công tác', progress: 30 },
  { id: 5, title: 'Thủ tục 1', description: 'Báo cáo kết quả công tác', progress: 50 },
  { id: 6, title: 'Thủ tục 1', description: 'Báo cáo kết quả công tác', progress: 20 },
];

export default function ProcedurePage() {
  nprogress.configure({ showSpinner: false });
  nprogress.start();

  useEffect(() => {
    nprogress.done();
  }, []);
  return (
    <div className="py-4 px-6">
      <Breadcrumbs separator=">" aria-label="breadcrumb" className="text-base mb-4">
        <Link
          underline="none"
          color="inherit"
          href="/"
          className="flex items-center gap-1"
        >
          <FaHome className="text-lg" />
          <span>Trang chủ</span>
        </Link>
        <Typography color="#2563eb" fontWeight={600}>
          Tra cứu thủ tục
        </Typography>
      </Breadcrumbs>
      <ProcedureSection
        title="Công tác phí trong nước"
        subtitle="Write something in this place"
        link="/procedures/all/domestic"
        data={dataDomestic}
      />
      <ProcedureSection
        title="Công tác phí nước ngoài"
        subtitle="Write something in this place"
        link="/procedures/all/foreign"
        data={dataForeign}
      />
    </div>
  );
} 