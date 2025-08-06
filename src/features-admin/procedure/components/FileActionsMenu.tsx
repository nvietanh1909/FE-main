import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { FaEdit, FaTrash, FaDownload, FaEye } from 'react-icons/fa';

interface FileActionsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onPreview: () => void;
}

export default function FileActionsMenu({
  anchorEl,
  open,
  onClose,
  onEdit,
  onDelete,
  onDownload,
  onPreview
}: FileActionsMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={onPreview}>
        <FaEye style={{ marginRight: 8, color: '#6b7280' }} />
        Xem trước
      </MenuItem>
      <MenuItem onClick={onDownload}>
        <FaDownload style={{ marginRight: 8, color: '#2563eb' }} />
        Tải xuống
      </MenuItem>
      <MenuItem onClick={onEdit}>
        <FaEdit style={{ marginRight: 8, color: '#f59e0b' }} />
        Chỉnh sửa
      </MenuItem>
      <MenuItem onClick={onDelete} sx={{ color: '#dc2626' }}>
        <FaTrash style={{ marginRight: 8 }} />
        Xóa
      </MenuItem>
    </Menu>
  );
}
