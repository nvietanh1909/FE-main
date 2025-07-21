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
    <Box sx={{ mb: 4, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'Roboto, sans-serif, arial', fontSize: '1.5rem' }}>{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Roboto, sans-serif, arial', fontSize: '0.95rem', mb:1 }}>{subtitle}</Typography>
        </Box>
        <Link href={link} sx={{ color: '#2563eb', fontWeight: 500, fontSize: '1rem', textDecoration: 'none' }}>Xem tất cả </Link>
      </Box>
      <Grid container spacing={2}>
        {data.map((item, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
            <ProcedureCardWithProgress {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 