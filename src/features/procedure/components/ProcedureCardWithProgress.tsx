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
  return (
    <Box
      sx={{
        background: '#fff',
        borderRadius: 3,
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)',
        p: 2.5,
        minHeight: 170,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16, color: '#90a4ae', fontSize: 20 }}>
        <AccessTimeIcon fontSize="small" />
      </Box>
      <Box>
        <Typography fontWeight={700} fontSize={18} sx={{ fontFamily: 'Roboto, sans-serif, arial' }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Roboto, sans-serif, arial', fontSize: '0.98rem', mb: 1.5 }}>{description}</Typography>
      </Box>
      <Box sx={{ mt: 1, mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 7,
            borderRadius: 4,
            backgroundColor: '#e5e7eb',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: '#2563eb',
            },
          }}
        />
      </Box>
      <Button
        variant="contained"
        fullWidth
        onClick={handleClick}
        sx={{
          bgcolor: '#2563eb',
          textTransform: 'none',
          borderRadius: 2,
          fontWeight: 600,
          fontSize: 15,
          mt: 1,
          py: 1,
          boxShadow: 'none',
          '&:hover': {
            bgcolor: '#1749b1',
          },
        }}
      >
        Quy trình
      </Button>
    </Box>
  );
} 