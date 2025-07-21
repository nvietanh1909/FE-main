import React from 'react';
import { Alert } from '@mui/material';

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
        <Alert variant="outlined" severity="info">
            Xin chào {user.name}
            <br />
            Hôm nay là ngày {user.date}. Bạn có{' '}
            <strong>{notificationCount}</strong> thông báo mới cần xem xét.
        </Alert>
    );
}