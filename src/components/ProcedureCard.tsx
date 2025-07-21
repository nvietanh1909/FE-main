import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type ProcedureCardProps = {
  title: string;
  description: string;
  date: string;
  onClick?: () => void;
};

export default function ProcedureCard({
  title,
  description,
  date,
  onClick,
}: ProcedureCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        backgroundColor: '#f8fbff',
        borderLeft: '4px solid #2962ff',
        mb: 2,
      }}
    >
      <Box>
        <Typography fontWeight={700}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {description}
        </Typography>
        <Chip
          label={date}
          size="small"
          sx={{
            mt: 1,
            backgroundColor: '#e3f2fd',
            color: '#2962ff',
            fontWeight: 500,
          }}
        />
      </Box>
      <Button
        endIcon={<ArrowForwardIcon />}
        onClick={onClick}
        sx={{
          color: '#2962ff',
          fontWeight: 600,
          textTransform: 'none',
          minWidth: 'auto',
        }}
      >
        Xem chi tiết
      </Button>
    </Box>
  );
};

