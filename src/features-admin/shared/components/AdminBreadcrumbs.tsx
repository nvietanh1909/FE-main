import React from 'react';
import { Breadcrumbs, Typography, Link } from '@mui/material';
import { FaHome } from 'react-icons/fa';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function AdminBreadcrumbs({ items }: AdminBreadcrumbsProps) {
  return (
    <Breadcrumbs sx={{ fontSize: "14px" }} separator=">" aria-label="breadcrumb" className="text-base mb-4">
      <Link
        underline="none"
        color="inherit"
        href="/admin"
        className="flex items-center gap-1"
      >
        <FaHome className="text-lg" />
        <span>Trang chủ</span>
      </Link>
      {items.map((item, index) => (
        index === items.length - 1 ? (
          <Typography key={index} sx={{ fontSize: "14px" }} color="#2563eb" fontWeight={600}>
            {item.label}
          </Typography>
        ) : (
          <Link
            key={index}
            underline="none"
            color="inherit"
            href={item.href}
            sx={{ fontSize: "14px" }}
          >
            {item.label}
          </Link>
        )
      ))}
    </Breadcrumbs>
  );
}
