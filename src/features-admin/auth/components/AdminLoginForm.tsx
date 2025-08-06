import React from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import nprogress from "nprogress";
import "@/assets/styles/nprogress.css";
import UET from "@/assets/images/UET.svg";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";

type AdminLoginFormInput = {
    email: string;
    password: string;
};

export default function AdminLoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormInput>();
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    nprogress.start();

    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem('adminToken') === 'true';
        if (isAuthenticated) {
            navigate('/admin', { replace: true });
        }
    }, []);

    nprogress.done();

    const onSubmit = async (data: AdminLoginFormInput) => {
        console.log(data);
        nprogress.start();
        try {
            if(data.email === "admin" && data.password === "123"){
                // gọi api ở đây 
                
                sessionStorage.setItem('adminUser', JSON.stringify({ name: "Admin", role: "admin" }));
                sessionStorage.setItem('adminToken', 'true');
                navigate("/admin");
            } else {
                setError("Email hoặc mật khẩu không chính xác");
                nprogress.done();
            }
        } catch (error) {
            nprogress.done();
            console.log("Error: " + error);
            alert("Có lỗi xảy ra khi đăng nhập!");
        } finally {
            nprogress.done();
        }
    };

    return (
        <div className="w-full max-w-[480px] mx-auto bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-95">
            
            <div className="w-full flex flex-row items-center mb-8 justify-center">
                <div className="relative mr-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#0080ff] to-[#0066cc] rounded-2xl flex items-center justify-center shadow-lg">
                        <img src={UET} alt="UET Logo" className="w-12 h-12 filter brightness-0 invert"/>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#ff6b35] to-[#f7931e] rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">A</span>
                    </div>
                </div>
                <div className="text-left">
                    <h1 className="text-3xl m-0 font-bold bg-gradient-to-r from-[#0080ff] to-[#0066cc] bg-clip-text text-transparent mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-gray-500 m-0 text-sm font-medium">Hệ thống quản trị viên</p>
                </div>
            </div>
                
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <div className="relative">
                        <TextField 
                            id="email"
                            label="Email"
                            placeholder="admin@example.com"
                            variant="outlined"
                            size="medium"
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontFamily: 'Inter, Roboto, Arial, sans-serif',
                                    fontSize: '16px',
                                    padding: '16px 14px',
                                },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '16px',
                                    backgroundColor: '#f8fafc',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#f1f5f9',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#0080ff',
                                        },
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 0 0 3px rgba(0, 128, 255, 0.1)',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#64748b',
                                    fontWeight: 500,
                                    '&.Mui-focused': {
                                        color: '#0080ff',
                                    },
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#e2e8f0',
                                    borderWidth: '2px',
                                },
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#0080ff',
                                },
                            }}
                            fullWidth
                            {...register('email', { required: 'Vui lòng nhập email quản trị' })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />   
                    </div>
                    <div className="relative">
                        <TextField
                            id="password"
                            label="Mật khẩu"
                            placeholder="••••••••"
                            variant="outlined"
                            size="medium"
                            type="password"
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontFamily: 'Inter, Roboto, Arial, sans-serif',
                                    fontSize: '16px',
                                    padding: '16px 14px',
                                },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '16px',
                                    backgroundColor: '#f8fafc',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#f1f5f9',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#0080ff',
                                        },
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 0 0 3px rgba(0, 128, 255, 0.1)',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#64748b',
                                    fontWeight: 500,
                                    '&.Mui-focused': {
                                        color: '#0080ff',
                                    },
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#e2e8f0',
                                    borderWidth: '2px',
                                },
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#0080ff',
                                },
                            }}
                            fullWidth
                            {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                            <p className="text-red-600 text-sm font-medium flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}
                </div>

                <Button 
                    variant="contained" 
                    type="submit" 
                    fullWidth
                    sx={{
                        height: '56px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #0080ff 0%, #0066cc 100%)',
                        fontSize: '16px',
                        fontWeight: 600,
                        fontFamily: 'Inter, Roboto, Arial, sans-serif',
                        textTransform: 'none',
                        boxShadow: '0 8px 24px rgba(0, 128, 255, 0.3)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
                            boxShadow: '0 12px 32px rgba(0, 128, 255, 0.4)',
                            transform: 'translateY(-2px)',
                        },
                        '&:active': {
                            transform: 'translateY(0px)',
                        },
                    }}
                >
                    Đăng nhập
                </Button>
                
            </form>
        </div>
    );
}
