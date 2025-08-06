import React from "react";
import AdminHeader from "@/components/AdminHeader.tsx";
import AdminSideBar from "@/components/AdminSideBar.tsx";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <AdminHeader />
            <div className="flex flex-1">
                <AdminSideBar />
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
