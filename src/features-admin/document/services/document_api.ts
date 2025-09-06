// ====== Types ======
export type ProcessItem = {
  id: string;
  title: string;
  category?: string;
  children?: ProcessChildItem[];
};

export type ProcessChildItem = {
  id: string;
  title: string;
  steps?: ProcessStep[];
};

export type ProcessStep = {
  id: number;
  label: string;
  sublabel: string;
  content?: StepContent;
};

export type StepContent = {
  title: string;
  content: string[];
  documents: string[];
  timeEstimate: string;
  requirements?: string[];
};

export type ChiPhiItem = {
  id?: string;
  thanhPhan: string;
  donGia: number;
  dinhMuc: number;
  soLuong: number;
  luuY?: string;
};

export type DocumentApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// ====== Mock Data ======
const mockProcessList: ProcessItem[] = [
  {
    id: "p1",
    title: "Quy trình thanh toán hoạt động thường xuyên",
    category: "payment",
    children: [
      { 
        id: "p1c1", 
        title: "Công tác phí trong nước",
        steps: [
          {
            id: 1,
            label: "Bước 1",
            sublabel: "Chuẩn bị hồ sơ",
            content: {
              title: "Chuẩn bị hồ sơ cần thiết",
              content: [
                "1. Đơn đề nghị thanh toán công tác phí (theo mẫu)",
                "2. Bảng kê chi tiết các khoản chi phí phát sinh",
                "3. Các hóa đơn, chứng từ gốc (vé máy bay, hóa đơn khách sạn, taxi...)",
              ],
              documents: ["Đơn đề nghị", "Bảng kê chi phí", "Hóa đơn gốc"],
              timeEstimate: "1-2 ngày làm việc",
            }
          },
          {
            id: 2,
            label: "Bước 2",
            sublabel: "Nộp đơn đăng ký",
            content: {
              title: "Nộp hồ sơ đăng ký thanh toán",
              content: [
                "1. Nộp hồ sơ trực tiếp tại Phòng Tài chính - Kế toán",
                "2. Cán bộ tiếp nhận sẽ kiểm tra tính đầy đủ của hồ sơ",
              ],
              documents: ["Biên lai tiếp nhận", "Mã số hồ sơ"],
              timeEstimate: "30 phút",
            }
          },
          {
            id: 3,
            label: "Bước 3",
            sublabel: "Thẩm định hồ sơ",
            content: {
              title: "Thẩm định và xem xét hồ sơ",
              content: [
                "1. Phòng Tài chính thẩm định tính hợp lệ của hồ sơ",
                "2. Kiểm tra các chứng từ và hóa đơn",
                "3. Tính toán số tiền được thanh toán",
              ],
              documents: ["Biên bản thẩm định", "Báo cáo chi phí"],
              timeEstimate: "3-5 ngày làm việc",
            }
          },
          {
            id: 4,
            label: "Bước 4",
            sublabel: "Phê duyệt và thanh toán",
            content: {
              title: "Phê duyệt và thực hiện thanh toán",
              content: [
                "1. Lãnh đạo phê duyệt thanh toán",
                "2. Kế toán thực hiện chuyển khoản",
                "3. Thông báo kết quả cho người nộp hồ sơ",
              ],
              documents: ["Quyết định phê duyệt", "Chứng từ thanh toán"],
              timeEstimate: "2-3 ngày làm việc",
            }
          }
        ]
      },
      { 
        id: "p1c2", 
        title: "Công tác phí nước ngoài",
        steps: [
          {
            id: 1,
            label: "Bước 1",
            sublabel: "Chuẩn bị hồ sơ",
            content: {
              title: "Chuẩn bị hồ sơ công tác phí nước ngoài",
              content: [
                "1. Đơn đề nghị thanh toán công tác phí nước ngoài",
                "2. Lệnh công tác hoặc giấy mời",
                "3. Vé máy bay quốc tế và boarding pass",
                "4. Hóa đơn khách sạn (có dịch thuật)",
              ],
              documents: ["Đơn đề nghị", "Lệnh công tác", "Vé máy bay", "Hóa đơn khách sạn"],
              timeEstimate: "2-3 ngày làm việc",
            }
          }
        ]
      },
      { 
        id: "p1c3", 
        title: "Hội nghị, hội thảo trong nước",
        steps: [
          {
            id: 1,
            label: "Bước 1",
            sublabel: "Chuẩn bị hồ sơ",
            content: {
              title: "Chuẩn bị hồ sơ tham gia hội nghị trong nước",
              content: [
                "1. Đơn đề nghị tham gia hội nghị",
                "2. Thư mời tham gia hội nghị",
                "3. Chương trình hội nghị chi tiết",
                "4. Dự toán chi phí tham gia",
              ],
              documents: ["Đơn đề nghị", "Thư mời", "Chương trình", "Dự toán"],
              timeEstimate: "1-2 ngày làm việc",
            }
          }
        ]
      },
      { 
        id: "p1c4", 
        title: "Hội nghị, hội thảo quốc tế tại Việt Nam",
        steps: [
          {
            id: 1,
            label: "Bước 1",
            sublabel: "Chuẩn bị hồ sơ",
            content: {
              title: "Chuẩn bị hồ sơ tham gia hội nghị quốc tế",
              content: [
                "1. Đơn đề nghị tham gia hội nghị quốc tế",
                "2. Thư mời chính thức từ ban tổ chức",
                "3. Chương trình hội nghị (tiếng Anh/Việt)",
                "4. CV và thông tin diễn giả",
              ],
              documents: ["Đơn đề nghị", "Thư mời", "Chương trình", "CV"],
              timeEstimate: "3-5 ngày làm việc",
            }
          }
        ]
      },
    ],
  },
  {
    id: "p2",
    title: "Quy trình mua sắm trang thiết bị",
    category: "procurement",
    children: [
      { 
        id: "p2c1", 
        title: "Mua máy tính",
        steps: [
          {
            id: 1,
            label: "Bước 1",
            sublabel: "Lập kế hoạch mua sắm",
            content: {
              title: "Lập kế hoạch và dự toán mua máy tính",
              content: [
                "1. Xác định nhu cầu sử dụng máy tính",
                "2. Khảo sát giá thị trường",
                "3. Lập dự toán chi tiết",
                "4. Trình kế hoạch mua sắm",
              ],
              documents: ["Đề xuất mua sắm", "Dự toán", "Báo giá"],
              timeEstimate: "5-7 ngày làm việc",
            }
          }
        ]
      },
      { 
        id: "p2c2", 
        title: "Mua bàn ghế",
        steps: [
          {
            id: 1,
            label: "Bước 1",
            sublabel: "Khảo sát nhu cầu",
            content: {
              title: "Khảo sát nhu cầu bàn ghế văn phòng",
              content: [
                "1. Đánh giá hiện trạng bàn ghế",
                "2. Xác định số lượng cần mua",
                "3. Đưa ra tiêu chí kỹ thuật",
                "4. Lập danh sách nhà cung cấp",
              ],
              documents: ["Báo cáo khảo sát", "Tiêu chí kỹ thuật", "Danh sách NCC"],
              timeEstimate: "3-5 ngày làm việc",
            }
          }
        ]
      },
      { 
        id: "p2c3", 
        title: "Mua vật tư tiêu hao",
        steps: [
          {
            id: 1,
            label: "Bước 1",
            sublabel: "Lập danh sách vật tư",
            content: {
              title: "Lập danh sách vật tư cần mua",
              content: [
                "1. Kiểm kê vật tư hiện có",
                "2. Dự toán nhu cầu sử dụng",
                "3. Lập danh sách vật tư cần mua",
                "4. Ước tính giá thành",
              ],
              documents: ["Danh sách vật tư", "Báo cáo kiểm kê", "Dự toán"],
              timeEstimate: "2-3 ngày làm việc",
            }
          }
        ]
      },
    ],
  },
];

