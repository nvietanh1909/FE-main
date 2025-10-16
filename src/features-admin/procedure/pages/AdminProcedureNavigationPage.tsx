import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Box, Paper, Chip, CircularProgress, Alert, Collapse, IconButton, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { FaFileAlt, FaInfoCircle, FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import ProcedureStepper from '@/features-admin/document/components/ProcedureStepper.tsx';
import { fetchProcedureDetail, fetchProcedures } from '@/features-user/procedure/services/procedureService.ts';
import AdminBreadcrumbs from '../../shared/components/AdminBreadcrumbs.tsx';
import { capitalizeWords, formatCurrency } from '@/utils/textUtils.ts';
import ChatBot from '@/components/ChatBot.tsx';

// ====== API Response Types ======
interface ThanhPhanDuToan {
  id: string;
  name: string;
  description: string;
  type: string;
  soLuong?: number;
  donGia?: number;
}

interface HoSoChungTu {
  id: string;
  title: string | null;
  path: string | null;
  name: string;
  type: string;
}

interface GhiChu {
  id: string;
  text: string;
  type: string;
}

interface ProcedureData {
  id: string;
  title: string;
  description: string;
  type: string;
  thanhphandutoans: ThanhPhanDuToan[];
  hosochungtus: HoSoChungTu[];
  ghichus: GhiChu[];
}

interface ProcedureResponse {
  success: boolean;
  data: ProcedureData;
}

const steps = [
  { label: "Bước 1", sublabel: "Lập hồ sơ dự toán" },
  { label: "Bước 2", sublabel: "Chuẩn bị các giấy tờ kèm theo" },
  { label: "Bước 3", sublabel: "Nộp hồ sơ và xét duyệt" },
  { label: "Bước 4", sublabel: "Hoàn thành thủ tục" },
];

export default function AdminProcedureNavigationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // State management
  const [proceduresList, setProceduresList] = useState<ProcedureData[]>([]);
  const [procedureData, setProcedureData] = useState<ProcedureData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  
  // Get URL parameters
  const type = searchParams.get('type');
  const selectedId = searchParams.get('id');

  // Get procedure sub-category name from URL parameters
  const getProcedureSubName = () => {
    if (type === 'trong-nuoc') {
      return 'Công tác phí trong nước';
    } else if (type === 'nuoc-ngoai') {
      return 'Công tác phí nước ngoài';
    }
    return null;
  };

  // Load procedures list
  const loadProceduresList = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let targetPath = "";
      if (type === 'trong-nuoc') {
        targetPath = "THANH TOÁN HOẠT ĐỘNG THƯỜNG XUYÊN / Công tác phí trong nước";
      } else if (type === 'nuoc-ngoai') {
        targetPath = "THANH TOÁN HOẠT ĐỘNG THƯỜNG XUYÊN / Công tác phí nước ngoài";
      }

      if (targetPath) {
        const response = await fetchProcedures();
        if (response?.success && response.data) {
          const filtered = response.data.filter((proc: ProcedureData) => 
            proc.description.includes(targetPath)
          );
          setProceduresList(filtered);
          
          if (!selectedId && filtered.length > 0) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('id', filtered[0].id);
            navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
          }
        }
      }
    } catch (err) {
      console.error('Lỗi tải danh sách quy trình:', err);
      setError('Không thể tải danh sách quy trình');
    } finally {
      setLoading(false);
    }
  };

  // Load procedure detail
  const loadProcedureDetail = async (procedureId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchProcedureDetail(procedureId);
      if (response?.success && response.data) {
        setProcedureData(response.data);
      } else {
        setError('Không thể tải chi tiết quy trình');
      }
    } catch (err) {
      console.error('Lỗi tải chi tiết quy trình:', err);
      setError('Không thể tải chi tiết quy trình');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProceduresList();
  }, [type]);

  useEffect(() => {
    if (selectedId) {
      loadProcedureDetail(selectedId);
    } else {
      setProcedureData(null);
    }
  }, [selectedId]);

  // Toggle expanded sections
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Admin actions
  const handleEdit = (procedureId: string) => {
    navigate(`/admin/procedures/${procedureId}/edit`);
  };

  const handleDelete = (procedureId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quy trình này?')) {
      console.log('Delete procedure:', procedureId);
    }
  };

  const handleAdd = () => {
    navigate('/admin/procedures/new');
  };

  const handleView = (procedureId: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('id', procedureId);
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    const items = [];
    
    if (type === 'trong-nuoc') {
      items.push(
        { label: 'Quy trình thanh toán hoạt động thường xuyên' },
        { label: 'Công tác phí trong nước' }
      );
    } else if (type === 'nuoc-ngoai') {
      items.push(
        { label: 'Quy trình thanh toán hoạt động thường xuyên' },
        { label: 'Công tác phí nước ngoài' }
      );
    } else {
      items.push({ label: 'Quản lý quy trình' });
    }

    return <AdminBreadcrumbs items={items} />;
  };

  // Render procedures list sidebar
  const renderProceduresList = () => {
    if (loading && proceduresList.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (proceduresList.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Không có quy trình nào
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Danh sách quy trình
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<FaPlus />}
            onClick={handleAdd}
            sx={{
              bgcolor: '#2563eb',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#1d4ed8' }
            }}
          >
            Thêm mới
          </Button>
        </Box>
        
        {proceduresList.map((procedure) => (
          <Paper
            key={procedure.id}
            sx={{
              p: 2,
              mb: 2,
              cursor: 'pointer',
              border: selectedId === procedure.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
              bgcolor: selectedId === procedure.id ? '#eff6ff' : 'white',
              '&:hover': { bgcolor: '#f8fafc' }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ 
                  color: selectedId === procedure.id ? '#2563eb' : '#1f2937',
                  fontSize: '0.9rem',
                  flex: 1,
                  cursor: 'pointer'
                }}
                onClick={() => handleView(procedure.id)}
              >
                {capitalizeWords(procedure.title)}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={(e) => { e.stopPropagation(); handleView(procedure.id); }}
                  sx={{ color: '#6b7280' }}
                >
                  <FaEye size={12} />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={(e) => { e.stopPropagation(); handleEdit(procedure.id); }}
                  sx={{ color: '#2563eb' }}
                >
                  <FaEdit size={12} />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={(e) => { e.stopPropagation(); handleDelete(procedure.id); }}
                  sx={{ color: '#dc2626' }}
                >
                  <FaTrash size={12} />
                </IconButton>
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              {procedure.description?.length > 100 
                ? `${capitalizeWords(procedure.description.substring(0, 100))}...` 
                : capitalizeWords(procedure.description)}
            </Typography>
          </Paper>
        ))}
      </Box>
    );
  };

  // Render procedure detail with admin actions
  const renderProcedureDetail = () => {
    if (!procedureData) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
          <Typography variant="h6" color="text.secondary">
            Chọn một quy trình để xem chi tiết
          </Typography>
        </Box>
      );
    }

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box sx={{ p: 4 }}>
        {/* Header with admin actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#1f2937' }}>
            {capitalizeWords(procedureData.title)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FaEdit />}
              onClick={() => handleEdit(procedureData.id)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#2563eb',
                color: '#2563eb'
              }}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="outlined"
              startIcon={<FaTrash />}
              onClick={() => handleDelete(procedureData.id)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#dc2626',
                color: '#dc2626'
              }}
            >
              Xóa
            </Button>
          </Box>
        </Box>

        {/* Steps */}
        <Paper sx={{ p: 4, mb: 3, bgcolor: '#f8fafc' }}>
          <ProcedureStepper 
            steps={steps} 
            activeStep={0} 
            onStepChange={(step) => console.log('Step changed to:', step)}
          />
        </Paper>

        {/* Budget section */}
        {procedureData.thanhphandutoans && procedureData.thanhphandutoans.length > 0 && (
          <Paper sx={{ p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaFileAlt style={{ color: '#2563eb', marginRight: 8 }} />
                <Typography variant="h6" fontWeight={600}>
                  DỰ TOÁN CHI PHÍ
                </Typography>
              </Box>
              <IconButton onClick={() => toggleSection('budget')}>
                {expandedSections.budget ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Collapse in={expandedSections.budget !== false} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 3 }}>
                <table className="w-full border border-gray-300" style={{ tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '32%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '12%' }} />
                  </colgroup>
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-2 border text-center">STT</th>
                      <th className="p-2 border text-center">Hạng mục</th>
                      <th className="p-2 border text-center">Số lượng</th>
                      <th className="p-2 border text-center">Đơn giá</th>
                      <th className="p-2 border text-center">Thành tiền</th>
                      <th className="p-2 border text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {procedureData.thanhphandutoans.map((item, idx) => {
                      const soLuong = item.soLuong || 1;
                      const donGia = item.donGia || 100000;
                      const thanhTien = soLuong * donGia;
                      
                      return (
                        <tr key={`${item.id}-${idx}`}>
                          <td className="p-2 border text-center">{idx + 1}</td>
                          <td className="p-2 border" style={{ wordWrap: 'break-word' }}>
                            {capitalizeWords(item.name)}
                          </td>
                          <td className="p-2 border text-center font-medium">
                            {soLuong}
                          </td>
                          <td className="p-2 border text-right font-medium">
                            {formatCurrency(donGia)}
                          </td>
                          <td className="p-2 border text-right font-medium" style={{ color: '#059669' }}>
                            {formatCurrency(thanhTien)}
                          </td>
                          <td className="p-2 border text-center">
                            <IconButton size="small" sx={{ color: '#2563eb' }}>
                              <FaEdit size={12} />
                            </IconButton>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Box>
            </Collapse>
          </Paper>
        )}

        {/* Documents section */}
        {procedureData.hosochungtus && procedureData.hosochungtus.length > 0 && (
          <Paper sx={{ p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaFileAlt style={{ color: '#2563eb', marginRight: 8 }} />
                <Typography variant="h6" fontWeight={600}>
                  TÀI LIỆU CẦN CHUẨN BỊ
                </Typography>
              </Box>
              <IconButton onClick={() => toggleSection('documents')}>
                {expandedSections.documents ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Collapse in={expandedSections.documents !== false} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 3 }}>
                <table className="w-full border border-gray-300" style={{ tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '40%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '20%' }} />
                  </colgroup>
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-2 border text-center">STT</th>
                      <th className="p-2 border text-center">Hồ sơ</th>
                      <th className="p-2 border text-center">Số lượng</th>
                      <th className="p-2 border text-center">Mẫu</th>
                      <th className="p-2 border text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {procedureData.hosochungtus.map((doc, idx) => (
                      <tr key={`${doc.id}-${idx}`}>
                        <td className="p-2 border text-center">{idx + 1}</td>
                        <td className="p-2 border" style={{ wordWrap: 'break-word' }}>
                          {capitalizeWords(doc.name)}
                        </td>
                        <td className="p-2 border text-center">01 bản</td>
                        <td className="p-2 border text-center">
                          {doc.path ? (
                            <a href={doc.path} target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-800">
                              Tải xuống
                            </a>
                          ) : (
                            <span className="text-gray-400">Không có</span>
                          )}
                        </td>
                        <td className="p-2 border text-center">
                          <IconButton size="small" sx={{ color: '#2563eb' }}>
                            <FaEdit size={12} />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Collapse>
          </Paper>
        )}

        {/* Notes section */}
        {procedureData.ghichus && procedureData.ghichus.length > 0 && (
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaInfoCircle style={{ color: '#2563eb', marginRight: 8 }} />
                <Typography variant="h6" fontWeight={600}>
                  GHI CHÚ QUAN TRỌNG
                </Typography>
              </Box>
              <IconButton onClick={() => toggleSection('notes')}>
                {expandedSections.notes ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Collapse in={expandedSections.notes !== false} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 3 }}>
                {procedureData.ghichus.map((note, idx) => (
                  <Box key={`${note.id}-${idx}`} sx={{ mb: 2, display: 'flex', alignItems: 'start' }}>
                    <Typography variant="body2" sx={{ color: '#374151', flex: 1 }}>
                      • {capitalizeWords(note.text)}
                    </Typography>
                    <IconButton size="small" sx={{ color: '#2563eb', ml: 1 }}>
                      <FaEdit size={12} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Paper>
        )}
      </Box>
    );
  };

  if (!type) {
    return (
      <div className="py-4 px-6">
        {renderBreadcrumbs()}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
          <Typography variant="h6" color="text.secondary">
            Vui lòng chọn loại quy trình từ menu bên trái
          </Typography>
        </Box>
      </div>
    );
  }

  return (
    <div className="py-4 px-6">
      {renderBreadcrumbs()}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
        {/* Left sidebar - procedures list */}
        <Box sx={{ width: 350, flexShrink: 0 }}>
          <Paper sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
            {renderProceduresList()}
          </Paper>
        </Box>

        {/* Middle content - procedure detail */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ minHeight: 'calc(100vh - 200px)' }}>
            {renderProcedureDetail()}
          </Paper>
        </Box>

        {/* Right sidebar - ChatBot */}
        <Box sx={{ width: 350, flexShrink: 0 }}>
          <ChatBot 
            procedureName={getProcedureSubName()}
            currentStep="quản lý quy trình"
          />
        </Box>
      </Box>
    </div>
  );
}