import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { FaUsers, FaClipboardList, FaChartBar, FaCog, FaFileAlt, FaComments, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard.tsx';
import QuickActionCard from '../components/QuickActionCard.tsx';
import RecentActivities from '../components/RecentActivities.tsx';

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const adminUser = JSON.parse(sessionStorage.getItem('adminUser') || '{}');

    const statsData = [
        { 
            title: 'Tổng người dùng', 
            value: '1,247', 
            icon: <FaUsers />, 
            change: '+12%',
            color: '#3b82f6'
        },
        { 
            title: 'Quy trình đang xử lý', 
            value: '89', 
            icon: <FaClipboardList />, 
            change: '+8%',
            color: '#10b981'
        },
        { 
            title: 'Hồ sơ hoàn thành', 
            value: '456', 
            icon: <FaFileAlt />, 
            change: '+23%',
            color: '#f59e0b'
        },
        { 
            title: 'Tin nhắn mới', 
            value: '34', 
            icon: <FaComments />, 
            change: '+5%',
            color: '#ef4444'
        }
    ];

    const quickActions = [
        { 
            title: 'Quản lý người dùng', 
            desc: 'Thêm, sửa, xóa và phân quyền người dùng',
            icon: <FaUsers />,
            path: '/admin/users',
            color: '#3b82f6'
        },
        { 
            title: 'Quản lý tài liệu', 
            desc: 'Tạo và chỉnh sửa quy trình thủ tục',
            icon: <FaClipboardList />,
            path: '/admin/procedures',
            color: '#10b981'
        },
        { 
            title: 'Tin nhắn', 
            desc: 'Xem tin nhắn và hỗ trợ người dùng',
            icon: <FaComments />,
            path: '/admin/messages',
            color: '#f59e0b'
        },
        { 
            title: 'Cài đặt hệ thống', 
            desc: 'Cấu hình tham số và quyền hạn',
            icon: <FaCog />,
            path: '/admin/settings',
            color: '#6366f1'
        }
    ];

    const recentActivities = [
        { time: '10:30', action: 'Người dùng mới đăng ký', detail: 'Nguyễn Văn A', status: 'success' as const },
        { time: '09:45', action: 'Quy trình được phê duyệt', detail: 'Hồ sơ #1234', status: 'success' as const },
        { time: '08:30', action: 'Yêu cầu hỗ trợ', detail: 'Ticket #5678', status: 'pending' as const },
        { time: '08:00', action: 'Backup dữ liệu hoàn thành', detail: 'System', status: 'success' as const }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b">
                <div className="px-6 py-4">
                    <Breadcrumbs  sx={{fontSize: "14px"}} separator=">" aria-label="breadcrumb" className="text-base mb-4">
                            <Link
                              underline="none"
                              color="inherit"
                              href="/admin"
                              className="flex items-center gap-1"
                            >
                              <FaHome className="text-lg" />
                              <span>Trang chủ</span>
                            </Link>
                            <Typography sx={{fontSize: "14px"}}  color="#2563eb" fontWeight={600}>
                              Bảng điều khiển
                            </Typography>
                    </Breadcrumbs>
                </div>
            </div>

            <div className="px-6">
                {/* Stats Cards */}
                <div className="mb-6">
                    <h2 className="text-[1.4rem] font-bold mt-0 text-gray-800 mb-4">
                        Thống kê tổng quan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statsData.map((stat, index) => (
                            <StatsCard
                                key={index}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                change={stat.change}
                                color={stat.color}
                            />
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-6">
                    <h2 className="text-[1.4rem] font-bold text-gray-800 mb-4">
                        Thao tác nhanh
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {quickActions.map((action, index) => (
                            <QuickActionCard
                                key={index}
                                title={action.title}
                                desc={action.desc}
                                icon={action.icon}
                                color={action.color}
                                onClick={() => navigate(action.path)}
                            />
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div>
                    <RecentActivities activities={recentActivities} />
                </div>
            </div>
        </div>
    );
}
