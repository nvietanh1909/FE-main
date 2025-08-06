import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import { FaDownload, FaEllipsisV, FaFilePdf, FaFileWord, FaFile } from 'react-icons/fa';
import FileActionsMenu from './FileActionsMenu.tsx';

interface UploadedFile {
  id: number;
  name: string;
  description: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  type: string;
  category: string;
}

interface FileTableProps {
  files: UploadedFile[];
  onMenuClick?: (event: React.MouseEvent<HTMLElement>, fileId: number) => void;
  onFileEdit?: (fileId: number) => void;
  onFileDelete?: (fileId: number) => void;
  onFileDownload?: (fileId: number) => void;
  onFilePreview?: (fileId: number) => void;
}

export default function FileTable({ 
  files, 
  onMenuClick,
  onFileEdit,
  onFileDelete,
  onFileDownload,
  onFilePreview
}: FileTableProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, fileId: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedFileId(fileId);
    if (onMenuClick) {
      onMenuClick(event, fileId);
    }
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedFileId(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FaFilePdf style={{ color: '#dc2626' }} />;
      case 'doc':
      case 'docx':
        return <FaFileWord style={{ color: '#2563eb' }} />;
      default:
        return <FaFile style={{ color: '#6b7280' }} />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      'Tài chính': { bg: '#e0e7ff', text: '#3730a3' },
      'Nhân sự': { bg: '#dcfce7', text: '#166534' },
      'Hướng dẫn': { bg: '#fef3c7', text: '#92400e' },
      'Mới': { bg: '#f3e8ff', text: '#7c3aed' }
    };
    return colors[category] || { bg: '#f3f4f6', text: '#374151' };
  };

  return (
    <Paper sx={{ borderRadius: 3, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Tài liệu</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Mô tả</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Danh mục</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Ngày tải lên</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Người tải</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Chưa có tài liệu nào được tải lên
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => {
                const categoryColor = getCategoryColor(file.category);
                return (
                  <TableRow key={file.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {getFileIcon(file.type)}
                        <Typography variant="body2" fontWeight={500}>
                          {file.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#6b7280', 
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={file.description}
                      >
                        {file.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={file.category} 
                        size="small" 
                        sx={{ 
                          bgcolor: categoryColor.bg, 
                          color: categoryColor.text,
                          fontWeight: 500
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{file.uploadDate}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{file.uploadedBy}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => onFileDownload?.(file.id)}
                          sx={{ 
                            color: '#2563eb',
                            '&:hover': { bgcolor: '#f0f9ff' }
                          }}
                          title="Tải xuống"
                        >
                          <FaDownload />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleMenuClick(e, file.id)}
                          sx={{ 
                            color: '#6b7280',
                            '&:hover': { bgcolor: '#f3f4f6' }
                          }}
                          title="Thêm tùy chọn"
                        >
                          <FaEllipsisV />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <FileActionsMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        onEdit={() => handleAction(() => onFileEdit?.(selectedFileId!))}
        onDelete={() => handleAction(() => onFileDelete?.(selectedFileId!))}
        onDownload={() => handleAction(() => onFileDownload?.(selectedFileId!))}
        onPreview={() => handleAction(() => onFilePreview?.(selectedFileId!))}
      />
    </Paper>
  );
}
