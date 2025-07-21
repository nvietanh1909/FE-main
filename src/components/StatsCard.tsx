import React from 'react';
import { Card, Typography, Box, Avatar } from '@mui/material';

interface StatsCardProps {
    icon: React.ReactNode;
    title: string;
    count: number;
    subText: string;
};

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, count, subText }) => {
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 2,
                px: 2,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                width: {
                    xs: '100%',
                    sm: 280,
                    md: 300
                }
            }}
        >
            <Avatar
                sx={{
                    bgcolor: 'transparent',
                    background: 'linear-gradient(to top right, #e0ffe0, #d1fadd)',
                    width: 56,
                    height: 56,
                    mr: 2,
                }}
            >
                {icon}
            </Avatar>
            <Box>
                <Typography variant="body2" fontWeight={500} color="text.secondary">
                    {title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                    {count}
                </Typography>
                <Typography variant="body2" color="green">
                    {subText}
                </Typography>
            </Box>
        </Card>
    );
};

export default StatsCard;
