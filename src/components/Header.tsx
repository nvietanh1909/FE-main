import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UET from '@/assets/images/UET.svg';
import { getUser, logout } from "@/services/AuthService.ts";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// @ts-ignore
//import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {
    const navigate = useNavigate();
    const user = {
        name: getUser()?.name,
        role: getUser()?.role || "Trưởng phòng KHTC"
    }
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Dropdown state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <header className="bg-white shadow-sm border-b h-[5.3rem] flex items-center justify-center font-roboto">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between items-center h-16">
                    {/* Logo bên trái */}
                    <Link to="/" className="flex items-center">
                        <img src={UET} alt="UET Logo" className="h-8 w-auto" />
                    </Link>
                    {/* Nút chọn năm học ở giữa */}
                    <div className="flex items-center gap-12">
                        <button className="flex items-center gap-1 border font-semibold border-blue-400 text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.8 rounded-md text-sm font-medium transition-colors">
                            Năm học 2025-2026
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end justify-center ">
                                <span className=" font-semibold text-gray-800 text-base">{user.name}</span>
                                <span className="text-xs text-gray-400 font-normal">{user.role}</span>
                            </div>
                            
                            {/* Thông tin user bên phải */}
                            <div className="flex items-center gap-4">
                                <Avatar
                                    sx={{
                                        bgcolor: deepPurple[500],
                                        cursor: 'pointer',
                                        transition: 'transform 0.15s',
                                        fontFamily: 'Roboto, Arial, sans-serif',
                                        '&:hover': { transform: 'scale(1.08)' }
                                    }}
                                    onClick={handleAvatarClick}
                                    className="shadow-lg"
                                >
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </Avatar>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    PaperProps={{
                                        className: 'rounded-xl min-w-[220px] py-4 px-2 font-roboto',
                                        sx: {
                                            boxShadow: 8,
                                            mt: 1.5,
                                            fontFamily: 'Roboto, Arial, sans-serif',
                                            borderRadius: 3,
                                            p: 0,
                                        }
                                    }}
                                >
                                    
                                    <div className="border-t border-gray-100 my-2"></div>
                                    <MenuItem
                                        onClick={() => { handleClose(); handleLogout(); }}
                                        className="text-red-600 font-semibold hover:bg-red-50 gap-2 px-4 py-2 rounded-lg transition-colors"
                                        sx={{ fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 500 }}
                                    >
                                        {/*<LogoutIcon fontSize="small" className="text-red-500" />*/}
                                        Đăng xuất
                                    </MenuItem>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
