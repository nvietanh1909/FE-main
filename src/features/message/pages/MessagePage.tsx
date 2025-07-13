import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FaHome } from 'react-icons/fa';

export default function MessagePage() {
  return (
    <div className="p-4">
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