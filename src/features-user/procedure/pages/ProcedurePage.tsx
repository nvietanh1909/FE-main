import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box, Paper, Chip, Divider } from '@mui/material';
import { FaHome, FaClock, FaFileAlt } from 'react-icons/fa';
import nprogress from 'nprogress';
import ProcedureStepper from '@/features-admin/document/components/ProcedureStepper.tsx';
import ChatBot from '@/components/ChatBot.tsx';
// ====== Data for processes ======
type ProcessItem = {
  id: string;
  title: string;
  children?: { id: string; title: string }[];
};

const processList: ProcessItem[] = [
  {
    id: "p1",
    title: "Quy trình thanh toán hoạt động thường xuyên",
    children: [
      { id: "p1c1", title: "Công tác phí trong nước" },
      { id: "p1c2", title: "Công tác phí nước ngoài" },
      { id: "p1c3", title: "Hội nghị, hội thảo trong nước" },
      { id: "p1c4", title: "Hội nghị, hội thảo quốc tế tại Việt Nam" },
    ],
  },
  {
    id: "p2",
    title: "Quy trình mua sắm trang thiết bị",
    children: [
      { id: "p2c1", title: "Mua máy tính" },
      { id: "p2c2", title: "Mua bàn ghế" },
      { id: "p2c3", title: "Mua vật tư tiêu hao" },
    ],
  },
];

// ====== Steps ======
const steps = [
  { label: "Bước 1", sublabel: "Lập hồ sơ dự toán" },
  { label: "Bước 2", sublabel: "Chuẩn bị các giấy tờ kèm theo" },
  { label: "Bước 3", sublabel: "Nộp hồ sơ và xét duyệt" },
  { label: "Bước 4", sublabel: "Hoàn thành thủ tục" },
];

// ====== Step contents ======
const stepContents = [
  {
    title: "Chuẩn bị hồ sơ cần thiết",
    content: [
      "1. Đơn đề nghị thanh toán công tác phí (theo mẫu)",
      "2. Bảng kê chi tiết các khoản chi phí phát sinh",
      "3. Các hóa đơn, chứng từ gốc (vé máy bay, hóa đơn khách sạn, taxi...)",
    ],
    documents: ["Đơn đề nghị", "Bảng kê chi phí", "Hóa đơn gốc"],
    timeEstimate: "1-2 ngày làm việc",
    tableData: [
      {
        thanhPhan: "Vé máy bay khứ hồi",
        donGia: 2000000,
        dinhMuc: 1,
        soLuong: 1,
        luuY: "Hạng phổ thông",
      },
      {
        thanhPhan: "Khách sạn",
        donGia: 1000000,
        dinhMuc: 3,
        soLuong: 1,
        luuY: "3 sao trở lên",
      },
    ],
    tableHeaders: [
      "Thành phần", "Đơn giá", "Định mức", "Số lượng", "Thành tiền", "Ghi chú"
    ],
    tableType: "full"
  },
  {
    title: "Chuẩn bị các giấy tờ kèm theo",
    content: [
      "1. Nộp hồ sơ trực tiếp tại Phòng Tài chính - Kế toán",
      "2. Cán bộ tiếp nhận sẽ kiểm tra tính đầy đủ của hồ sơ",
    ],
    documents: ["Biên lai tiếp nhận", "Mã số hồ sơ"],
    timeEstimate: "30 phút",
    tableData: [
      {
        thanhPhan: "Biên lai tiếp nhận",
        luuY: "Lấy từ phòng Tài chính",
      },
      {
        thanhPhan: "Mã số hồ sơ",
        luuY: "Để theo dõi tiến độ",
      },
    ],
    tableHeaders: ["Thành phần", "Mô tả"],
    tableType: "simple"
  },
  {
    title: "Nộp hồ sơ và xét duyệt",
     content: [
      
    ],
    documents: ["Biên lai tiếp nhận", "Mã số hồ sơ"],
    timeEstimate: "2-3 ngày làm việc",
    tableData: [
      {
        thanhPhan: "Thẩm định hồ sơ",
        luuY: "Kiểm tra tính hợp lệ",
      },
      {
        thanhPhan: "Báo cáo thẩm định",
        luuY: "Kết quả đánh giá",
      },
    ],
    tableHeaders: ["Thành phần", "Mô tả"],
    tableType: "simple"
  },
  {
    title: "Hoàn thành thủ tục",
    content: [
      
    ],
    documents: ["Quyết định phê duyệt", "Biên lai thanh toán"],
    timeEstimate: "1 ngày làm việc",
    tableData: [
      {
        thanhPhan: "Quyết định phê duyệt",
        luuY: "Văn bản chính thức",
      },
      {
        thanhPhan: "Thông báo thanh toán",
        luuY: "Gửi đến người nộp hồ sơ",
      },
    ],
    tableHeaders: ["Thành phần", "Mô tả"],
    tableType: "simple"
  },
];

export default function ProcedurePage() {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);

  nprogress.configure({ showSpinner: false });
  nprogress.start();

  useEffect(() => {
    nprogress.done();
    
    const params = new URLSearchParams(location.search);
    const processId = params.get('process');
    const itemId = params.get('item');
    
    if (processId && itemId) {
      const process = processList.find(p => p.id === processId);
      if (process) {
        const item = process.children?.find(c => c.id === itemId);
        if (item) {
          setSelectedItem(itemId);
          setSelectedTitle(item.title);
        }
      }
    } else {
      // Reset if no specific item selected
      setSelectedItem(null);
      setSelectedTitle("");
      setActiveStep(0);
    }
  }, [location.search]);

  // Render table function
  const renderTable = (stepData: any) => {
    if (!stepData.tableData || stepData.tableData.length === 0) return null;

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
          CÁC THÀNH PHẦN TRONG BẢNG DỰ TOÁN
        </Typography>

        <table className="w-full border border-gray-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              {stepData.tableHeaders.map((header: string, idx: number) => (
                <th key={idx} className="p-2 border text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stepData.tableData.map((row: any, idx: number) => (
              <tr key={`${row.thanhPhan}-${idx}`}>
                <td className="p-2 border">{row.thanhPhan}</td>
                
                {stepData.tableType === "full" ? (
                  <>
                    <td className="p-2 border">{row.donGia?.toLocaleString()}</td>
                    <td className="p-2 border">{row.dinhMuc}</td>
                    <td className="p-2 border">{row.soLuong}</td>
                    <td className="p-2 border">
                      {((row.donGia || 0) * (row.dinhMuc || 0) * (row.soLuong || 0)).toLocaleString()}
                    </td>
                    <td className="p-2 border">{row.luuY}</td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border">{row.luuY}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    );
  };

  const currentStep = stepContents[activeStep];

  return (
    <div className="flex h-screen">
      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedItem ? (
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
                      {currentStep.title}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Chip
                        icon={<FaClock />}
                        label={`Thời gian: ${currentStep.timeEstimate}`}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        icon={<FaFileAlt />}
                        label={`${currentStep.documents.length} tài liệu`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    {/* Content List */}
                    {currentStep.content.length !== 0 && (
                      <>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                          Nội dung thực hiện:
                        </Typography>
                        <ul>
                          {currentStep.content.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: 8 }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {/* Documents section */}
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Tài liệu cần thiết:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                      {currentStep.documents.map((doc, idx) => (
                        <Chip
                          key={idx}
                          label={doc}
                          variant="outlined"
                          color="primary"
                          size="small"
                        />
                      ))}
                    </Box>

                    {/* Table */}
                    {renderTable(currentStep)}
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