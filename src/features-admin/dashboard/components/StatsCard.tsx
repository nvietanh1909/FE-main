import React from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';

interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    change: string;
    color: string;
}

export default function StatsCard({ title, value, icon, change, color }: StatsCardProps) {
    const isPositive = change.startsWith('+');
    
    return (
        <Card sx={{ 
            borderRadius: 1,
            border: '1px solid #e5e7eb',
            boxShadow: 'none',
            '&:hover': { 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ 
                        width: 40, 
                        height: 40,
                        borderRadius: 1, 
                        backgroundColor: `${color}15`,
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                    }}>
                        {icon}
                    </Box>
                    <Chip 
                        label={change} 
                        size="small" 
                        sx={{ 
                            backgroundColor: isPositive ? '#f0f9ff' : '#fef2f2', 
                            color: isPositive ? '#0369a1' : '#dc2626',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 24,
                            border: isPositive ? '1px solid #e0f2fe' : '1px solid #fecaca'
                        }} 
                    />
                </Box>
                <Typography variant="h5" sx={{ 
                    fontWeight: 600, 
                    color: '#111827', 
                    mb: 0.5,
                    fontSize: '1.5rem'
                }}>
                    {value}
                </Typography>
                <Typography variant="body2" sx={{ 
                    color: '#6b7280', 
                    fontSize: '0.875rem'
                }}>
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
}
