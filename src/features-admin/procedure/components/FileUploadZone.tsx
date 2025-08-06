import React from 'react';
import { Box, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { FaFilePdf, FaFileWord, FaFile } from 'react-icons/fa';

interface FileUploadZoneProps {
  dragActive: boolean;
  selectedFiles: File[];
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUploadZone({
  dragActive,
  selectedFiles,
  onDrag,
  onDrop,
  onFileSelect
}: FileUploadZoneProps) {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf style={{ color: '#dc2626' }} />;
      case 'doc':
      case 'docx':
        return <FaFileWord style={{ color: '#2563eb' }} />;
      default:
        return <FaFile style={{ color: '#6b7280' }} />;
    }
  };

  return (
    <>
      {/* Drop Zone */}
      <Box
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        sx={{
          border: '2px dashed #d1d5db',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          bgcolor: dragActive ? '#f0f9ff' : '#fafafa',
          borderColor: dragActive ? '#2563eb' : '#d1d5db',
          cursor: 'pointer',
          mb: 3,
          transition: 'all 0.2s ease'
        }}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={onFileSelect}
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          <CloudUpload sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 1 }}>
            Drop file or{' '}
            <span style={{ color: '#2563eb', textDecoration: 'underline' }}>
              Browse
            </span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            Format: pdf, docx, doc & Max file size: 25 MB
          </Typography>
        </label>
      </Box>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
            Files đã chọn:
          </Typography>
          {selectedFiles.map((file, index) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              p: 2, 
              bgcolor: '#f3f4f6', 
              borderRadius: 1,
              mb: 1
            }}>
              {getFileIcon(file.name)}
              <Typography variant="body2" sx={{ flex: 1 }}>
                {file.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}
