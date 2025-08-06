import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminPublicRouteProps {
  children: React.ReactNode;
}

const AdminPublicRoute = ({ children }: AdminPublicRouteProps) => {
  const isAuthenticated = sessionStorage.getItem('adminToken') === 'true';
  
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default AdminPublicRoute;
