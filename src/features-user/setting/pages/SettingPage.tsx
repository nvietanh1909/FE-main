import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box, TextField, Button, Avatar, Paper, Divider } from '@mui/material';
import { FaHome, FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

export default function SettingPage() {
  nprogress.configure({ showSpinner: false });
  nprogress.start();

  useEffect(() => {
    nprogress.done();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@uet.vnu.edu.vn',
    phone: '0987654321',
    department: 'Phòng Tài chính',
    position: 'Nhân viên',
    employeeId: 'UET2024001',
    address: 'Hà Nội, Việt Nam'
  });

  const [editForm, setEditForm] = useState(userInfo);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(userInfo);
  };

  const handleSave = () => {
    setUserInfo(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(userInfo);
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
          href="/"
          className="flex items-center gap-1"
        >
          <FaHome className="text-lg" />
          <span>Trang chủ</span>
        </Link>
        <Typography color="#2563eb" fontWeight={600}>
          Cài đặt
        </Typography>
      </Breadcrumbs>

      {/* User Profile Section */}
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FaUser style={{ fontSize: '24px', color: '#3b82f6' }} />
              <Typography variant="h5" fontWeight={600}>
                Thông tin cá nhân
              </Typography>
            </Box>
            
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                startIcon={<FaEdit />}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#f0f9ff'
                  }
                }}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  onClick={handleSave}
                  startIcon={<FaSave />}
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#3B82F6',
                    '&:hover': {
                      backgroundColor: '#2563EB'
                    }
                  }}
                >
                  Lưu
                </Button>
                <Button
                  onClick={handleCancel}
                  startIcon={<FaTimes />}
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    '&:hover': {
                      borderColor: '#dc2626',
                      backgroundColor: '#fef2f2'
                    }
                  }}
                >
                  Hủy
                </Button>
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Avatar Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#3b82f6',
                fontSize: '32px',
                fontWeight: 600
              }}
            >
              {userInfo.fullName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {userInfo.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userInfo.position} - {userInfo.department}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mã nhân viên: {userInfo.employeeId}
              </Typography>
            </Box>
          </Box>

          {/* Form Fields */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <TextField
              label="Họ và tên"
              value={isEditing ? editForm.fullName : userInfo.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isEditing ? '#fff' : '#f9fafb'
                }
              }}
            />

            <TextField
              label="Email"
              value={isEditing ? editForm.email : userInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isEditing ? '#fff' : '#f9fafb'
                }
              }}
            />

            <TextField
              label="Số điện thoại"
              value={isEditing ? editForm.phone : userInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isEditing ? '#fff' : '#f9fafb'
                }
              }}
            />

            <TextField
              label="Phòng ban"
              value={isEditing ? editForm.department : userInfo.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isEditing ? '#fff' : '#f9fafb'
                }
              }}
            />

            <TextField
              label="Chức vụ"
              value={isEditing ? editForm.position : userInfo.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              disabled={!isEditing}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isEditing ? '#fff' : '#f9fafb'
                }
              }}
            />

            <TextField
              label="Mã nhân viên"
              value={userInfo.employeeId}
              disabled
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f3f4f6'
                }
              }}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <TextField
              label="Địa chỉ"
              value={isEditing ? editForm.address : userInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isEditing ? '#fff' : '#f9fafb'
                }
              }}
            />
          </Box>

          {/* Info Note */}
          {!isEditing && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f0f9ff', borderRadius: 2, border: '1px solid #bae6fd' }}>
              <Typography variant="body2" color="#0369a1">
                💡 Nhấn "Chỉnh sửa" để cập nhật thông tin cá nhân của bạn
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

    </div>
  );
} 