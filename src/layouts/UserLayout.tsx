import React from "react";
import Header from "@/components/Header.tsx";
import SideBar from "@/components/SideBar.tsx";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
        <Header />
            <div className="flex flex-1">
                <SideBar />
                <main className="flex-1">
                <Outlet />
                </main>
            </div>
        </div>
    )
}
export default UserLayout;
