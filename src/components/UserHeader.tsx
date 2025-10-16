import React, { useState, useRef, useEffect } from "react";
import UET from '@/assets/images/UET.svg';
import { Link, useNavigate } from "react-router-dom";
import { logout } from "@/services/AuthService.ts";
import { useUser } from "@/hooks/useUser";
import Avatar from "@mui/material/Avatar";
import { deepPurple, blue } from "@mui/material/colors";
import { FaChevronDown } from 'react-icons/fa';
import { FaBook } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";

export default function Header() {
    const navigate = useNavigate();
    const { user, loading } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header 
            className="bg-white shadow-sm h-[4rem] flex items-center justify-center font-roboto"
            style={{ borderBottom: '1px solid #e5e7eb' }}
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between items-center h-16">
                    {/* Logo bên trái */}
                    <Link to="/" className="flex items-center">
                        <img src={UET} alt="UET Logo" className="h-8 w-auto" />
                    </Link>
                    {/* Nút chọn năm học ở giữa */}
                    <div className="flex items-center gap-12">
                        <button className="flex items-center gap-1 border !font-semibold border-blue-400 text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.8 rounded-md text-sm font-medium transition-colors">
                            Năm học 2025-2026
                        </button>
                        <div className="flex items-center gap-2">
                            {/* Thông tin user bên phải */}
                            <div className="relative" ref={dropdownRef}>
                                <div 
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                                    onClick={toggleDropdown}
                                >
                                    <Avatar sx={{bgcolor: blue[500], fontSize: '1.2rem', textTransform: 'uppercase' }}>
                                        {loading ? '...' : (user?.name?.charAt(0) || 'U')}
                                    </Avatar>
                                    <FaChevronDown className={`text-[0.8rem] text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>
                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-full w-64 bg-white rounded-lg shadow-2xl border-gray-200 py-2 z-50" style={{ boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                                        {/* User Info Section */}
                                        <div className="px-4 py-3 border-b border-gray-100 pb-6 border-b-solid">
                                            <div className="flex items-center gap-3 ">
                                                <Avatar sx={{width: '3rem', height: '3rem', bgcolor: blue[500], fontSize: '1.4rem', textTransform: 'uppercase' }}>
                                                    {loading ? '...' : (user?.name?.charAt(0) || 'U')}
                                                </Avatar>
                                                <div>
                                                    <p className="text-[1rem] text-gray-900 m-0">
                                                        {loading ? 'Đang tải...' : (user?.name || 'User')}
                                                    </p>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="text-gray-500 m-0 text-[0.8rem] flex-shrink-0 max-w-[140px] truncate">
                                                            {user?.email || 'email@example.com'}
                                                        </p>
                                                        <p className="m-0 text-[0.8rem] px-2 bg-blue-200 text-blue-800 rounded-full flex-shrink-0">
                                                            {user?.role || 'user'}
                                                        </p>
                                                    </div>
                                                    {user?.department && (
                                                        <p className="text-gray-400 m-0 text-[0.75rem] mt-1">
                                                            {user.department} - {user.position || 'N/A'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Menu Items */}
                                        <div className="py-1 pt-2 border-t border-gray-100 border-t-solid">
                                            <button 
                                                onClick={handleLogout}
                                                className="pl-6 flex items-center cursor-pointer gap-3 px-4 py-2 text-gray-700 hover:text-gray-900 w-full text-left bg-transparent border-none outline-none"
                                                style={{ background: 'transparent', border: 'none', outline: 'none' }}
                                            >
                                                <FiLogOut className="text-[1rem]" />
                                                <span className="text-[0.9rem]">Đăng xuất</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