const mockCostItems: ChiPhiItem[] = [
  {
    id: "1",
    thanhPhan: "Vé máy bay",
    donGia: 2500000,
    dinhMuc: 2500000,
    soLuong: 1,
    luuY: "Vé khứ hồi Hà Nội - TP.HCM"
  },
  {
    id: "2", 
    thanhPhan: "Tiền ăn",
    donGia: 200000,
    dinhMuc: 200000,
    soLuong: 3,
    luuY: "200k/ngày x 3 ngày"
  },
  {
    id: "3",
    thanhPhan: "Tiền ở khách sạn", 
    donGia: 800000,
    dinhMuc: 800000,
    soLuong: 2,
    luuY: "800k/đêm x 2 đêm"
  }
];


/**
 * Lấy danh sách tất cả quy trình
 */
export const getProcessList = async (): Promise<DocumentApiResponse<ProcessItem[]>> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockProcessList,
        message: "Lấy danh sách quy trình thành công"
      });
    }, 500);
  });
};

/**
 * Lấy quy trình theo ID
 */
export const getProcessById = async (
  processId: string, 
  itemId?: string
): Promise<DocumentApiResponse<{ process: ProcessItem; selectedItem?: ProcessChildItem }>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const process = mockProcessList.find(p => p.id === processId);
      
      if (!process) {
        reject({
          success: false,
          message: "Không tìm thấy quy trình"
        });
        return;
      }

      let selectedItem;
      if (itemId && process.children) {
        selectedItem = process.children.find(item => item.id === itemId);
      }

      resolve({
        success: true,
        data: {
          process,
          selectedItem
        },
        message: "Lấy thông tin quy trình thành công"
      });
    }, 300);
  });
};

/**
 * Cập nhật thông tin quy trình
 */
