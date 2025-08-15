import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export type ChiPhiItem = {
  thanhPhan: string;
  donGia: number;
  dinhMuc: number;
  soLuong: number;
  luuY: string;
};

const thanhPhanOptions = [
  'Phụ cấp lưu trú',
  'Hỗ trợ tiền ở',
  'Hỗ trợ chi phí đi lại',
];

type EditFormProps = {
  onClose?: () => void;
  onSubmit: (item: ChiPhiItem) => void;
  initialData?: ChiPhiItem | null;
};

const EditForm: React.FC<EditFormProps> = ({ onClose, onSubmit, initialData }) => {
  const isEdit = useMemo(() => !!initialData, [initialData]);

  const [thanhPhanList] = useState(thanhPhanOptions);
  const [thanhPhan, setThanhPhan] = useState('');
  const [formData, setFormData] = useState<Omit<ChiPhiItem, 'thanhPhan'>>({
    donGia: 0,
    dinhMuc: 0,
    soLuong: 0,
    luuY: '',
  });

  useEffect(() => {
    if (initialData) {
      setThanhPhan(initialData.thanhPhan);
      setFormData({
        donGia: initialData.donGia,
        dinhMuc: initialData.dinhMuc,
        soLuong: initialData.soLuong,
        luuY: initialData.luuY,
      });
    } else {
      setThanhPhan('');
      setFormData({ donGia: 0, dinhMuc: 0, soLuong: 0, luuY: '' });
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!thanhPhan.trim()) return;
    const item: ChiPhiItem = {
      thanhPhan: thanhPhan.trim(),
      donGia: Number(formData.donGia) || 0,
      dinhMuc: Number(formData.dinhMuc) || 0,
      soLuong: Number(formData.soLuong) || 0,
      luuY: formData.luuY ?? '',
    };
    onSubmit(item);
    onClose?.();
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, position: 'relative' }}>
      {onClose && (
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
          color="error"
        >
          <CloseIcon />
        </IconButton>
      )}

      <Typography variant="h6" fontWeight={600} gutterBottom>
        {isEdit ? '✏️ CẬP NHẬT DÒNG' : '📝 NHẬP LIỆU BẢNG DỰ TOÁN'}
      </Typography>

      <Autocomplete
        freeSolo
        options={thanhPhanList}
        value={thanhPhan}
        onChange={(_, newValue) => {
          if (typeof newValue === 'string') setThanhPhan(newValue);
          else if (newValue) setThanhPhan(newValue);
          else setThanhPhan('');
        }}
        onInputChange={(_, newValue) => setThanhPhan(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Thành phần"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />

      <TextField
        label="Đơn giá"
        type="number"
        fullWidth
        margin="normal"
        value={formData.donGia}
        onChange={(e) =>
          setFormData({ ...formData, donGia: Number(e.target.value) })
        }
      />
      <TextField
        label="Định mức"
        type="number"
        fullWidth
        margin="normal"
        value={formData.dinhMuc}
        onChange={(e) =>
          setFormData({ ...formData, dinhMuc: Number(e.target.value) })
        }
      />
      <TextField
        label="Số lượng"
        type="number"
        fullWidth
        margin="normal"
        value={formData.soLuong}
        onChange={(e) =>
          setFormData({ ...formData, soLuong: Number(e.target.value) })
        }
      />
      <TextField
        label="Lưu ý"
        fullWidth
        margin="normal"
        value={formData.luuY}
        onChange={(e) => setFormData({ ...formData, luuY: e.target.value })}
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {isEdit ? 'Cập nhật' : '➕ Thêm vào bảng'}
        </Button>
        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Hủy
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EditForm;