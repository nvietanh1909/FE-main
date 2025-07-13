import React, { useState } from 'react'
import nprogress from 'nprogress';
import { useForm } from 'react-hook-form';
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
    email: string;
    organization: string;
    password: string;
}

export default function RegisterForm() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterFormInput>();
    const [error, setError] = useState<string>("");
    const [org, setOrg] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordStrengthLabel, setPasswordStrengthLabel] = useState('');
    nprogress.start();
    nprogress.done();

    const onSubmit = (data: RegisterFormInput) => {
        nprogress.start();
        // xử lý đăng ký ở đây
        nprogress.done();
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
        <div className="w-full max-w-[428px] mx-auto bg-white rounded-2xl p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full flex flex-col items-start mb-6">
                <img src={UET} alt="UET Logo" className="h-10 w-auto mb-2" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <TextField
                        id="email"
                        label="Email"
                        placeholder="Nhập email của bạn"
                        variant="outlined"
                        size="medium"
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
                        className="mt-1 h-2 rounded"
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