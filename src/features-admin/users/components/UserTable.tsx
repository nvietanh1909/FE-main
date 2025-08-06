import React from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Chip, 
    IconButton,
    Avatar,
    Box,
    Typography
} from '@mui/material';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive';
    lastLogin: string;
    avatar?: string;
}

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (userId: string) => void;
    onView: (user: User) => void;
}

export default function UserTable({ users, onEdit, onDelete, onView }: UserTableProps) {
    const getStatusColor = (status: string) => {
        return status === 'active' ? '#10b981' : '#ef4444';
    };

    const getRoleColor = (role: string) => {
        return role === 'admin' ? '#3b82f6' : '#6b7280';
    };

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Người dùng</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Vai trò</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Đăng nhập cuối</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ width: 40, height: 40, backgroundColor: '#3b82f6' }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
                                        {user.name}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    {user.email}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip 
                                    label={user.role === 'admin' ? 'Quản trị' : 'Người dùng'}
                                    size="small"
                                    sx={{ 
                                        backgroundColor: `${getRoleColor(user.role)}15`,
                                        color: getRoleColor(user.role),
                                        fontWeight: 500
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Chip 
                                    label={user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                    size="small"
                                    sx={{ 
                                        backgroundColor: `${getStatusColor(user.status)}15`,
                                        color: getStatusColor(user.status),
                                        fontWeight: 500
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    {user.lastLogin}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => onView(user)}
                                        sx={{ color: '#10b981' }}
                                    >
                                        <FaEye />
                                    </IconButton>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => onEdit(user)}
                                        sx={{ color: '#3b82f6' }}
                                    >
                                        <FaEdit />
                                    </IconButton>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => onDelete(user.id)}
                                        sx={{ color: '#ef4444' }}
                                    >
                                        <FaTrash />
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
