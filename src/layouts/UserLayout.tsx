import React from "react";
import Header from "@/components/Header.tsx";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
    return (
        <div>
            <Header />
            <div>
            <Outlet />
            </div>
        </div>
    )
}
export default UserLayout;
