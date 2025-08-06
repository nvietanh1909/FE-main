import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

interface Activity {
    time: string;
    action: string;
    detail: string;
    status: 'success' | 'pending';
}

interface RecentActivitiesProps {
    activities: Activity[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
    return (
        <Card sx={{ 
            borderRadius: 1,
            border: '1px solid #e5e7eb',
            boxShadow: 'none'
        }}>
            <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #f3f4f6' }}>
                    <Typography variant="h6" sx={{ 
                        color: '#111827', 
                        fontWeight: 600, 
                        fontSize: '1.4rem'
                    }}>
                        Hoạt động gần đây
                    </Typography>
                </Box>
                <Box>
                    {activities.map((activity, index) => (
                        <Box 
                            key={index} 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                p: 3,
                                borderBottom: index < activities.length - 1 ? '1px solid #f3f4f6' : 'none',
                                '&:hover': {
                                    backgroundColor: '#f9fafb'
                                }
                            }}
                        >
                            <Box sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%',
                                backgroundColor: activity.status === 'success' ? '#10b981' : '#f59e0b',
                                mr: 3,
                                flexShrink: 0
                            }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ 
                                    color: '#111827', 
                                    fontWeight: 500, 
                                    mb: 0.25, 
                                    fontSize: '0.875rem'
                                }}>
                                    {activity.action}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    color: '#6b7280', 
                                    fontSize: '0.8rem'
                                }}>
                                    {activity.detail}
                                </Typography>
                            </Box>
                            <Typography variant="caption" sx={{
                                color: '#9ca3af',
                                fontSize: '0.75rem',
                                fontWeight: 500
                            }}>
                                {activity.time}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}
