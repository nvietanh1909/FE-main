import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Breadcrumbs, 
    Link,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Alert,
    Snackbar
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
    
    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    
    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user' as 'admin' | 'user',
        status: 'active' as 'active' | 'inactive'
    });
    
    // Notification states
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning' | 'info'
    });
    
    // Users state
    const [users, setUsers] = useState<User[]>([
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
    ]);

    // Lọc users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Form handlers
    const handleFormChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            role: 'user',
            status: 'active'
        });
    };

    const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    // CRUD Operations
    const handleAddUser = () => {
        resetForm();
        setIsAddDialogOpen(true);
    };

    const handleConfirmAdd = () => {
        if (!formData.name || !formData.email) {
            showNotification('Vui lòng nhập đầy đủ thông tin', 'error');
            return;
        }

        // Check email exists
        if (users.some(user => user.email === formData.email)) {
            showNotification('Email đã tồn tại trong hệ thống', 'error');
            return;
        }

        const newUser: User = {
            id: (users.length + 1).toString(),
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status,
            lastLogin: 'Chưa đăng nhập'
        };

        setUsers(prev => [...prev, newUser]);
        setIsAddDialogOpen(false);
        resetForm();
        showNotification('Thêm người dùng thành công');
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
        setIsEditDialogOpen(true);
    };

    const handleConfirmEdit = () => {
        if (!formData.name || !formData.email || !selectedUser) {
            showNotification('Vui lòng nhập đầy đủ thông tin', 'error');
            return;
        }

        // Check email exists (except current user)
        if (users.some(user => user.email === formData.email && user.id !== selectedUser.id)) {
            showNotification('Email đã tồn tại trong hệ thống', 'error');
            return;
        }

        setUsers(prev => prev.map(user => 
            user.id === selectedUser.id 
                ? { ...user, ...formData }
                : user
        ));
        
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        resetForm();
        showNotification('Cập nhật người dùng thành công');
    };

    const handleDeleteUser = (userId: string) => {
        const user = users.find(u => u.id === userId);
        setSelectedUser(user || null);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedUser) return;

        setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        showNotification('Xóa người dùng thành công');
    };

    const handleViewUser = (user: User) => {
        // TODO: Implement view user detail (có thể mở dialog xem chi tiết)
        console.log('View user:', user);
        showNotification('Chức năng xem chi tiết đang phát triển', 'info');
    };

    return (
        <div className="py-4 px-6">
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{fontSize: "14px"}} separator=">" aria-label="breadcrumb" className="mb-4">
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
                    Quản lý người dùng
                </Typography>
            </Breadcrumbs>

            <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', p: 0 }}>
                <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
                    {/* Header */}
                    <Box sx={{ mb: 4, pt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography sx={{ fontSize: "1.4rem", color: '#1e293b', fontWeight: 700 }}>
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
                                totalUsers={users.length}
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

            {/* Add User Dialog */}
            <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Thêm người dùng mới</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Họ và tên"
                            value={formData.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleFormChange('email', e.target.value)}
                            required
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Vai trò</InputLabel>
                                <Select
                                    value={formData.role}
                                    label="Vai trò"
                                    onChange={(e) => handleFormChange('role', e.target.value)}
                                >
                                    <MenuItem value="user">Người dùng</MenuItem>
                                    <MenuItem value="admin">Quản trị viên</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={formData.status}
                                    label="Trạng thái"
                                    onChange={(e) => handleFormChange('status', e.target.value)}
                                >
                                    <MenuItem value="active">Hoạt động</MenuItem>
                                    <MenuItem value="inactive">Không hoạt động</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleConfirmAdd} variant="contained">Thêm</Button>
                </DialogActions>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Họ và tên"
                            value={formData.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleFormChange('email', e.target.value)}
                            required
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Vai trò</InputLabel>
                                <Select
                                    value={formData.role}
                                    label="Vai trò"
                                    onChange={(e) => handleFormChange('role', e.target.value)}
                                >
                                    <MenuItem value="user">Người dùng</MenuItem>
                                    <MenuItem value="admin">Quản trị viên</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={formData.status}
                                    label="Trạng thái"
                                    onChange={(e) => handleFormChange('status', e.target.value)}
                                >
                                    <MenuItem value="active">Hoạt động</MenuItem>
                                    <MenuItem value="inactive">Không hoạt động</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleConfirmEdit} variant="contained">Cập nhật</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.name}</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setNotification(prev => ({ ...prev, open: false }))} 
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
