import React from "react";
import { useNavigate } from "react-router-dom";
import UET from '@/assets/images/UET.svg';
import { getUser, logout } from "@/services/AuthService.ts";

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <img src={UET} alt="UET Logo" />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-700">
                            Xin chào, <span className="font-medium">{getUser()?.name || "???"}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border-none"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