export const updateProcess = async (
  processId: string, 
  data: Partial<ProcessItem>
): Promise<DocumentApiResponse<ProcessItem>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const processIndex = mockProcessList.findIndex(p => p.id === processId);
      
      if (processIndex === -1) {
        reject({
          success: false,
          message: "Không tìm thấy quy trình"
        });
        return;
      }

      mockProcessList[processIndex] = { ...mockProcessList[processIndex], ...data };
      
      resolve({
        success: true,
        data: mockProcessList[processIndex],
        message: "Cập nhật quy trình thành công"
      });
    }, 800);
  });
};

/**
 * Cập nhật các bước của quy trình
 */
export const updateProcessSteps = async (
  processId: string,
  itemId: string, 
  steps: ProcessStep[]
): Promise<DocumentApiResponse<ProcessStep[]>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const process = mockProcessList.find(p => p.id === processId);
      
      if (!process || !process.children) {
        reject({
          success: false,
          message: "Không tìm thấy quy trình"
        });
        return;
      }

      const itemIndex = process.children.findIndex(item => item.id === itemId);
      if (itemIndex === -1) {
        reject({
          success: false,
          message: "Không tìm thấy mục con"
        });
        return;
      }

      process.children[itemIndex].steps = steps;
      
      resolve({
        success: true,
        data: steps,
        message: "Cập nhật các bước thành công"
      });
    }, 600);
  });
};

/**
 * Lấy danh sách chi phí
 */
export const getCostItems = async (
  processId: string,
  itemId: string
): Promise<DocumentApiResponse<ChiPhiItem[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockCostItems,
        message: "Lấy danh sách chi phí thành công"
      });
    }, 400);
  });
};

/**
 * Thêm mục chi phí mới
 */
export const addCostItem = async (
  processId: string,
  itemId: string,
  costItem: Omit<ChiPhiItem, 'id'>
): Promise<DocumentApiResponse<ChiPhiItem>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem: ChiPhiItem = {
        ...costItem,
        id: Date.now().toString()
      };
      
      mockCostItems.push(newItem);
      
      resolve({
        success: true,
        data: newItem,
        message: "Thêm mục chi phí thành công"
      });
    }, 500);
  });
};

/**
 * Cập nhật mục chi phí
 */
export const updateCostItem = async (
  processId: string,
  itemId: string,
  costId: string,
  costItem: Partial<ChiPhiItem>
): Promise<DocumentApiResponse<ChiPhiItem>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const itemIndex = mockCostItems.findIndex(item => item.id === costId);
      
      if (itemIndex === -1) {
        reject({
          success: false,
          message: "Không tìm thấy mục chi phí"
        });
        return;
      }

      mockCostItems[itemIndex] = { ...mockCostItems[itemIndex], ...costItem };
      
      resolve({
        success: true,
        data: mockCostItems[itemIndex],
        message: "Cập nhật mục chi phí thành công"
      });
    }, 500);
  });
};

/**
 * Xóa mục chi phí
 */
export const deleteCostItem = async (
  processId: string,
  itemId: string,
  costId: string
): Promise<DocumentApiResponse<boolean>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const itemIndex = mockCostItems.findIndex(item => item.id === costId);
      
      if (itemIndex === -1) {
        reject({
          success: false,
          message: "Không tìm thấy mục chi phí"
        });
        return;
      }

      mockCostItems.splice(itemIndex, 1);
      
      resolve({
        success: true,
        data: true,
        message: "Xóa mục chi phí thành công"
      });
    }, 400);
  });
};

/**
 * Tìm kiếm quy trình
 */
export const searchProcesses = async (
  keyword: string
): Promise<DocumentApiResponse<ProcessItem[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredProcesses = mockProcessList.filter(process => 
        process.title.toLowerCase().includes(keyword.toLowerCase()) ||
        process.children?.some(child => 
          child.title.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      resolve({
        success: true,
        data: filteredProcesses,
        message: `Tìm thấy ${filteredProcesses.length} kết quả`
      });
    }, 300);
  });
};

/**
 * Lấy thống kê quy trình
 */
export const getProcessStats = async (): Promise<DocumentApiResponse<{
  totalProcesses: number;
  totalItems: number;
  totalSteps: number;
  categoriesCount: Record<string, number>;
}>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalProcesses = mockProcessList.length;
      const totalItems = mockProcessList.reduce((sum, process) => 
        sum + (process.children?.length || 0), 0
      );
      const totalSteps = mockProcessList.reduce((sum, process) => 
        sum + (process.children?.reduce((childSum, child) => 
          childSum + (child.steps?.length || 0), 0
        ) || 0), 0
      );
      
      const categoriesCount = mockProcessList.reduce((acc, process) => {
        const category = process.category || 'other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      resolve({
        success: true,
        data: {
          totalProcesses,
          totalItems,
          totalSteps,
          categoriesCount
        },
        message: "Lấy thống kê thành công"
      });
    }, 400);
  });
};
