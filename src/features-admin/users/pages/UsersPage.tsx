import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Breadcrumbs, 
    Link,
    Card,
    CardContent
} from '@mui/material';
import { FaHome, FaUsers } from 'react-icons/fa';
import UserTable from '../components/UserTable.tsx';
import UserFilters from '../components/UserFilters.tsx';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive';
    lastLogin: string;
    avatar?: string;
}

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock data - trong thực tế sẽ fetch từ API
    const mockUsers: User[] = [
        {
            id: '1',
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            role: 'admin',
            status: 'active',
            lastLogin: '2 giờ trước'
        },
        {
            id: '2',
            name: 'Trần Thị B',
            email: 'tranthib@email.com',
            role: 'user',
            status: 'active',
            lastLogin: '1 ngày trước'
        },
        {
            id: '3',
            name: 'Lê Văn C',
            email: 'levanc@email.com',
            role: 'user',
            status: 'inactive',
            lastLogin: '1 tuần trước'
        },
        {
            id: '4',
            name: 'Phạm Thị D',
            email: 'phamthid@email.com',
            role: 'user',
            status: 'active',
            lastLogin: '3 ngày trước'
        },
        {
            id: '5',
            name: 'Hoàng Văn E',
            email: 'hoangvane@email.com',
            role: 'admin',
            status: 'active',
            lastLogin: '5 giờ trước'
        }
    ];

    // Lọc users
    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleEditUser = (user: User) => {
        console.log('Edit user:', user);
        // TODO: Implement edit user logic
    };

    const handleDeleteUser = (userId: string) => {
        console.log('Delete user:', userId);
        // TODO: Implement delete user logic
    };

    const handleViewUser = (user: User) => {
        console.log('View user:', user);
        // TODO: Implement view user logic
    };

    const handleAddUser = () => {
        console.log('Add new user');
        // TODO: Implement add user logic
    };

    return (
        <div className="py-4 px-6">
            {/* Breadcrumbs */}
            <Breadcrumbs separator=">" aria-label="breadcrumb" className="mb-4">
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
                    Quản lý người dùng
                </Typography>
            </Breadcrumbs>

            <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', p: 0 }}>
                <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
                    {/* Header */}
                    <Box sx={{ mb: 4, pt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 700, fontSize: '1.75rem' }}>
                                Quản lý người dùng
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '0.95rem' }}>
                            Quản lý thông tin và quyền hạn của người dùng trong hệ thống
                        </Typography>
                    </Box>

                    {/* Content */}
                    <Card sx={{ 
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            {/* Filters */}
                            <UserFilters
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                roleFilter={roleFilter}
                                onRoleFilterChange={setRoleFilter}
                                statusFilter={statusFilter}
                                onStatusFilterChange={setStatusFilter}
                                onAddUser={handleAddUser}
                                totalUsers={mockUsers.length}
                                filteredUsers={filteredUsers.length}
                            />

                            {/* User Table */}
                            <UserTable
                                users={filteredUsers}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
                                onView={handleViewUser}
                            />
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </div>
    );
}
