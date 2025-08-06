import React, { useState } from 'react';
import { Box, Typography, Chip, Button, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type ProcedureCardProps = {
  title: string;
  description: string;
  date: string;
  onClick?: () => void;
  details?: string; // Thông tin chi tiết để hiển thị khi mở rộng
};

export default function ProcedureCard({
  title,
  description,
  date,
  onClick,
  details = "Đây là thông tin chi tiết về quy trình này. Bao gồm các bước thực hiện, tài liệu cần thiết, và thời gian xử lý dự kiến."
}: ProcedureCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        backgroundColor: '#f8fbff',
        borderTop: '1px solid #e5e7eb',
        borderRight: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        borderLeft: '4px solid #2962ff',
        transition: 'all 0.18s',
        '&:hover': {
          backgroundColor: '#f3f4f6',
          borderTopColor: '#d1d5db',
          borderRightColor: '#d1d5db',
          borderBottomColor: '#d1d5db',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      {/* Phần header của card */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
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
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={handleExpandClick}
          sx={{
            color: '#2962ff',
            fontWeight: 600,
            textTransform: 'none',
            minWidth: 'auto',
          }}
        >
          {expanded ? 'Thu gọn' : 'Xem chi tiết'}
        </Button>
      </Box>

      {/* Phần thông tin chi tiết có thể mở rộng */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            px: 2,
            pb: 2,
            pt: 0,
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            borderRadius: '0 0 8px 8px',
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mt: 2,
              lineHeight: 1.6,
              '& strong': {
                color: '#2962ff',
                fontWeight: 600,
              }
            }}
          >
            <strong>Thông tin chi tiết:</strong><br />
            {details}
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Chip 
              label="Tài liệu cần thiết" 
              size="small" 
              variant="outlined"
              sx={{ color: '#2962ff', borderColor: '#2962ff' }}
            />
            <Chip 
              label="Thời gian: 3-5 ngày" 
              size="small" 
              variant="outlined"
              sx={{ color: '#ef4444', borderColor: '#ef4444' }}
            />
            <Chip 
              label="Phí xử lý" 
              size="small" 
              variant="outlined"
              sx={{ color: '#059669', borderColor: '#059669' }}
            />
          </Box>

          {onClick && (
            <Button
              variant="contained"
              onClick={onClick}
              sx={{
                mt: 2,
                backgroundColor: '#2962ff',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#1976d2',
                },
              }}
            >
              Bắt đầu quy trình
            </Button>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

