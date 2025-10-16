import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import nprogress from 'nprogress';
import { useForm, useWatch  } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import UET from '@/assets/images/UET.svg';
import FormHelperText from '@mui/material/FormHelperText';
import LinearProgress from '@mui/material/LinearProgress';


type RegisterFormInput = {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    organization: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterForm() {
    const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<RegisterFormInput>();
    const [error, setError] = useState<string>("");
    const [apiError, setApiError] = useState<string>(""); // <--- Dòng bị thiếu đã được thêm vào
    const [org, setOrg] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordStrengthLabel, setPasswordStrengthLabel] = useState('');
    const navigate = useNavigate();

    const passwordValue = useWatch({
        control,
        name: "password", 
    });

    const onSubmit = async (data: RegisterFormInput) => {
        nprogress.start();
        setApiError(""); // Xóa lỗi cũ

        try {
            // Ghép họ, tên đệm, tên thành một trường 'name' duy nhất
            const fullName = `${data.lastName} ${data.middleName} ${data.firstName}`.trim();

            const payload = {
                fullname: fullName,
                email: data.email,
                password: data.password,
                organization: data.organization,
            };

            const response = await fetch("https://umentor.duckdns.org/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            
            const result = await response.json();

            if (!response.ok) {
                // Ném lỗi với message từ API để catch xử lý
                throw new Error(result.message || 'Đăng ký không thành công.');
            }

            if (result.success) {
                // Thông báo và chuyển hướng khi thành công
                alert("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
                navigate('/login');
            } else {
                // Xử lý trường hợp response.ok nhưng success = false
                setApiError(result.message || "Đã có lỗi xảy ra từ server.");
            }

        } catch (error: any) {
            console.error("Lỗi đăng ký:", error);
            setApiError(error.message);
        } finally {
            nprogress.done();
        }
    };

    function checkPasswordStrength(password: string) {
        // Điều kiện >= 8 ký tự, 1 chữ hoa, 1 số, 1 ký tự đặc biệt
        let score = 0; 
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        setPasswordStrength(score);

        if (score <= 1) setPasswordStrengthLabel('Yếu');
        else if (score === 2) setPasswordStrengthLabel('Trung bình');
        else if (score >= 3) setPasswordStrengthLabel('Mạnh');
    }

    return (
        <div className="w-full max-w-[428px] mx-auto bg-white rounded-2xl p-4 flex flex-col items-center">
            <div className="w-full flex flex-col items-start mb-6">
                <img src={UET} alt="UET Logo" className="w-[7rem]"/>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
            <div className="flex flex-row gap-2 w-full">
                    <TextField
                        id="lastName"
                        label="Họ"
                        placeholder="Nguyễn"
                        variant="outlined"
                        size="medium"
                        fullWidth
                        {...register('lastName', { required: 'Vui lòng nhập họ' })}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                    />
                    <TextField
                        id="middleName"
                        label="Tên đệm"
                        placeholder="Văn"
                        variant="outlined"
                        size="medium"
                        fullWidth
                        {...register('middleName')}
                        error={!!errors.middleName}
                        helperText={errors.middleName?.message}
                    />
                    <TextField
                        id="firstName"
                        label="Tên"
                        placeholder="An"
                        variant="outlined"
                        size="medium"
                        fullWidth
                        {...register('firstName', { required: 'Vui lòng nhập tên' })}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                    />
                </div>
                <div className="flex flex-col gap-2">
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
                    <FormControl fullWidth variant="outlined" size="medium" error={!!errors.organization}>
                        <InputLabel id="org-label">Khoa</InputLabel>
                        <Select
                            labelId="org-label"
                            id="organization"
                            label="Khoa"
                            value={org}
                            {...register('organization', { required: 'Vui lòng chọn khoa' })}
                            onChange={e => setOrg(e.target.value)}
                            sx={{
                                borderRadius: '10px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: '10px',
                                },
                            }}
                        >
                            <MenuItem value="none">Không có</MenuItem>
                            <MenuItem value="uet">Khoa Công nghệ thông tin</MenuItem>
                        </Select>
                        {errors.organization && (
                            <FormHelperText>{errors.organization.message as string}</FormHelperText>
                        )}
                    </FormControl>
                </div>
                <div className="flex flex-col gap-2">
                    <TextField
                        id="password"
                        placeholder="Nhập mật khẩu của bạn"
                        label="Mật khẩu"
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
                        type="password"
                        fullWidth
                        {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        onChange={e => {
                            setValue && setValue('password', e.target.value);
                            checkPasswordStrength(e.target.value);
                        }}
                    />
                    <TextField
                        id="confirmPassword"
                        label="Xác nhận mật khẩu"
                        type="password"
                        fullWidth
                        {...register('confirmPassword', {
                            required: 'Vui lòng xác nhận mật khẩu',
                            validate: value =>
                                value === passwordValue || 'Mật khẩu không khớp'
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                    />
                    <span className="mb-2 text-sm text-gray-500">Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 số, 1 ký tự đặc biệt</span>
                    <LinearProgress
                        variant="determinate"
                        value={(passwordStrength / 4) * 100}
                        color={
                            passwordStrength === 0
                                ? "inherit"
                                : passwordStrength <= 1
                                    ? "error"
                                    : passwordStrength === 2
                                        ? "warning"
                                        : "success"
                        }
                        className="mt-1 h-2 rounded py-[1px] color-blueGray"
                    />
                    <div className={`text-sm mt-1 ${
                        passwordStrength <= 1 ? 'text-red-500' : passwordStrength === 2 ? 'text-yellow-500' : 'text-green-600'
                    }`}>
                        {passwordStrengthLabel}
                    </div>
                </div>
                <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    className="!bg-[#0080ff] !text-white !font-bold !text-lg !py-3 rounded-lg mt-2"
                >
                    Đăng ký
                </Button>
                <div className="w-full border-t border-gray-200 my-6"></div>
                <div className="text-center text-sm mb-4">
                    Bạn đã có tài khoản? <a href="/login" className="text-[#0056b3] decoration-none">Đăng nhập ngay</a>
                </div>
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />}
                    className="!py-3 rounded-lg !font-semibold !bg-white !border-gray-300 !text-gray-700 hover:!bg-gray-50"
                >
                    Đăng ký với Google
                </Button>
            </form>
        </div>
    )
}