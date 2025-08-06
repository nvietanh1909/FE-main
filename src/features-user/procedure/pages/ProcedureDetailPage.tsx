import React, { useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box, Paper, Chip, Divider } from '@mui/material';
import { FaHome, FaClock, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import ProcedureStepper from '@/features-user/procedure/components/ProcedureStepper.tsx';
import ProcedureDetailTable from '@/features-user/procedure/components/ProcedureDetailTable.tsx';
import ChatBot from '@/components/ChatBot.tsx';

const steps = [
  { label: 'Bước 1', sublabel: 'Chuẩn bị hồ sơ' },
  { label: 'Bước 2', sublabel: 'Nộp đơn đăng ký' },
  { label: 'Bước 3', sublabel: 'Thẩm định hồ sơ' },
  { label: 'Bước 4', sublabel: 'Phê duyệt và thanh toán' },
];

const stepContents = [
  {
    title: 'Chuẩn bị hồ sơ cần thiết',
    content: [
      '1. Đơn đề nghị thanh toán công tác phí (theo mẫu)',
      '2. Bảng kê chi tiết các khoản chi phí phát sinh',
      '3. Các hóa đơn, chứng từ gốc (vé máy bay, hóa đơn khách sạn, taxi...)',
      '4. Quyết định cử đi công tác của lãnh đạo đơn vị',
      '5. Báo cáo kết quả công tác (nếu có yêu cầu)',
      '6. Bản sao CMND/CCCD và thẻ nhân viên'
    ],
    documents: ['Đơn đề nghị', 'Bảng kê chi phí', 'Hóa đơn gốc', 'Quyết định cử đi'],
    timeEstimate: '1-2 ngày làm việc',
    status: 'Đang thực hiện'
  },
  {
    title: 'Nộp hồ sơ đăng ký thanh toán',
    content: [
      '1. Nộp hồ sơ trực tiếp tại Phòng Tài chính - Kế toán',
      '2. Cán bộ tiếp nhận sẽ kiểm tra tính đầy đủ của hồ sơ',
      '3. Nhận biên lai xác nhận đã nộp hồ sơ',
      '4. Ghi nhận mã số hồ sơ để theo dõi tiến độ xử lý',
      '5. Bổ sung tài liệu (nếu có yêu cầu từ phòng ban)',
      '6. Xác nhận thông tin liên hệ để nhận thông báo'
    ],
    documents: ['Biên lai tiếp nhận', 'Mã số hồ sơ'],
    timeEstimate: '30 phút',
    status: 'Hoàn thành'
  },
  {
    title: 'Thẩm định và xử lý hồ sơ',
    content: [
      '1. Phòng Tài chính kiểm tra tính hợp lệ của các chứng từ',
      '2. Đối chiếu với quy định về mức chi công tác phí hiện hành',
      '3. Tính toán số tiền được thanh toán theo quy định',
      '4. Làm việc với đơn vị cử đi công tác (nếu cần thiết)',
      '5. Trình lãnh đạo phụ trách phê duyệt',
      '6. Chuẩn bị hồ sơ thanh toán và các thủ tục ngân hàng'
    ],
    documents: ['Tờ trình phê duyệt', 'Bảng tính chi phí'],
    timeEstimate: '3-5 ngày làm việc',
    status: 'Chờ xử lý'
  },
  {
    title: 'Phê duyệt và thực hiện thanh toán',
    content: [
      '1. Lãnh đạo đơn vị xem xét và phê duyệt tờ trình',
      '2. Phòng Tài chính lập lệnh chi và các chứng từ thanh toán',
      '3. Chuyển khoản hoặc chi tiền mặt theo yêu cầu',
      '4. Gửi thông báo kết quả đến người được thanh toán',
      '5. Lưu trữ hồ sơ theo quy định về quản lý tài liệu',
      '6. Cập nhật thông tin vào hệ thống quản lý tài chính'
    ],
    documents: ['Lệnh chi', 'Phiếu thanh toán', 'Thông báo kết quả'],
    timeEstimate: '2-3 ngày làm việc',
    status: 'Chưa bắt đầu'
  }
];

const tableData = [
  { name: 'Vé máy bay khứ hồi', desc: 'Hà Nội - TP.HCM', quantity: 1, note: 'Hạng phổ thông' },
  { name: 'Khách sạn', desc: 'Chi phí lưu trú 3 ngày', quantity: 3, note: '3 sao trở lên' },
  { name: 'Ăn uống', desc: 'Phụ cấp ăn uống theo quy định', quantity: 3, note: '200.000đ/ngày' },
  { name: 'Di chuyển tại địa phương', desc: 'Taxi, grab từ sân bay và trong thành phố', quantity: 1, note: 'Có hóa đơn' },
  { name: 'Phụ cấp công tác', desc: 'Phụ cấp theo ngày công tác', quantity: 3, note: '100.000đ/ngày' },
];

export default function ProcedureDetailPage() {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);

  const getCurrentStepData = () => stepContents[activeStep];
  const currentStep = getCurrentStepData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'success';
      case 'Đang thực hiện': return 'primary';
      case 'Chờ xử lý': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="py-4 px-6">
      <Breadcrumbs sx={{fontSize: "14px"}} separator=">" aria-label="breadcrumb" className="text-base mb-4">
        <Link underline="none" color="inherit" href="/" className="flex items-center gap-1">
          <FaHome className="text-lg" />
          <span>Trang chủ</span>
        </Link>
        <Link underline="none" color="inherit" href="/procedures">Tra cứu thủ tục</Link>
        <Typography sx={{fontSize: "14px"}} color="#2563eb" fontWeight={600}>Công tác phí trong nước</Typography>
      </Breadcrumbs>

      {/* Header Section */}
      <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
        {/* Main Content - Left Side */}
        <Box sx={{ flex: 1 }}>
          <ProcedureStepper steps={steps} activeStep={activeStep} onStepChange={setActiveStep} />
          
          {/* Step Content */}
          <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', mb: 3 }}>
            {/* Step Header */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#1f2937' }}>
                  {currentStep.title}
                </Typography>
                <Chip 
                  label={currentStep.status} 
                  color={getStatusColor(currentStep.status)}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip 
                  icon={<FaClock />} 
                  label={`Thời gian: ${currentStep.timeEstimate}`} 
                  variant="outlined" 
                  size="small"
                  sx={{  padding: '4px 8px' }}
                />
                <Chip 
                  icon={<FaFileAlt />} 
                  label={`${currentStep.documents.length} tài liệu`} 
                  variant="outlined" 
                  size="small" 
                  sx={{  padding: '4px 8px' }}
                />
              </Box>
              <Divider />
            </Box>

            {/* Step Content */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#374151' }}>
                Nội dung thực hiện:
              </Typography>
              <Box component="ul" sx={{ pl: 0, mb: 3 }}>
                {currentStep.content.map((item, idx) => (
                  <Box component="li" key={idx} sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    mb: 1.5,
                    listStyle: 'none'
                  }}>
                    <Box sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      mt: 1,
                      mr: 2,
                      flexShrink: 0
                    }} />
                    <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#374151' }}>
                Tài liệu cần chuẩn bị:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {currentStep.documents.map((doc, idx) => (
                  <Chip key={idx} label={doc} variant="outlined" size="small" />
                ))}
              </Box>
            </Box>

            {/* Table Section */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#374151' }}>
                  Chi tiết các khoản chi phí:
                </Typography>
                <ProcedureDetailTable data={tableData} />
              </Box>
            )}
          </Paper>
        </Box>
        
        {/* ChatBot - Right Side */}
        <Box sx={{ width: '350px', flexShrink: 0 }}>
          <ChatBot />
        </Box>
      </Box>
    </div>
  );
} 