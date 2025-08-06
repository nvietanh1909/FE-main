import React from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel,
    Chip
} from '@mui/material';
import { FaSearch, FaPlus, FaFilter } from 'react-icons/fa';

interface UserFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    roleFilter: string;
    onRoleFilterChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
    onAddUser: () => void;
    totalUsers: number;
    filteredUsers: number;
}

export default function UserFilters({
    searchTerm,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
    statusFilter,
    onStatusFilterChange,
    onAddUser,
    totalUsers,
    filteredUsers
}: UserFiltersProps) {
    const activeFilters = [
        roleFilter !== 'all' && roleFilter,
        statusFilter !== 'all' && statusFilter
    ].filter(Boolean).length;

    return (
        <Box sx={{ mb: 3 }}>
            {/* Search and Add Button */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <TextField
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    sx={{ flex: 1 }}
                    InputProps={{
                        startAdornment: <FaSearch style={{ marginRight: 8, color: '#64748b' }} />
                    }}
                />
            </Box>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Vai trò</InputLabel>
                    <Select
                        value={roleFilter}
                        label="Vai trò"
                        onChange={(e) => onRoleFilterChange(e.target.value)}
                    >
                        <MenuItem value="all">Tất cả</MenuItem>
                        <MenuItem value="admin">Quản trị</MenuItem>
                        <MenuItem value="user">Người dùng</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Trạng thái"
                        onChange={(e) => onStatusFilterChange(e.target.value)}
                    >
                        <MenuItem value="all">Tất cả</MenuItem>
                        <MenuItem value="active">Hoạt động</MenuItem>
                        <MenuItem value="inactive">Không hoạt động</MenuItem>
                    </Select>
                </FormControl>

                {activeFilters > 0 && (
                    <Chip
                        icon={<FaFilter />}
                        label={`${activeFilters} bộ lọc`}
                        size="small"
                        sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
                    />
                )}

                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        Hiển thị {filteredUsers} / {totalUsers} người dùng
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
