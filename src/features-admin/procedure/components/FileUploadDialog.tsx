import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography
} from '@mui/material';
import FileUploadZone from './FileUploadZone.tsx';

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[], description: string) => void;
}

export default function FileUploadDialog({ open, onClose, onUpload }: FileUploadDialogProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileDescription, setFileDescription] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0 && fileDescription.trim()) {
      onUpload(selectedFiles, fileDescription);
      // Reset form
      setSelectedFiles([]);
      setFileDescription('');
      setDragActive(false);
    }
  };

  const handleClose = () => {
    // Reset form when dialog closes
    setSelectedFiles([]);
    setFileDescription('');
    setDragActive(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 600, paddingBottom: 0 }}>Tải lên tài liệu</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
          Vui lòng upload files định dạng pdf, docx hoặc doc và đảm bảo kích thước file dưới 25 MB.
        </Typography>
        
        <FileUploadZone
          dragActive={dragActive}
          selectedFiles={selectedFiles}
          onDrag={handleDrag}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
        />

        {/* Description */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Mô tả tài liệu
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Nhập mô tả chi tiết về tài liệu..."
          value={fileDescription}
          onChange={(e) => setFileDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          sx={{ textTransform: 'none', color: '#6b7280' }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={selectedFiles.length === 0 || !fileDescription.trim()}
          sx={{
            textTransform: 'none',
            bgcolor: '#2563eb',
            '&:hover': { bgcolor: '#1d4ed8' }
          }}
        >
          Tải lên tài liệu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
