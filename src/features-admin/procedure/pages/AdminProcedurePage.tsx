import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Button
} from '@mui/material';
import { 
  FaPlus, 
  FaUpload
} from 'react-icons/fa';
import FileUploadDialog from '../components/FileUploadDialog.tsx';
import FileTable from '../components/FileTable.tsx';
import AdminBreadcrumbs from '../../shared/components/AdminBreadcrumbs.tsx';

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

export default function AdminProcedurePage() {
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: 1,
      name: 'Quy trình thanh toán công tác phí.pdf',
      description: 'Hướng dẫn chi tiết quy trình thanh toán chi phí công tác trong nước',
      size: '2.4 MB',
      uploadDate: '15/12/2024',
      uploadedBy: 'Admin',
      type: 'pdf',
      category: 'Tài chính'
    },
    {
      id: 2,
      name: 'Mẫu đơn xin nghỉ phép.docx',
      description: 'Mẫu đơn xin nghỉ phép theo quy định mới',
      size: '156 KB',
      uploadDate: '10/12/2024',
      uploadedBy: 'Admin',
      type: 'docx',
      category: 'Nhân sự'
    },
    {
      id: 3,
      name: 'Hướng dẫn sử dụng hệ thống.pdf',
      description: 'Tài liệu hướng dẫn sử dụng hệ thống quản lý cho người dùng mới',
      size: '5.1 MB',
      uploadDate: '08/12/2024',
      uploadedBy: 'Admin',
      type: 'pdf',
      category: 'Hướng dẫn'
    }
  ]);

  const handleFileUpload = (files: File[], description: string) => {
    if (files.length > 0 && description.trim()) {
      // Giả lập upload file
      const newFile: UploadedFile = {
        id: uploadedFiles.length + 1,
        name: files[0].name,
        description: description,
        size: `${(files[0].size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toLocaleDateString('vi-VN'),
        uploadedBy: 'Admin',
        type: files[0].name.split('.').pop() || 'file',
        category: 'Mới'
      };
      
      setUploadedFiles(prev => [newFile, ...prev]);
      setOpenUploadDialog(false);
    }
  };

  const handleFileEdit = (fileId: number) => {
    console.log('Edit file:', fileId);
    // Implement edit logic
  };

  const handleFileDelete = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleFileDownload = (fileId: number) => {
    console.log('Download file:', fileId);
    // Implement download logic
  };

  const handleFilePreview = (fileId: number) => {
    console.log('Preview file:', fileId);
    // Implement preview logic
  };

  return (
    <div className="py-4 px-6"> 
      <AdminBreadcrumbs 
        items={[
          { label: 'Quản lý quy trình' }
        ]}
      />

      {/* Header Section */}
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 2 }}>
        <Box>
          <Typography  fontWeight={700} sx={{ fontSize: "1.4rem", color: '#1f2937'}}>
            Quản lý tài liệu quy trình
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280' }}>
            Upload và quản lý các tài liệu quy trình, hướng dẫn cho hệ thống
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          onClick={() => setOpenUploadDialog(true)}
          sx={{
            bgcolor: '#2563eb',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            '&:hover': {
              bgcolor: '#1d4ed8'
            }
          }}
        >
          Tải lên tài liệu
        </Button>
      </Box>

      {/* Files Table */}
      <FileTable 
        files={uploadedFiles}
        onFileEdit={handleFileEdit}
        onFileDelete={handleFileDelete}
        onFileDownload={handleFileDownload}
        onFilePreview={handleFilePreview}
      />

      {/* Upload Dialog */}
      <FileUploadDialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
}
