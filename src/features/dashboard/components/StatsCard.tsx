import React from 'react';
import { Card, Typography, Box } from '@mui/material';

interface StatsCardProps {
    icon: React.ReactNode;
    title: string;
    count: number;
    subText: string;
};

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, count, subText }) => {
    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: '0px 4px 12px rgba(0,0,0,0.1), 0px 2px 4px rgba(0,0,0,0.08)',
                px: 3,
                py: 3,
                display: 'flex',
                alignItems: 'center',
                minWidth: 220,
                background: '#fff',
                padding: '16px 11px 16px 18px',
                border: 'none',
            }}
        >
            <Box
                sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F3F4F6',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                    mr: 2.5,
                }}
            >
                {React.isValidElement(icon) && typeof icon.type === 'function' && (icon.type as any).muiName
                    ? React.cloneElement(icon)
                    : icon}
            </Box>
            <Box>
                <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mb: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.1 }}>
                    {count}
                </Typography>
                <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 500, mt: 0.5 }}>
                    {subText}
                </Typography>
            </Box>
        </Card>
    );
};

export default StatsCard;
