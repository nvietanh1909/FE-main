import React from 'react';
import { Breadcrumbs, Typography, Link } from '@mui/material';
import { FaHome } from 'react-icons/fa';

export default function AdminProcedurePage() {
    return (
      <div className="py-4 px-6"> 
        <Breadcrumbs separator=">" aria-label="breadcrumb" className="text-base mb-4">
          <Link
            underline="none"
            color="inherit"
            href="/admin"
            className="flex items-center gap-1"
          >
            <FaHome className="text-lg" />
            <span>Trang chủ</span>
          </Link>
          <Typography color="#2563eb" fontWeight={600}>
            Quản lý quy trình
          </Typography>
        </Breadcrumbs>
      </div>
    );
}
