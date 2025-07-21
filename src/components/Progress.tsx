import React from 'react';
import { Box, Typography, LinearProgress, Button, Stack } from '@mui/material';
import BookIcon from '@mui/icons-material/MenuBook';

interface ProcedureProgressCardProps {
  value?: number;
  title?: string;
  date?: string;
  status?: string;
}

const ProcedureProgressCard = ({
  value = 65,
  title = "Thủ tục hồ sơ",
  date = "Ngày 11/1/2025",
  status = "Đang xét duyệt"
}: ProcedureProgressCardProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="#f9fafb"
      p={2}
      borderRadius={2}
      boxShadow={1}
      width="100%"
      gap={2}
    >
      {/* Icon */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#2979ff"
        color="white"
        borderRadius={2}
        width={48}
        height={48}
        flexShrink={0}
      >
        <BookIcon />
      </Box>

      {/* Progress Section - Takes most space */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2" fontWeight={600}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary' }}
          >{`${Math.round(value)}%`}</Typography>
        </Box>
        <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={value}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#e0e7ff',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: '#2979ff'
              }
            }}
          />
        </Box>
      </Box>

      {/* Date + Button - Fixed width */}
      <Stack alignItems="flex-end" spacing={1} sx={{ flexShrink: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {date}
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#007bff',
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 14,
            px: 2,
            py: 0.5,
            '&:hover': {
              bgcolor: '#006ae0',
            },
          }}
        >
          {status}
        </Button>
      </Stack>
    </Box>
  );
};

export default ProcedureProgressCard;
