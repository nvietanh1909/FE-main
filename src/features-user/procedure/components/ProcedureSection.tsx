import React from 'react';
import { Box, Typography, Link, Grid } from '@mui/material';
import ProcedureCardWithProgress from './ProcedureCardWithProgress.tsx';

interface ProcedureItem {
  id: string | number;
  title: string;
  description: string;
  progress: number;
}

interface ProcedureSectionProps {
  title: string;
  subtitle: string;
  link: string;
  data: ProcedureItem[];
}

export default function ProcedureSection({ title, subtitle, link, data }: ProcedureSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        pb: 2,
        borderBottom: '2px solid #f3f4f6'
      }}>
        <Box>
          <Typography 
            variant="h5" 
            fontWeight={700} 
            sx={{ 
              fontSize: '1.5rem',
              color: '#1f2937',
              mb: 0.5
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#6b7280',
              fontSize: '1rem',
              lineHeight: 1.5
            }}
          >
            {subtitle}
          </Typography>
        </Box>
        <Link 
          href={link} 
          sx={{ 
            color: '#2563eb', 
            fontWeight: 600, 
            fontSize: '1rem', 
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#f0f9ff',
              textDecoration: 'none'
            }
          }}
        >
          Xem tất cả →
        </Link>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={3}>
        {data.map((item, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
            <ProcedureCardWithProgress {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 