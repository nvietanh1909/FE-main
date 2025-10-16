import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

type WelcomeProps = {
    name: string;
    notificationCount: number;
};

export default function Welcome({ name, notificationCount }: WelcomeProps) {
    const user = {
        name: name,
        date: new Date().toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }),
    };

    return (
        <Alert variant="outlined" severity="info" sx={{
            backgroundColor: '#EFF6FF',
            marginTop: '1rem',
            color: '#1E40B7',
            '& .MuiAlert-icon': {
                color: '#1E40B7',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'top',
                marginTop: '2px', 
            },
        }}>
            <AlertTitle sx={{
                marginBottom: '0',
                color: '#1E40B7',
                fontWeight: '600',
                fontSize: '0.98rem',
            }}>Xin chào quý thầy cô!</AlertTitle>
            <div className="text-[0.8rem] text-[#1E40B7]">
                Hôm nay là ngày {user.date}. Bạn có <b>{notificationCount}</b> thông báo mới cần xem xét.
            </div>
        </Alert>
    );
}