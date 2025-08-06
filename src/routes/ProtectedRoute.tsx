import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/services/AuthService.ts';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    // Kiểm tra nếu admin đã đăng nhập thì chuyển về admin dashboard
    const isAdminAuthenticated = sessionStorage.getItem('adminToken') === 'true';
    if (isAdminAuthenticated) {
        return <Navigate to="/admin" replace />;
    }
    
    // Kiểm tra user authentication
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
} 