import React, { useState } from "react";
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
import SidebarItem, { ProcessItem } from "../../../components/SidebarItem.tsx";
import ProcedureStepper from '@/features-user/procedure/components/ProcedureStepper.tsx';

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
  { label: "Bước 1", sublabel: "Chuẩn bị hồ sơ" },
  { label: "Bước 2", sublabel: "Nộp đơn đăng ký" },
  { label: "Bước 3", sublabel: "Thẩm định hồ sơ" },
  { label: "Bước 4", sublabel: "Phê duyệt và thanh toán" },
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
  },
  {
    title: "Nộp hồ sơ đăng ký thanh toán",
    content: [
      "1. Nộp hồ sơ trực tiếp tại Phòng Tài chính - Kế toán",
      "2. Cán bộ tiếp nhận sẽ kiểm tra tính đầy đủ của hồ sơ",
    ],
    documents: ["Biên lai tiếp nhận", "Mã số hồ sơ"],
    timeEstimate: "30 phút",
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);

  // Remove showForm entirely
  // const [showForm, setShowForm] = useState(false);
	// state
	const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
	const [editRow, setEditRow] = useState<ChiPhiItem | null>(null);
	const [editIndex, setEditIndex] = useState<number | null>(null);

	// open handlers
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
	  const row = tableData[rowIdx];
	  if (window.confirm(`Bạn có chắc muốn xóa "${row.thanhPhan}"?`)) {
		setTableData((prev) => prev.filter((_, i) => i !== rowIdx));
	  }
	};



  const [tableData, setTableData] = useState<ChiPhiItem[]>([
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
  ]);

  const currentStep = stepContents[activeStep];


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {/* <div className="w-80 border-r overflow-y-auto">
        <h2 className="bg-blue-600 text-white p-4 text-lg font-bold">
          DANH MỤC QUY TRÌNH
        </h2>
        {processList.map((item, idx) => (
          <SidebarItem
            key={item.id}
            item={item}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            selected={selectedItem}
            onSelect={(id, title) => {
              setSelectedItem(id);
              setSelectedTitle(title);
              setActiveStep(0);
            }}
          />
        ))}
      </div> */}

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

            {/* Steps */}
            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
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

              {/* Documents */}
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Tài liệu cần chuẩn bị:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {currentStep.documents.map((doc, idx) => (
                  <Chip key={idx} label={doc} variant="outlined" size="small" />
                ))}
              </Box>

              {/* Table */}
              {activeStep === 0 && (
                <Box
                  sx={{
                    mt: 3,
                    px: 4,
                    py: 2,
                    borderRadius: 2,
                    backgroundColor: "#e9e9e9ff",
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

                  {/* Removed the legacy showForm modal block */}

                  <table className="w-full border border-gray-300">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="p-2 border">Thành phần</th>
                        <th className="p-2 border">Đơn giá</th>
                        <th className="p-2 border">Định mức</th>
                        <th className="p-2 border">Số lượng</th>
                        <th className="p-2 border">Thành tiền</th>
                        <th className="p-2 border">Ghi chú</th>
                        <th className="p-2 border">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, idx) => (
                        <tr key={`${row.thanhPhan}-${idx}`}>
                          <td className="p-2 border">{row.thanhPhan}</td>
                          <td className="p-2 border">{row.donGia.toLocaleString()}</td>
                          <td className="p-2 border">{row.dinhMuc}</td>
                          <td className="p-2 border">{row.soLuong}</td>
                          <td className="p-2 border">
                            {(row.donGia * row.dinhMuc * row.soLuong).toLocaleString()}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}
            </Paper>

            // single modal near the end
			{formMode && (
			  <ModalWrapper onClose={closeForm}>
				<EditForm
				  onClose={closeForm}
				  onSubmit={handleSubmit}
				  initialData={formMode === "edit" ? editRow : null}
				/>
			  </ModalWrapper>
			)}


          </>
        ) : (
          <Typography variant="h6" sx={{ color: "#6b7280" }}>
            Vui lòng chọn một quy trình ở menu bên trái.
          </Typography>
        )}
      </div>
    </div>
  );
}

