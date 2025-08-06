import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box, TextField, Button, Avatar, Paper, Divider } from '@mui/material';
import { FaHome, FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

export default function AdminSettingsPage() {
  nprogress.configure({ showSpinner: false });
  nprogress.start();

  useEffect(() => {
    nprogress.done();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [adminInfo, setAdminInfo] = useState({
    fullName: 'Nguyễn Quản Trị',
    email: 'admin@uet.vnu.edu.vn',
    phone: '0901234567',
    department: 'Phòng IT',
    position: 'Quản trị viên hệ thống',
    employeeId: 'ADMIN001',
    address: 'Hà Nội, Việt Nam'
  });

  const [editForm, setEditForm] = useState(adminInfo);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(adminInfo);
  };

  const handleSave = () => {
    setAdminInfo(editForm);
    setIsEditing(false);
    // TODO: Save to backend
  };

  const handleCancel = () => {
    setEditForm(adminInfo);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
          Cài đặt
        </Typography>
      </Breadcrumbs>

      {/* Admin Profile Section */}
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FaUser style={{ fontSize: '24px', color: '#3b82f6' }} />
              <Typography variant="h5" fontWeight={600}>
                Thông tin quản trị viên
              </Typography>
            </Box>
            
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<FaEdit />}
                onClick={handleEdit}
                sx={{ 
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  '&:hover': { backgroundColor: '#dbeafe' }
                }}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<FaSave />}
                  onClick={handleSave}
                  sx={{ 
                    backgroundColor: '#3B82F6',
                    '&:hover': { backgroundColor: '#2c79f6ff' }
                  }}
                >
                  Lưu
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FaTimes />}
                  onClick={handleCancel}
                  sx={{ 
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    '&:hover': { backgroundColor: '#fef2f2' }
                  }}
                >
                  Hủy
                </Button>
              </Box>
            )}
          </Box>

          {/* Avatar and Basic Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4 }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                backgroundColor: '#3b82f6',
                fontSize: '2rem',
                fontWeight: 600 
              }}
            >
              {adminInfo.fullName.charAt(0)}
            </Avatar>
            
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                {adminInfo.fullName}
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 1 }}>
                {adminInfo.position}
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                Mã nhân viên: {adminInfo.employeeId}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Form Fields */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            <TextField
              label="Họ và tên"
              value={isEditing ? editForm.fullName : adminInfo.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
            />
            
            <TextField
              label="Email"
              value={isEditing ? editForm.email : adminInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
              type="email"
            />
            
            <TextField
              label="Số điện thoại"
              value={isEditing ? editForm.phone : adminInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
            />
            
            <TextField
              label="Phòng ban"
              value={isEditing ? editForm.department : adminInfo.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
            />
            
            <TextField
              label="Chức vụ"
              value={isEditing ? editForm.position : adminInfo.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
            />
            
            <TextField
              label="Mã nhân viên"
              value={isEditing ? editForm.employeeId : adminInfo.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
            />
          </Box>

          <TextField
            label="Địa chỉ"
            value={isEditing ? editForm.address : adminInfo.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            disabled={!isEditing}
            fullWidth
            variant="outlined"
            sx={{ mt: 3 }}
            multiline
            rows={2}
          />
        </Paper>

        {/* System Settings Section */}
        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Cài đặt hệ thống
            </Typography>
          </Box>
          
          <Typography color="textSecondary" sx={{ mb: 2 }}>
            Quản lý các cài đặt chung của hệ thống và quyền truy cập.
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
            <Button 
              variant="outlined" 
              sx={{ p: 2, justifyContent: 'flex-start' }}
              onClick={() => console.log('Manage permissions')}
            >
              Quản lý quyền hạn
            </Button>
            <Button 
              variant="outlined" 
              sx={{ p: 2, justifyContent: 'flex-start' }}
              onClick={() => console.log('System logs')}
            >
              Nhật ký hệ thống
            </Button>
            <Button 
              variant="outlined" 
              sx={{ p: 2, justifyContent: 'flex-start' }}
              onClick={() => console.log('Backup settings')}
            >
              Cài đặt sao lưu
            </Button>
            <Button 
              variant="outlined" 
              sx={{ p: 2, justifyContent: 'flex-start' }}
              onClick={() => console.log('Security settings')}
            >
              Cài đặt bảo mật
            </Button>
          </Box>
        </Paper>
      </Box>
    </div>
  );
}
