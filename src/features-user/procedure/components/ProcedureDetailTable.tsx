import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface TableRowData {
  name: string;
  desc: string;
  quantity: number;
  note: string;
}

interface ProcedureDetailTableProps {
  data: TableRowData[];
}

export default function ProcedureDetailTable({ data }: ProcedureDetailTableProps) {
  return (
    <Box sx={{ background: '#fff', borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)', p: 2.5, mt: 2 }}>
      <Typography fontWeight={700} fontSize={18} sx={{ fontFamily: 'Roboto, sans-serif, arial', mb: 0.5 }}>Danh mục cần chuẩn bị</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Roboto, sans-serif, arial', mb: 2 }}>
        Dưới đây là danh sách tài liệu bạn cần chuẩn bị để nộp hồ sơ này
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#2563eb' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Tài liệu</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Mô tả</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Số lượng</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Chú thích</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>tool</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx} sx={{ background: idx % 2 === 0 ? '#f1f6fd' : '#fff' }}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.desc}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.note}</TableCell>
                <TableCell><CheckIcon sx={{ color: '#2563eb' }} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 