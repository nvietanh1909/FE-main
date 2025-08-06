import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/services/AuthService.ts';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  // Kiểm tra nếu user đã đăng nhập thì chuyển về user dashboard
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  // Kiểm tra admin authentication
  const isAdminAuthenticated = sessionStorage.getItem('adminToken') === 'true';
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
