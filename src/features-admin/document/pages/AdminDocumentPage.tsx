import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Chip,
  Divider,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
} from "@mui/material";
import { FaHome, FaClock, FaFileAlt } from "react-icons/fa";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditForm from "../components/EditForm.tsx";
import ProcedureStepper from '@/features-admin/document/components/ProcedureStepper.tsx';
import ChatBot from '@/components/ChatBot.tsx';

// ====== Data for sidebar ======
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
  { label: "Bước 3", sublabel: "Mục này làm việc trực tiếp tại phòng" },
  { label: "Bước 4", sublabel: "Mục này làm việc trực tiếp tại phòng" },
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
      "Thành phần", "Đơn giá", "Định mức", "Số lượng", "Thành tiền", "Ghi chú", "Hành động"
    ],
    tableType: "full" // bảng với tất cả cột
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
    tableType: "simple" // bảng với 2 cột
  },
  {
    title: "Mục này làm việc trực tiếp tại phòng",
    content: [
      
    ],
    documents: ["Biên lai tiếp nhận", "Mã số hồ sơ"],
    timeEstimate: "30 phút",
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
    title: "Mục này làm việc trực tiếp tại phòng",
    content: [
      
    ],
    documents: ["Biên lai tiếp nhận", "Mã số hồ sơ"],
    timeEstimate: "30 phút",
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

// ====== Table row type ======
type ChiPhiItem = {
  thanhPhan: string;
  donGia: number;
  dinhMuc: number;
  soLuong: number;
  luuY?: string;
};



// ====== Sidebar Item ======
const SidebarItem: React.FC<{
  item: ProcessItem;
  isOpen: boolean;
  onToggle: () => void;
  selected: string | null;
  onSelect: (id: string, title: string) => void;
}> = ({ item, isOpen, onToggle, selected, onSelect }) => (
  <div>
    <div
      className="flex items-center cursor-pointer px-4 py-3 hover:bg-gray-100 font-semibold"
      onClick={onToggle}
    >
      {isOpen ? <FiChevronDown className="mr-2" /> : <FiChevronRight className="mr-2" />}
      {item.title}
    </div>
    {isOpen && (
      <div className="ml-6 border-l border-gray-300">
        {item.children?.map((child, idx) => (
          <div
            key={child.id}
            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 ${
              selected === child.id ? "bg-blue-100 font-medium" : ""
            }`}
            onClick={() => onSelect(child.id, child.title)}
          >
            {idx + 1}. {child.title}
          </div>
        ))}
      </div>
    )}
  </div>
);


// Minimal wrapper so the code runs
function ModalWrapper({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(2px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      // Optional: close on backdrop click
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 600,
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </Box>
    </Box>
  );
}

// ====== Main Component ======
export default function AdminDocumentPage() {
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const processId = params.get('process');
    const itemId = params.get('item');
    
    if (processId && itemId) {
      const processIndex = processList.findIndex(p => p.id === processId);
      if (processIndex !== -1) {
        setOpenIndex(processIndex);
        
        const process = processList[processIndex];
        const item = process.children?.find(c => c.id === itemId);
        if (item) {
          setSelectedItem(itemId);
          setSelectedTitle(item.title);
        }
      }
    }
  }, [location.search]);

	const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
	const [editRow, setEditRow] = useState<ChiPhiItem | null>(null);
	const [editIndex, setEditIndex] = useState<number | null>(null);

	const openAddForm = () => {
	  setFormMode("add");
	  setEditRow(null);
	  setEditIndex(null);
	};

	const openEditForm = (row: ChiPhiItem, idx: number) => {
	  setFormMode("edit");
	  setEditRow(row);
	  setEditIndex(idx);
	};

	const closeForm = () => {
	  setFormMode(null);
	  setEditRow(null);
	  setEditIndex(null);
	};

	// unified submit
	const handleSubmit = (item: ChiPhiItem) => {
	  if (formMode === "add") {
		setTableData((prev) => [...prev, item]);
	  } else if (formMode === "edit" && editIndex !== null) {
		setTableData((prev) => prev.map((r, i) => (i === editIndex ? item : r)));
	  }
	  closeForm();
	};

	// delete by index
	const handleDelete = (rowIdx: number) => {
	  const currentStepData = stepContents[activeStep];
	  const row = currentStepData.tableData[rowIdx];
	  if (window.confirm(`Bạn có chắc muốn xóa "${row.thanhPhan}"?`)) {
		const updatedStepContents = [...stepContents];
		updatedStepContents[activeStep].tableData = updatedStepContents[activeStep].tableData.filter((_, i) => i !== rowIdx);
	  }
	};

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
		  <Box
			sx={{
			  display: "flex",
			  justifyContent: "space-between",
			  alignItems: "center",
			  mb: 2,
			}}
		  >
			<Typography variant="h6" fontWeight={600}>
			  CÁC THÀNH PHẦN TRONG BẢNG DỰ TOÁN
			</Typography>
			<IconButton onClick={openAddForm} aria-label="Thêm dòng">
			  +
			</IconButton>
		  </Box>

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
					  <td className="p-2 border">
						<IconButton onClick={() => openEditForm(row, idx)}>
						  <EditIcon fontSize="small" />
						</IconButton>
						<IconButton size="small" color="error" onClick={() => handleDelete(idx)}>
						  <DeleteIcon fontSize="small" />
						</IconButton>
					  </td>
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

  const [tableData, setTableData] = useState<ChiPhiItem[]>([]);

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
                  <Box sx={{  gap: 2, mb: 4, width: "100%" }}>
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

                    {/* Documents */}
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Tài liệu cần chuẩn bị:
                    </Typography>

                    {/* Dynamic Table based on current step */}
                    {renderTable(currentStep)}
                  </Paper>
                </div>

                <div className="w-32%">
                  <ChatBot />
                </div>
            </div>

			{formMode && (
			  <ModalWrapper onClose={closeForm}>
				<EditForm
				  onClose={closeForm}
				  onSubmit={handleSubmit}
				/>
			  </ModalWrapper>
			)}


          </>
        ) : (
          <Typography variant="h6" sx={{ color: "#6b7280" }}>
            {/* Vui lòng chọn một quy trình ở menu bên trái. */}
          </Typography>
        )}
      </div>
    </div>
  );
}

