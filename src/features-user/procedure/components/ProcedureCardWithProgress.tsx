import React from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';

interface ProcedureCardWithProgressProps {
  id: string | number;
  title: string;
  description: string;
  progress: number;
}

export default function ProcedureCardWithProgress({ id, title, description, progress }: ProcedureCardWithProgressProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/procedures/${id}`);
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10b981'; // green
    if (progress >= 50) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <Box
      sx={{
        background: '#fff',
        borderRadius: 3,
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      {/* Header with Icon */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h6" 
            fontWeight={700} 
            sx={{ 
              fontSize: '1.1rem',
              color: '#1f2937',
              mb: 1,
              lineHeight: 1.3
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#6b7280',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}
          >
            {description}
          </Typography>
        </Box>
        <Box sx={{ 
          ml: 2,
          p: 1,
          borderRadius: '50%',
          backgroundColor: '#f3f4f6',
          color: '#6b7280'
        }}>
          <AccessTimeIcon sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      {/* Progress Section */}
      <Box sx={{ mb: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: '#374151' }}>
            Tiến độ
          </Typography>
          <Typography 
            variant="body2" 
            fontWeight={700}
            sx={{ 
              color: getProgressColor(progress),
              fontSize: '0.9rem'
            }}
          >
            {progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#f3f4f6',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: getProgressColor(progress),
              transition: 'all 0.3s ease'
            },
          }}
        />
      </Box>

      {/* Action Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleClick}
        sx={{
          bgcolor: '#2563eb',
          textTransform: 'none',
          borderRadius: 2,
          fontWeight: 600,
          fontSize: '0.95rem',
          py: 1.2,
          boxShadow: 'none',
          '&:hover': {
            bgcolor: '#1d4ed8',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
          },
        }}
      >
        Xem quy trình
      </Button>
    </Box>
  );
} 