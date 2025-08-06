import React, { useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { FaHome } from 'react-icons/fa';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { Box, Link, Button, InputBase, Grid } from '@mui/material';
import { Check, CheckCircle, Menu, Search } from '@mui/icons-material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StarIcon from '@mui/icons-material/Star';
import Welcome from "../components/Welcome.tsx";
import ProcedureCard from '@/features-user/dashboard/components/ProcedureCard.tsx';
import Progress from '@/features-user/dashboard/components/Progress.tsx';
import { useState } from 'react';


export default function DashboardPage() {
  nprogress.configure({ showSpinner: false });
  nprogress.start();

  useEffect(() => {
    nprogress.done();
  }, []);

  const statsCardData = [
    {
      icon: <Check sx={{ color: '#008000' }} />,
      title: 'Số thủ tục đã xong',
      count: 12,
      subText: '+2 thủ tục tuần này',
    },
    {
      icon: <FlashOnIcon sx={{ color: '#ff6b6b' }} />,
      title: 'Số thủ tục đang được xử lý',
      count: 8,
      subText: '+2 thủ tục tuần này',
    },
    {
      icon: <StarIcon sx={{ color: '#FFDD64' }} />,
      title: 'Số lượng câu hỏi',
      count: 24,
      subText: '+2 câu hỏi tuần này',
    },
  ];

  const procedures = [
    {
      title: 'Quy trình thanh toán hoạt động thường xuyên',
      description: 'Thông tin về lương và các khoản phụ cấp',
      date: 'Cập nhật: 01/01/2023',
    },
    {
      title: 'Quy trình thanh toán chi phí hoạt động chuyên môn',
      description: 'Chi tiết về các loại bảo hiểm và quyền lợi',
      date: 'Cập nhật: 15/02/2023',
    },
    {
      title: 'Quy trình thanh toán mua sắm tài sản, hàng hóa, dịch vụ',
      description: 'Thông tin nghỉ phép, tăng ca, lịch làm việc',
      date: 'Cập nhật: 10/03/2023',
    },
  ];

  const [searchTab, setSearchTab] = useState(0);
  const [searchMode, setSearchMode] = useState(0); // 0: thường, 1: thông minh

  return (
    <div className="py-4 px-6">
      <Breadcrumbs separator=">" aria-label="breadcrumb" className=" mb-4">
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
          Bảng điều khiển
        </Typography>
      </Breadcrumbs>


      {/* Phần nội dung dashboard */}
      <div className="flex flex-col gap-6 ">
        <Welcome name="An" notificationCount={1} />
        <Box sx={{ background: '#fff', borderRadius: 4, border: '1px solid #e5e7eb', p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Tra cứu tìm kiếm thủ tục
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2} sx={{ fontFamily: 'Roboto, sans-serif, arial', fontSize: '0.9rem' }}>
                Tìm kiếm thông tin với UET AIA
              </Typography>
            </Box>
            <Link href="/procedures" style={{ textDecoration: 'none', color: '#2563eb' }}>
              Xem tất cả 
            </Link>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, mt: 2 }}>
            <Button
              onClick={() => setSearchTab(0)}
              startIcon={<Menu />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
                px: 2.2,
                py: 1.1,
                color: searchTab === 0 ? '#2563eb' : '#6b7280',
                background: searchTab === 0 ? '#e8f0fe' : '#F3F4F6',
                borderRadius: 1.5,
                border: 'none',
                boxShadow: 'none',
                '&:hover': {
                  background: searchTab === 0 ? '#e8f0fe' : '#e5e7eb',
                }
              }}
            >
              Tất cả danh mục
            </Button>
            <Button
              onClick={() => setSearchTab(1)}
              startIcon={<Search />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
                px: 2.2,
                py: 1.1,
                color: searchTab === 1 ? '#2563eb' : '#6b7280',
                background: searchTab === 1 ? '#e8f0fe' : '#F3F4F6',
                borderRadius: 1.5,
                boxShadow: 'none',
                '&:hover': {
                  background: searchTab === 1 ? '#e8f0fe' : '#e5e7eb',
                }
              }}
            >
              Tìm kiếm nhanh
            </Button>
          </Box>
          {searchTab === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Danh sách quy trình và thủ tục thanh toán
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', mt: 2 }}>
                {procedures.map((proc, index) => (
                  <ProcedureCard
                    key={index}
                    title={proc.title}
                    description={proc.description}
                    date={proc.date}
                    onClick={() => console.log(`Clicked on ${proc.title}`)}
                  />
                ))}
              </Box>
            </Box>
          )}
          {searchTab === 1 && (
            <Box sx={{ mx: 'auto', background: '#fff', borderRadius: 3, border: '1px solid #e5e7eb', p: 3, mt: 2 }}>
              <Typography variant="h5" fontWeight={700} align="center" mb={1}>
                Tìm kiếm tài liệu
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" mb={2}>
                Sử dụng tìm kiếm thông thường hoặc tìm kiếm thông minh
              </Typography>
              <Box sx={{ display: 'flex', background: '#F3F4F6', borderRadius: 1.2, mb: 2, overflow: 'hidden' }}>
                <Button
                  startIcon={<Search />}
                  onClick={() => setSearchMode(0)}
                  sx={{
                    flex: 1,
                    background: searchMode === 0 ? '#2563eb' : '#f5f6fa',
                    color: searchMode === 0 ? '#fff' : '#222',
                    fontWeight: 600,
                    borderRadius: 0,
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontSize: 14,
                    px: 1.5,
                    py: 1,
                    '&:hover': { background: searchMode === 0 ? '#2563eb' : '#e5e7eb' },
                  }}
                >
                  Tìm kiếm thông thường
                </Button>
                <Button
                  startIcon={<FlashOnIcon />}
                  onClick={() => setSearchMode(1)}
                  sx={{
                    flex: 1,
                    background: searchMode === 1 ? '#2563eb' : '#f5f6fa',
                    color: searchMode === 1 ? '#fff' : '#222',
                    fontWeight: 600,
                    borderRadius: 0,
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontSize: 14,
                    px: 1.5,
                    py: 1,
                    '&:hover': { background: searchMode === 1 ? '#2563eb' : '#e5e7eb' },
                  }}
                >
                  Tìm kiếm thông minh
                </Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, background: '#fff', borderRadius: 2, border: '1px solid #E5E7EB', px: 1, py: 0.5 }}>
                <InputBase
                  placeholder="Mô tả nội dung bạn cần tìm"
                  sx={{
                    flex: 1,
                    fontSize: 16,
                    px: 1,
                    py: 0.5,
                  }}
                  inputProps={{ 'aria-label': 'search input' }}
                />
                <Button variant="contained" sx={{ minWidth: 40, minHeight: 40, borderRadius: 2, background: '#2563eb', p: 0 }}>
                  <Search sx={{ color: '#fff' }} />
                </Button>
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ mt: 2, background: '#fff', borderRadius: 4, border: '1px solid #e5e7eb', p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ fontFamily: 'Roboto, sans-serif, arial' }}>
                Lịch sử thủ tục
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2} sx={{ fontFamily: 'Roboto, sans-serif, arial', fontSize: '1rem' }}>
                Danh sách thủ tục của bạn đã tra cứu
              </Typography>
            </Box>
            <Link href="/procedures" style={{ textDecoration: 'none', color: '#2563eb' }}>
              Xem tất cả
            </Link>
          </Box>
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <Progress />
          </Box>
        </Box>
      </div>
    </div>
  );
}