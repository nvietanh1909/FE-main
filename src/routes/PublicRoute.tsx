import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/services/AuthService.ts";

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    if (isAuthenticated()) {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
}

export default PublicRoute;