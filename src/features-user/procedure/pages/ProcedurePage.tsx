
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box, Paper, Chip, Divider, CircularProgress, Alert, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { FaHome, FaClock, FaFileAlt, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import nprogress from 'nprogress';
import ProcedureStepper from '@/features-admin/document/components/ProcedureStepper.tsx';
import ChatBot from '@/components/ChatBot.tsx';
import { useNProgress } from "@/hooks/useNProgress.ts";
import { fetchProcedureDetail } from '../services/procedureService.ts';

// ====== API Response Types ======
interface ThanhPhanDuToan {
  id: string;
  name: string;
  description: string;
  type: string;
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
        <table className="w-full border border-gray-300">
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
                <td className="p-2 border">{doc.name}</td>
                <td className="p-2 border">
                  <input type="number" min={0} style={{ width: 60, padding: 4, border: '1px solid #e5e7eb', borderRadius: 4 }} />
                </td>
                <td className="p-2 border text-center">
                  {doc.path ? (
                    <a href={doc.path} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Tải mẫu</a>
                  ) : ''}
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
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [procedureData, setProcedureData] = useState<ProcedureData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startProgress, doneProgress } = useNProgress();

  useEffect(() => {
    // Check for path parameter first (e.g., /procedures/4:20fc5928-6361-4898-af87-91e3a62d9acf:177)
    const procedureId = params.id;
    
    // Check for URL parameters (e.g., /procedures?process=p1&item=168)
    const urlParams = new URLSearchParams(location.search);
    const processId = urlParams.get('process');
    const itemId = urlParams.get('item');
    
    // Priority: path parameter > URL parameter
    const finalProcedureId = procedureId || itemId;
    
    if (finalProcedureId) {
      loadProcedureData(finalProcedureId);
    } else {
      // Reset if no specific item selected
      setSelectedItem(null);
      setSelectedTitle("");
      setActiveStep(0);
      setProcedureData(null);
    }
  }, [location.search, params.id]);

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

        <table className="w-full border border-gray-300">
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
              // Lấy số lượng và đơn giá từ input nếu có, nếu không lấy từ item
              const soLuong = item.soLuong !== undefined && item.soLuong !== null && item.soLuong !== '' ? Number(item.soLuong) : undefined;
              const donGia = item.donGia !== undefined && item.donGia !== null && item.donGia !== '' ? Number(item.donGia) : undefined;
              const thanhTien = soLuong !== undefined && donGia !== undefined ? soLuong * donGia : undefined;
              return (
                <tr key={`${item.id}-${idx}`}>
                  <td className="p-2 border text-center">{idx + 1}</td>
                  <td className="p-2 border font-medium">{item.name}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min={0}
                      defaultValue={item.soLuong || ''}
                      style={{ width: 70, padding: 4, border: '1px solid #e5e7eb', borderRadius: 4 }}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min={0}
                      defaultValue={item.donGia || ''}
                      style={{ width: 100, padding: 4, border: '1px solid #e5e7eb', borderRadius: 4 }}
                    />
                  </td>
                  <td className="p-2 border text-right">{(soLuong !== undefined && donGia !== undefined) ? thanhTien.toLocaleString() : ''}</td>
                  <td className="p-2 border">
                    <Chip 
                      label={item.type === 'domestic' ? 'Trong nước' : 'Quốc tế'} 
                      size="small" 
                      color={item.type === 'domestic' ? 'primary' : 'secondary'}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
                href="#"
                onClick={() => setSelectedItem(null)}
              >
                <FaHome className="inline mr-1" /> Trang chủ
              </Link>

              <Link
                underline="none"
                color="inherit"
                href="/procedures"
                onClick={() => setSelectedItem(null)}
              >
                Tra cứu thủ tục
              </Link>
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
                <ChatBot />
              </div>
            </div>
          </>
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

