import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

interface QuickActionCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
}

export default function QuickActionCard({ title, desc, icon, color, onClick }: QuickActionCardProps) {
    return (
        <Card 
            sx={{ 
                borderRadius: 1,
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': { 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    borderColor: color,
                    '& .action-icon': {
                        backgroundColor: color,
                        color: 'white'
                    }
                }
            }}
            onClick={onClick}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
                    <Box sx={{ 
                        width: 36, 
                        height: 36,
                        borderRadius: 1, 
                        backgroundColor: `${color}15`,
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        transition: 'all 0.2s ease',
                        className: 'action-icon'
                    }}>
                        {icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ 
                            color: '#111827', 
                            fontWeight: 600, 
                            fontSize: '1rem',
                            mb: 0.5,
                            lineHeight: 1.3
                        }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                            color: '#6b7280', 
                            lineHeight: 1.4, 
                            fontSize: '0.875rem'
                        }}>
                            {desc}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
