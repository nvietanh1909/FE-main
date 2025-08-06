import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/services/AuthService.ts";

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    // Kiểm tra user đã đăng nhập
    if (isAuthenticated()) {
        return <Navigate to="/dashboard" replace />;
    }
    
    // Kiểm tra admin đã đăng nhập
    const isAdminAuthenticated = sessionStorage.getItem('adminToken') === 'true';
    if (isAdminAuthenticated) {
        return <Navigate to="/admin" replace />;
    }
    
    return <>{children}</>;
}

export default PublicRoute;