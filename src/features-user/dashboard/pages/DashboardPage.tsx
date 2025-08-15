import React, { useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { FaHome, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { Box, Link, Button, InputBase, Collapse, Divider } from '@mui/material';
import { Check, CheckCircle, Menu, Search, History, AccessTime } from '@mui/icons-material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StarIcon from '@mui/icons-material/Star';
import Welcome from "../components/Welcome.tsx";
import ProcedureCard from '@/features-user/dashboard/components/ProcedureCard.tsx';
import { useState } from 'react';
import { fontSize } from '@mui/system';


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
      id: 1,
      title: 'QUY TRÌNH THANH TOÁN HOẠT ĐỘNG THƯỜNG XUYÊN',
      description: 'Thông tin về lương và các khoản phụ cấp',
      date: 'Tháng 11/2024',
      isExpanded: false,
      subItems: [
        '1. Công tác phí trong nước',
        '2. Công tác phí nước ngoài',
        '3. Hội nghị, hội thảo trong nước',
        '4. Hội nghị, hội thảo quốc tế tại Việt Nam do Nhà trường chủ trì tổ chức'
      ]
    },
    {
      id: 2,
      title: 'QUY TRÌNH THANH TOÁN CHI PHÍ HOẠT ĐỘNG CHUYÊN MÔN',
      description: 'Thông tin về lương và các khoản phụ cấp',
      date: 'Tháng 11/2024',
      isExpanded: false,
      subItems: []
    },
    {
      id: 3,
      title: 'QUY TRÌNH THANH TOÁN MUA SẮM TÀI SẢN, HÀNG HÓA, DỊCH VỤ',
      description: 'Thông tin về lương và các khoản phụ cấp',
      date: 'Tháng 11/2024',
      isExpanded: false,
      subItems: []
    },
  ];

  const [searchTab, setSearchTab] = useState(0);
  const [searchMode, setSearchMode] = useState(0); // 0: thường, 1: thông minh
  const [expandedProcedures, setExpandedProcedures] = useState<number[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'Quy trình thanh toán công tác phí',
    'Hồ sơ xin nghỉ phép',
    'Thủ tục mua sắm tài sản',
    'Báo cáo kết quả công việc',
    'Đăng ký tham gia hội thảo'
  ]);

  const toggleProcedure = (id: number) => {
    setExpandedProcedures(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="py-4 px-6">
      <Breadcrumbs sx={{ fontSize: "14px" }} separator=">" aria-label="breadcrumb" className=" mb-4">
        <Link
          underline="none"
          color="inherit"
          href="/"
          className="flex items-center gap-1"
        >
          <FaHome className="text-lg" />
          <span>Trang chủ</span>
        </Link>
        <Typography sx={{ fontSize: "14px" }} color="#2563eb" fontWeight={600}>
          Bảng điều khiển
        </Typography>
      </Breadcrumbs>


      {/* Phần nội dung dashboard */}
      <div className="flex flex-col gap-6 ">
        <Welcome name="An" notificationCount={1} />
        <Box sx={{ background: '#fff', borderRadius: 4, border: '1px solid #e5e7eb', p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontSize: "1.4rem" }} fontWeight={600}>
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {procedures.map((proc) => (
                  <Box key={proc.id} sx={{ mb: 1 }}>
                    {/* Main Card */}
                    <Box
                      onClick={() => proc.subItems.length > 0 && toggleProcedure(proc.id)}
                      sx={{
                        background: '#fff',
                        borderRadius: 2,
                        border: '1px solid #e0e7ff',
                        borderLeft: '4px solid #2669FC',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        cursor: proc.subItems.length > 0 ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: proc.subItems.length > 0 ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              sx={{
                                color: '#1e40af',
                                fontSize: '1rem',
                                mb: 1,
                                textTransform: 'uppercase',
                                letterSpacing: '0.02em'
                              }}
                            >
                              {proc.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: '0.85rem',
                                color: '#6b7280',
                                mb: 2
                              }}
                            >
                              {proc.description}
                            </Typography>
                            <Box sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              background: '#dbeafe',
                              color: '#1e40af',
                              px: 2,
                              py: 0.5,
                              borderRadius: 100,
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}>
                              {proc.date}
                            </Box>
                          </Box>
                          {proc.subItems.length > 0 && (
                            <Box sx={{
                              ml: 3,
                              color: expandedProcedures.includes(proc.id) ? '#1e40af' : '#9ca3af',
                              transition: 'all 0.2s ease'
                            }}>
                              {expandedProcedures.includes(proc.id) ? (
                                <FaChevronUp style={{ fontSize: '16px' }} />
                              ) : (
                                <FaChevronDown style={{ fontSize: '16px' }} />
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                    {/* Expanded Content */}
                    {proc.subItems.length > 0 && (
                      <a href={`/procedures/${proc.id}`} style={{ textDecoration: 'none' }}>
                        <Collapse in={expandedProcedures.includes(proc.id)}>
                          <Box sx={{
                            mt: 1,
                            background: '#fff',
                            border: '1px solid #e0e7ff',
                            borderRadius: 2,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                          }}>
                            {proc.subItems.map((item, index) => (
                              <Box key={index}>
                                <Box sx={{
                                  p: 3,
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    background: '#f8fafc'
                                  }
                                }}>
                                  <Box sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: '#3b82f6',
                                    mr: 3,
                                    mt: 0.75,
                                    flexShrink: 0
                                  }} />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: '0.9rem',
                                      color: '#374151',
                                      lineHeight: 1.5
                                    }}
                                  >
                                    {item}
                                  </Typography>
                                </Box>
                                {index < proc.subItems.length - 1 && (
                                  <Divider sx={{ mx: 3 }} />
                                )}
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      </a>
                    )}

                  </Box>
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

              {/* Lịch sử tìm kiếm gần đây */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <History sx={{ color: '#6b7280', fontSize: 20 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#374151', fontSize: '1rem' }}>
                    Lịch sử tìm kiếm gần đây
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {searchHistory.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f8fafc',
                          borderColor: '#2563eb'
                        }
                      }}
                    >
                      <AccessTime sx={{ color: '#9ca3af', fontSize: 16 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#374151',
                          fontSize: '0.9rem',
                          flex: 1
                        }}
                      >
                        {item}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#9ca3af',
                          fontSize: '0.75rem'
                        }}
                      >
                        {index === 0 ? 'Vừa xong' : `${index + 1} ngày trước`}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="text"
                    sx={{
                      textTransform: 'none',
                      color: '#2563eb',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: '#f0f9ff'
                      }
                    }}
                  >
                    Xem tất cả lịch sử
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
}