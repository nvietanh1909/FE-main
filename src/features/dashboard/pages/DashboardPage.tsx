import React, { useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { FaHome } from 'react-icons/fa';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { Grid, Box, Link, Button, InputBase, Paper } from '@mui/material';
import StatsCard from '@/components/StatsCard.tsx';
import { CheckCircle, Menu, Search } from '@mui/icons-material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StarIcon from '@mui/icons-material/Star';
import Welcome from "../../../components/Welcome.tsx";
import ProcedureCard from '@/components/ProcedureCard.tsx';
import Progress from '@/components/Progress.tsx';

export default function DashboardPage() {
  nprogress.configure({ showSpinner: false });
  nprogress.start();

  useEffect(() => {
    nprogress.done();
  }, []);

  const statsCardData = [
    {
      icon: <CheckCircle sx={{ color: 'green' }} />,
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
      icon: <StarIcon sx={{ color: '#f5c518' }} />,
      title: 'Số lượng câu hỏi',
      count: 24,
      subText: '+2 câu hỏi tuần này',
    },
  ];

  const procedures = [
    {
      title: 'Lương và Phụ cấp',
      description: 'Thông tin về lương và các khoản phụ cấp',
      date: 'Cập nhật: 01/01/2023',
    },
    {
      title: 'Bảo hiểm xã hội',
      description: 'Chi tiết về các loại bảo hiểm và quyền lợi',
      date: 'Cập nhật: 15/02/2023',
    },
    {
      title: 'Nghỉ phép & Thời gian làm việc',
      description: 'Thông tin nghỉ phép, tăng ca, lịch làm việc',
      date: 'Cập nhật: 10/03/2023',
    },
  ];

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
          Bảng điều khiển
        </Typography>
      </Breadcrumbs>


      {/* Phần nội dung dashboard */}
      <div>
        <Welcome name="An" notificationCount={1} />
        <Grid container spacing={3}>
          {statsCardData.map((card, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <StatsCard
                icon={card.icon}
                title={card.title}
                count={card.count}
                subText={card.subText}
              />
            </Grid>
          ))}
        </Grid>
        <Box>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Box>
              <Typography variant="h6" fontWeight={600} mt={4}>
                Tra cứu tìm kiếm thủ tục
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Tìm kiếm thông tin với UET AIA
              </Typography>
            </Box>
            <Link href="/procedures" style={{ textDecoration: 'none', color: '#2563eb' }}>
              Xem tất cả  {'>'}
            </Link>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Button variant="outlined" startIcon={<Menu />} autoCapitalize='none' sx={{ mt: 2 }}>
              Tất cả danh mục
            </Button>
            <Button
              component="form"
              startIcon={<Search />}
              sx={{ display: 'flex', alignItems: 'center', mt: 2, }}
            >
              <InputBase
                placeholder="Tìm kiếm"
                inputProps={{ 'aria-label': 'search google maps' }}
              />
            </Button>
          </Box>
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={600} mt={4}>
            Danh mục thủ tục
          </Typography>
          <Box sx={{ mt: 2 }}>
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
      </div>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Box>
          <Typography variant="h6" fontWeight={600} mt={4}>
            Lich sử thủ tục
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Danh sách thủ tục của bạn đã tra cứu
          </Typography>
        </Box>
        <Link href="/procedures" style={{ textDecoration: 'none', color: '#2563eb' }}>
          Xem tất cả  {'>'}
        </Link>
      </Box>
      <Box>
        <Progress />
      </Box>
    </div>
  );
}