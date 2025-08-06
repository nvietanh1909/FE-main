import React from 'react';
import { Breadcrumbs, Typography, Link } from '@mui/material';
import { FaHome } from 'react-icons/fa';

export default function AdminDocumentPage() {
    return (
      <div className="py-4 px-6">
        <Breadcrumbs sx={{fontSize: "14px"}} separator=">" aria-label="breadcrumb" className="text-base mb-4">
        <Link
          underline="none"
          color="inherit"
          href="/admin"
          className="flex items-center gap-1"
        >
          <FaHome className="text-lg" />
          <span>Trang chủ</span>
        </Link>
        <Typography sx={{fontSize: "14px"}} color="#2563eb" fontWeight={600}>
          Quản lý hồ sơ
        </Typography>
      </Breadcrumbs>
    </div>
    );
}
