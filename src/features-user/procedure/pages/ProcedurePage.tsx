
import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box, Paper, Chip, Divider, CircularProgress, Alert, Collapse, IconButton, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { FaHome, FaClock, FaFileAlt, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import nprogress from 'nprogress';
import ProcedureStepper from '@/features-admin/document/components/ProcedureStepper.tsx';
import ChatBot from '@/components/ChatBot.tsx';
import { useNProgress } from "@/hooks/useNProgress.ts";
import { fetchProcedureDetail, fetchProcedures } from '../services/procedureService.ts';
import { capitalizeWords, formatCurrency, formatNumber } from '@/utils/textUtils.ts';

// ====== API Response Types ======
interface ThanhPhanDuToan {
  id: string;
  name: string;
  description: string;
  type: string;
  // Optional fields for user input
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

// API response structure theo cấu trúc thực tế
interface ProcedureResponse {
  success: boolean;
  data: ProcedureData;
}

// ====== Steps ======
const steps = [
  { label: "Bước 1", sublabel: "Lập hồ sơ dự toán" },
  { label: "Bước 2", sublabel: "Chuẩn bị các giấy tờ kèm theo" },
  { label: "Bước 3", sublabel: "Nộp hồ sơ và xét duyệt" },
  { label: "Bước 4", sublabel: "Hoàn thành thủ tục" },
];

export default function ProcedurePage() {
  const navigate = useNavigate();
  // Bảng tài liệu cần chuẩn bị cho bước 2
  const renderTaiLieuTable = () => {
    if (!procedureData?.hosochungtus || procedureData.hosochungtus.length === 0) return null;
    return (
      <Box
        sx={{
          mt: 3,
          px: 4,
          py: 2,
          borderRadius: 2,
          backgroundColor: "#ffffffff",
          border: "1px solid #e5e7eb",
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          TÀI LIỆU CẦN CHUẨN BỊ
        </Typography>
        <table className="w-full border border-gray-300" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '8%' }} />
            <col style={{ width: '45%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 border text-center">STT</th>
              <th className="p-2 border text-center">Hồ sơ</th>
              <th className="p-2 border text-center">Số lượng</th>
              <th className="p-2 border text-center">Mẫu</th>
              <th className="p-2 border text-center">Chú ý</th>
            </tr>
          </thead>
          <tbody>
            {procedureData.hosochungtus.map((doc, idx) => (
              <tr key={`${doc.id}-${idx}`}> 
                <td className="p-2 border text-center">{idx + 1}</td>
                <td className="p-2 border" style={{ wordWrap: 'break-word' }}>
                  {capitalizeWords(doc.name)}
                </td>
                <td className="p-2 border text-center">
                  <input 
                    type="number" 
                    min={0} 
                    defaultValue={1}
                    style={{ 
                      width: '100%', 
                      padding: 4, 
                      border: '1px solid #e5e7eb', 
                      borderRadius: 4,
                      textAlign: 'center'
                    }} 
                  />
                </td>
                <td className="p-2 border text-center">
                  {doc.path ? (
                    <a href={doc.path} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                      Tải mẫu
                    </a>
                  ) : (
                    <span className="text-gray-400">Không có</span>
                  )}
                </td>
                <td className="p-2 border text-center">
                  <span className="text-xs text-gray-600">01 bản</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    );
  };
  const [showDocuments, setShowDocuments] = useState(false);
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [procedureData, setProcedureData] = useState<ProcedureData | null>(null);
  const [proceduresList, setProceduresList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State to track user input for budget components
  const [budgetInputs, setBudgetInputs] = useState<Record<string, { soLuong?: number; donGia?: number }>>({});
  
  const { startProgress, doneProgress } = useNProgress();

  // Get procedure sub-category name from URL parameters
  const getProcedureSubName = () => {
    const type = searchParams.get('type');
    if (type === 'trong-nuoc') {
      return 'Công tác phí trong nước';
    } else if (type === 'nuoc-ngoai') {
      return 'Công tác phí nước ngoài';
    }
    return null;
  };

  const resetState = () => {
    setSelectedItem(null);
    setSelectedTitle("");
    setActiveStep(0);
    setProcedureData(null);
    setProceduresList([]);
    setBudgetInputs({}); // Clear user input data
  };

  // Handle budget input changes
  const handleBudgetInputChange = (itemId: string, field: 'soLuong' | 'donGia', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setBudgetInputs(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: numValue
      }
    }));
  };

  // Get current input value for a budget item
  const getBudgetInputValue = (itemId: string, field: 'soLuong' | 'donGia'): number | undefined => {
    return budgetInputs[itemId]?.[field];
  };

  // Calculate total amount for all budget items
  const calculateTotalAmount = (): number => {
    if (!procedureData?.thanhphandutoans) return 0;
    
    return procedureData.thanhphandutoans.reduce((total, item) => {
      const soLuong = getBudgetInputValue(item.id, 'soLuong');
      const donGia = getBudgetInputValue(item.id, 'donGia');
      if (soLuong !== undefined && donGia !== undefined) {
        return total + (soLuong * donGia);
      }
      return total;
    }, 0);
  };

  // Prepare budget data for saving to database
  const prepareBudgetDataForSave = () => {
    if (!procedureData?.thanhphandutoans) return [];
    
    return procedureData.thanhphandutoans.map(item => ({
      id: item.id,
      name: item.name,
      soLuong: getBudgetInputValue(item.id, 'soLuong'),
      donGia: getBudgetInputValue(item.id, 'donGia'),
      thanhTien: (() => {
        const soLuong = getBudgetInputValue(item.id, 'soLuong');
        const donGia = getBudgetInputValue(item.id, 'donGia');
        return soLuong !== undefined && donGia !== undefined ? soLuong * donGia : undefined;
      })()
    })).filter(item => item.soLuong !== undefined || item.donGia !== undefined); // Only include items with user input
  };

  // Save budget data to backend (placeholder function)
  const saveBudgetData = async () => {
    try {
      const budgetData = prepareBudgetDataForSave();
      const totalAmount = calculateTotalAmount();
      
      console.log('Budget data to save:', {
        procedureId: selectedItem,
        budgetItems: budgetData,
        totalAmount: totalAmount
      });
      
      // TODO: Implement API call to save budget data
      // const response = await fetch(`${BASE_URL}/procedures/${selectedItem}/budget`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getToken()}`
      //   },
      //   body: JSON.stringify({
      //     budgetItems: budgetData,
      //     totalAmount: totalAmount
      //   })
      // });
      
      alert('Dữ liệu dự toán đã được chuẩn bị để lưu. Kiểm tra console để xem dữ liệu.');
    } catch (error) {
      console.error('Error saving budget data:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu dự toán.');
    }
  };

  useEffect(() => {
    // Check for URL parameters
    const urlParams = new URLSearchParams(location.search);
    const type = urlParams.get('type');
    const procedureId = params.id;
    const itemId = urlParams.get('item');
    
    console.log('ProcedurePage useEffect triggered:', { type, procedureId, itemId, pathname: location.pathname, search: location.search });
    
    if (procedureId || itemId) {
      // Load specific procedure by ID
      const finalProcedureId = procedureId || itemId;
      loadProcedureData(finalProcedureId);
    } else if (type) {
      // Load procedures list and filter by type
      loadProceduresList(type);
    } else {
      // Reset if no parameters
      resetState();
    }
  }, [location.search, params.id]);

  const loadProceduresList = async (type: string) => {
    try {
      setLoading(true);
      setError(null);
      startProgress();
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetchProcedures(token);
      
      if (response && response.success) {
        let filteredItems = [];
        
        if (type === 'trong-nuoc') {
          // Filter items with parent path: "QUY TRÌNH 1. THANH TOÁN HOẠT ĐỘNG THƯỜNG XUYÊN / Công tác phí trong nước"
          filteredItems = response.data.filter((item: any) => {
            const parent = item?.parent ?? '';
            const normalizedParent = parent.toLowerCase().normalize('NFC');
            return normalizedParent.includes("thanh toán hoạt động thường xuyên") &&
                   normalizedParent.includes("công tác phí trong nước");
          });
          setSelectedTitle("Công tác phí trong nước");
        } else if (type === 'nuoc-ngoai') {
          // Filter items with parent path: "QUY TRÌNH 1. THANH TOÁN HOẠT ĐỘNG THƯỜNG XUYÊN / Công tác phí nước ngoài"
          filteredItems = response.data.filter((item: any) => {
            const parent = item?.parent ?? '';
            const normalizedParent = parent.toLowerCase().normalize('NFC');
            return normalizedParent.includes("thanh toán hoạt động thường xuyên") &&
                   normalizedParent.includes("công tác phí nước ngoài");
          });
          setSelectedTitle("Công tác phí nước ngoài");
        }
        
        console.log(`Filtered items for ${type}:`, filteredItems);
        console.log('Sample parent strings:', response.data.slice(0, 3).map((item: any) => item.parent));
        setProceduresList(filteredItems);
        
        // If only one item, load it directly
        if (filteredItems.length === 1) {
          loadProcedureData(filteredItems[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading procedures list:', err);
      setError('Có lỗi xảy ra khi tải danh sách thủ tục');
    } finally {
      setLoading(false);
      doneProgress();
    }
  };

  const loadProcedureData = async (procedureId: string) => {
    try {
      setLoading(true);
      setError(null);
      startProgress();
      
      console.log('Loading procedure data for ID:', procedureId);
      const response: ProcedureResponse = await fetchProcedureDetail(procedureId);
      console.log('API Response:', response);
      
      if (response && response.success && response.data) {
        console.log('Setting procedure data:', response.data);
        setProcedureData(response.data);
        setSelectedItem(procedureId);
        setSelectedTitle(response.data.title);
      } else {
        console.error('Invalid response structure:', response);
        setError('Không thể tải dữ liệu thủ tục');
      }
    } catch (err) {
      console.error('Error loading procedure data:', err);
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError('Có lỗi xảy ra khi tải dữ liệu thủ tục');
      }
    } finally {
      setLoading(false);
      doneProgress();
    }
  };

  const renderThanhPhanTable = () => {
    if (!procedureData?.thanhphandutoans || procedureData.thanhphandutoans.length === 0) return null;

    return (
      <Box
        sx={{
          mt: 3,
          px: 4,
          py: 2,
          borderRadius: 2,
          backgroundColor: "#ffffffff",
          border: "1px solid #e5e7eb",
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          CÁC THÀNH PHẦN DỰ TOÁN
        </Typography>

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
              <th className="p-2 border text-center">Tên thành phần</th>
              <th className="p-2 border text-center">Số lượng</th>
              <th className="p-2 border text-center">Đơn giá/Định mức</th>
              <th className="p-2 border text-center">Thành tiền</th>
              <th className="p-2 border text-center">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {procedureData.thanhphandutoans.map((item, idx) => {
              // Get values from user input state or default values
              const soLuong = getBudgetInputValue(item.id, 'soLuong') || 1;
              const donGia = getBudgetInputValue(item.id, 'donGia') || 100000;
              const thanhTien = soLuong * donGia;
              
              return (
                <tr key={`${item.id}-${idx}`}>
                  <td className="p-2 border text-center">{idx + 1}</td>
                  <td className="p-2 border font-medium" style={{ wordWrap: 'break-word' }}>
                    {capitalizeWords(item.name)}
                  </td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      min={0}
                      value={getBudgetInputValue(item.id, 'soLuong') || 1}
                      onChange={(e) => handleBudgetInputChange(item.id, 'soLuong', e.target.value)}
                      style={{ width: '100%', padding: 4, border: '1px solid #e5e7eb', borderRadius: 4, textAlign: 'center' }}
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      min={0}
                      value={getBudgetInputValue(item.id, 'donGia') || 100000}
                      onChange={(e) => handleBudgetInputChange(item.id, 'donGia', e.target.value)}
                      style={{ width: '100%', padding: 4, border: '1px solid #e5e7eb', borderRadius: 4, textAlign: 'right' }}
                    />
                  </td>
                  <td className="p-2 border text-right font-medium" style={{ color: '#059669' }}>
                    {formatCurrency(thanhTien)}
                  </td>
                  <td className="p-2 border text-center">
                    <Chip 
                      label={capitalizeWords(item.type === 'domestic' ? 'trong nước' : 'quốc tế')} 
                      size="small" 
                      color={item.type === 'domestic' ? 'primary' : 'secondary'}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Save Budget Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={saveBudgetData}
            sx={{ fontWeight: 600 }}
          >
            Lưu dự toán
          </Button>
        </Box>
        
      </Box>
    );
  };

  // Render documents section
  const renderDocuments = () => {
    if (!procedureData?.hosochungtus || procedureData.hosochungtus.length === 0) return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {procedureData.hosochungtus.map((doc, idx) => (
            <Chip
              key={`${doc.id}-${idx}`}
              label={doc.name}
              variant="outlined"
              color="primary"
              size="small"
              icon={<FaFileAlt />}
            />
          ))}
        </Box>
      </Box>
    );
  };

  // Render notes section
  const renderNotes = () => {
    if (!procedureData?.ghichus || procedureData.ghichus.length === 0) return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaInfoCircle />
          Ghi chú quan trọng:
        </Typography>
        <Box sx={{ pl: 2 }}>
          {procedureData.ghichus.map((note, idx) => (
            <Box key={`${note.id}-${idx}`} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, borderLeft: '4px solid #2563eb' }}>
              <Typography variant="body2" color="text.secondary">
                {note.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const currentStep = steps[activeStep];

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              Đang tải dữ liệu thủ tục...
            </Typography>
          </Box>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <Alert severity="error" sx={{ maxWidth: 500 }}>
            {error}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedItem && procedureData ? (
          <>
            {/* Breadcrumb */}
            <Breadcrumbs sx={{ fontSize: "14px", mb: 2 }} separator=">">
              <Link
                underline="none"
                color="inherit"
                component="button"
                onClick={() => navigate('/')}
              >
                <FaHome className="inline mr-1" /> Trang chủ
              </Link>

              <Link
                underline="none"
                color="inherit"
                component="button"
                onClick={() => {
                  setSelectedItem(null);
                  setProcedureData(null);
                  navigate('/procedures');
                }}
              >
                Tra cứu thủ tục
              </Link>

              {/* Category breadcrumb based on URL type parameter */}
              {searchParams.get('type') && (
                <Link
                  underline="none"
                  color="inherit"
                  component="button"
                  onClick={() => {
                    setSelectedItem(null);
                    setProcedureData(null);
                    const type = searchParams.get('type');
                    navigate(`/procedures?type=${type}`);
                  }}
                >
                  {searchParams.get('type') === 'trong-nuoc' ? 'Công tác phí trong nước' : 'Công tác phí nước ngoài'}
                </Link>
              )}

              <Typography sx={{ fontSize: "14px" }} color="#2563eb" fontWeight={600}>
                {selectedTitle}
              </Typography>
            </Breadcrumbs>

            <div className="flex justify-between">
              <div className="w-66%">
                {/* Steps */}
                <Box sx={{ gap: 2, mb: 4, width: "100%" }}>
                  <ProcedureStepper
                    steps={steps}
                    activeStep={activeStep}
                    onStepChange={setActiveStep}
                  />
                </Box>

                {/* Content Box */}
                <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid #e5e7eb", mb: 3 }}>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                    {currentStep.label}: {currentStep.sublabel}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Chip
                      icon={<FaClock />}
                      label={`Thời gian: 1-3 ngày làm việc`}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      icon={<FaFileAlt />}
                      label={`${procedureData.hosochungtus.length} tài liệu`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  {/* Procedure Description: chỉ hiện ở bước 1, 2 */}
                  {(activeStep === 0 || activeStep === 1) && (
                    <>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Mô tả thủ tục:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                        {procedureData.description}
                      </Typography>
                    </>
                  )}

                  {/* Documents section (step 2, collapsible) */}
                  {activeStep === 1 && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 0, mr: 1 }}>
                          Hồ sơ chứng từ cần thiết
                        </Typography>
                        <IconButton size="small" onClick={() => setShowDocuments((prev) => !prev)}>
                          {showDocuments ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                      <Collapse in={showDocuments}>
                        {renderDocuments()}
                      </Collapse>
                    </Box>
                  )}

                  {/* Table: chỉ hiện ở bước 1, 2 */}
                  {activeStep === 1 && renderTaiLieuTable()}
                  {activeStep === 0 && renderThanhPhanTable()}

                  {/* Notes section */}
                  {renderNotes()}
                </Paper>
              </div>

              <div className="w-32%">
                <ChatBot 
                  procedureName={getProcedureSubName()}
                  currentStep={
                    activeStep === 0 ? "lập hồ sơ dự toán" :
                    activeStep === 1 ? "chuẩn bị các giấy tờ kèm theo" :
                    activeStep === 2 ? "nộp hồ sơ và xét duyệt" :
                    activeStep === 3 ? "hoàn thành thủ tục" :
                    "thực hiện thủ tục"
                  }
                />
              </div>
            </div>
          </>
        ) : proceduresList.length > 0 ? (
          <Box>
            {/* Breadcrumb for procedures list */}
            <Breadcrumbs sx={{ fontSize: "14px", mb: 4 }} separator=">">
              <Link 
                underline="none" 
                color="inherit" 
                component="button"
                onClick={() => navigate('/')}
              >
                <FaHome className="inline mr-1" /> Trang chủ
              </Link>
              <Link 
                underline="none" 
                color="inherit" 
                component="button"
                onClick={() => navigate('/procedures')}
              >
                Tra cứu thủ tục
              </Link>
              <Typography sx={{ fontSize: "14px" }} color="#2563eb" fontWeight={600}>
                {searchParams.get('type') === 'trong-nuoc' ? 'Công tác phí trong nước' : 
                 searchParams.get('type') === 'nuoc-ngoai' ? 'Công tác phí nước ngoài' : 
                 'Quy trình'}
              </Typography>
            </Breadcrumbs>

            {/* Title */}
            <Typography variant="h4" fontWeight={700} sx={{ mb: 3, color: '#1e40af' }}>
              {searchParams.get('type') === 'trong-nuoc' ? 'Công tác phí trong nước' : 
               searchParams.get('type') === 'nuoc-ngoai' ? 'Công tác phí nước ngoài' : 
               'Quy trình'}
            </Typography>

            {/* Procedures List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {proceduresList.map((procedure: any, index: number) => (
                <Paper 
                  key={procedure.id}
                  onClick={() => loadProcedureData(procedure.id)}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    border: '1px solid #e5e7eb',
                    borderLeft: '4px solid #2669FC',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ color: '#1e40af' }}>
                      {index + 1}. {procedure.title || procedure.name}
                    </Typography>
                  </Box>
                  
                  {procedure.description && (
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                      {procedure.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      icon={<FaFileAlt />}
                      label="Xem chi tiết" 
                      size="small" 
                      variant="outlined"
                      sx={{ color: '#2563eb', borderColor: '#2563eb' }}
                    />
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh" }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Chọn một quy trình từ menu bên trái để xem chi tiết
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sử dụng menu "Tra cứu thủ tục" để chọn quy trình bạn muốn tìm hiểu
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
}

