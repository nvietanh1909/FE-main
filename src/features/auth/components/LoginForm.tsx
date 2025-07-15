import React from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import nprogress from "nprogress";
import "@/assets/styles/nprogress.css";
import UET from "@/assets/images/UET.svg";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from '@mui/material/FormControlLabel';
import { SwitchIOS } from "@/components/switch/SwitchIOS.tsx";


type LoginFormInput = {
    email: string;
    password: string;
    isRemember: boolean;
};

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginFormInput>();
    const [error, setError] = useState<string>("");
    const [isRemember, setIsRemember] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    const navigate = useNavigate();
    nprogress.start();

    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem('token') === 'true';
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, []);

    nprogress.done();

    const onSubmit = async (data: LoginFormInput) => {
        console.log(data);
        nprogress.start();
        try {
            if(data.email === "test" && data.password === "123"){
                // gọi api ở đây 
                
                sessionStorage.setItem('user', JSON.stringify({ name: "test" }));
                sessionStorage.setItem('token', 'true');
                sessionStorage.setItem('isRemember', isRemember.toString());
                navigate("/");
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
        <div className="w-full max-w-[428px] mx-auto bg-white rounded-2xl p-4 sm:p-8 flex flex-col items-center">
            
            <div className="w-full flex flex-col items-start mb-6">
                    <img src={UET} alt="UET Logo" className="w-[7rem]"/>
                </div>
                
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 mt-[20px]">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2 placeholder-[#717A84]">
                        <TextField 
                            id="email"
                            label="Email"
                            placeholder="Nhập email của bạn"
                            variant="outlined"
                            size="medium"
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontFamily: 'Roboto, Arial, sans-serif',
                                },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                },
                            }}
                            fullWidth
                            {...register('email', { required: 'Vui lòng nhập email' })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />   
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="relative placeholder-[#717A84]">
                            <TextField
                                id="password"
                                label="Mật khẩu"
                                placeholder="Nhập mật khẩu của bạn"
                                variant="outlined"
                                size="medium"
                                type="password"
                                sx={{
                                    '& .MuiInputBase-input': {
                                        fontFamily: 'Roboto, Arial, sans-serif',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                    },
                                }}
                                fullWidth
                                {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 mt-0 mb-2 font-size-[15px]">{error}</p>}
                </div>

                <div className="flex items-center justify-between  mt-1 mb-2">
                    <div className="flex items-center gap-2">
                        <SwitchIOS 
                            color="primary" 
                            checked={isRemember} 
                            onChange={() => setIsRemember(!isRemember)} 
                        />
                        <span className="text-sm text-[#717A84]">Ghi nhớ đăng nhập</span>
                    </div>
                    <a href="#" className="text-sm text-[#0056b3] hover:underline decoration-none">Quên mật khẩu</a>
                </div>

                <Button 
                    variant="contained" 
                    type="submit" 
                    fullWidth
                    sx={{
                        '& .MuiButton-root': {
                            fontFamily: 'Roboto, Arial, sans-serif',
                        },
                    }}
                    className="!bg-[#0080ff] !text-white !font-bold !text-lg !py-3 rounded-lg mt-2"
                >
                    Đăng nhập
                </Button>
                
                <div className="w-full border-t border-gray-200 my-6"></div>
                <div className="text-center text-sm mb-4">
                    Bạn chưa có tài khoản? <a href="/register" className="text-[#0056b3] decoration-none">Đăng ký ngay</a>
                </div>

                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />}
                    className="!py-3 rounded-lg !font-semibold !bg-white !border-gray-300 !text-gray-700 hover:!bg-gray-50"
                >
                    Đăng nhập với Google
                </Button>
                
            </form>
        </div>
    );
}