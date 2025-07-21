import React, { useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FaHome } from 'react-icons/fa';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

export default function MessagePage() {
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
          href="/dashboard"
          className="flex items-center gap-1"
        >
          <FaHome className="text-lg" />
          <span>Trang chủ</span>
        </Link>
        <Typography color="#2563eb" fontWeight={600}>
          Tin nhắn
        </Typography>
      </Breadcrumbs>


      {/* Phần nội dung tin nhắn */}
      <div>
        Đây là nội dung tin nhắn
      </div>

    </div>
  );
} 