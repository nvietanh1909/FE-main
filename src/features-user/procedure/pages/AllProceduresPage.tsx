import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid } from '@mui/material';
import ProcedureCardWithProgress from '@/features-user/procedure/components/ProcedureCardWithProgress.tsx';

const dataDomestic = [
  { id: 1, title: 'Thủ tục 1', description: 'Báo cáo kết quả công tác', progress: 80 },
  { id: 2, title: 'Thủ tục 1', description: 'Báo cáo kết quả công tác', progress: 60 },
  { id: 3, title: 'Thủ tục 1', description: 'Báo cáo kết quả công tác', progress: 90 },
];
const dataForeign = [
  { id: 4, title: 'Thủ tục 1', description: 'Báo cáo kết quả công tác', progress: 30 },
  { id: 5, title: 'Thủ tục 1', description: 'Báo cáo kết quả công tác', progress: 50 },
  { id: 6, title: 'Thủ tục 1', description: 'Báo cáo kết quả công tác', progress: 20 },
];

export default function AllProceduresPage() {
  const { type } = useParams();
  const isDomestic = type === 'domestic';
  const data = isDomestic ? dataDomestic : dataForeign;
  const title = isDomestic ? 'Tất cả thủ tục công tác phí trong nước' : 'Tất cả thủ tục công tác phí nước ngoài';

  return (
    <Box sx={{ py: 4, px: 6 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>{title}</Typography>
      <Grid container spacing={2}>
        {data.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ProcedureCardWithProgress {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 