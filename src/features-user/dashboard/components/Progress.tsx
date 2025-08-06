import React from 'react';
import { Box, Typography, LinearProgress, Button, Stack } from '@mui/material';
import BookIcon from '@mui/icons-material/MenuBook';

const progressData = [
  {
    value: 23,
    title: 'Thủ tục 1',
    date: 'Ngày 11/1/2025',
    status: 'Đang xét duyệt',
    color: '#2979ff',
  },
  {
    value: 23,
    title: 'Thủ tục 2',
    date: 'Ngày 11/1/2025',
    status: 'Đang xét duyệt',
    color: '#22c55e',
  },
  {
    value: 23,
    title: 'Thủ tục 3',
    date: 'Ngày 11/1/2025',
    status: 'Đang xét duyệt',
    color: '#a21caf',
  },
];

export default function Progress() {
  return (
    <Box sx={{ width: '100%', background: 'transparent', p: 0 }}>
      {progressData.map((item, idx) => (
        <Box
          key={idx}
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            borderRadius: 2,
            boxShadow: '0 1px 6px 0 rgba(0,0,0,0.06)',
            p: 1.5,
            mb: 1.5,
            gap: 1.5,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: item.color,
              color: 'white',
              borderRadius: 1.5,
              width: 40,
              height: 40,
              flexShrink: 0,
              mr: 1,
            }}
          >
            <BookIcon sx={{ fontSize: 20 }} />
          </Box>

          {/* Progress Section */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#222', fontSize: 16 }}>
                {item.value}%
              </Typography>
              <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#222', fontSize: 15 }}>
                {item.title}
              </Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={item.value}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#e5e7eb',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    backgroundColor: item.color,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Date + Button */}
          <Stack alignItems="flex-end" spacing={1} sx={{ flexShrink: 0, minWidth: 120 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {item.date}
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#1976d2',
                textTransform: 'none',
                borderRadius: 1.5,
                fontWeight: 600,
                fontSize: 13,
                px: 2,
                py: 0.4,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#1565c0',
                },
              }}
            >
              {item.status}
            </Button>
          </Stack>
        </Box>
      ))}
    </Box>
  );
}
