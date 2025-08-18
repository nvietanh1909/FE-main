import React, { useState } from 'react';
import { FaUsers, FaClipboardList, FaCog, FaComments } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { SiGoogledocs } from "react-icons/si";
import { Link, useLocation } from 'react-router-dom';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const adminMenu = [
  {
    label: 'Bảng điều khiển',
    desc: 'Tổng quan hệ thống',
    icon: <MdDashboard />,
    to: '/admin',
  },
  {
    label: 'Quản lý quy trình',
    desc: 'Quy trình và thủ tục thanh toán',
    icon: <FaClipboardList />,
    to: '/admin/procedures',
  },
  {
    label: 'Quản lý tài liệu',
    desc: 'Tài liệu cập nhật',
    icon: <FaClipboardList />,
    to: '/admin/documents',
  },
  {
    label: 'Quản lý người dùng',
    desc: 'Thông tin người dùng',
    icon: <FaUsers />,
    to: '/admin/users',
  },
  {
    label: 'Quản lý hồ sơ',
    desc: 'Quản lý hồ sơ',
    icon: <SiGoogledocs />,
    to: '/admin/applications',
  },
  {
    label: 'Tin nhắn',
    desc: 'Hỗ trợ và trao đổi',
    icon: <FaComments />,
    to: '/admin/messages',
  },
  {
    label: 'Cài đặt',
    desc: 'Cấu hình hệ thống',
    icon: <FaCog />,
    to: '/admin/settings',
  },
];

export default function AdminSideBar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

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

  return (
    <aside
      className="min-h-screen bg-white flex flex-col transition-all duration-300 relative"
      style={{
        width: collapsed ? 64 : 288,
        borderRight: '1px solid #e5e7eb',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Navigation */}
      <nav className="flex-1 py-4">
        {adminMenu.map((item) => {
  const isActive =
    item.to === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(item.to);

  const isDocumentManager = item.label === 'Quản lý tài liệu';

  return (
    <div key={item.label}>
      <Link
        to={item.to}
        className={`no-underline group relative flex items-center px-2 py-4 text-left transition-all duration-200 hover:bg-blue-50 ${
          isActive ? 'bg-blue-50 border-r-4 border-blue-500' : ''
        }`}
        onClick={(e) => {
          if (isDocumentManager) {
            e.preventDefault(); // prevent navigation
            setOpenDropdown((prev) => !prev);
          }
        }}
      >
        {/* Icon */}
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200 ${
            isActive
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
          }`}
        >
          <span className="text-lg flex items-center justify-center">{item.icon}</span>
        </div>

        {/* Content */}
        {!collapsed && (
          <div className="ml-4 flex-1 flex justify-between items-center">
            <div
              className={`font-medium text-[1rem] transition-colors duration-200 ${
                isActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'
              }`}
            >
              {item.label}
            </div>

            {/* Dropdown arrow */}
            {isDocumentManager && (
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  openDropdown ? 'rotate-90' : ''
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 6L14 10L6 14V6Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}
      </Link>

      {/* Submenu */}
      {isDocumentManager && openDropdown && !collapsed && (
        <div className="ml-16 mt-2 space-y-2">
          {/* Các link tĩnh */}
          <Link to="/admin/documents" className="text-sm text-gray-600 hover:text-blue-600 block">
            Tài liệu nội bộ
          </Link>
          <Link to="/admin/reports" className="text-sm text-gray-600 hover:text-blue-600 block">
            Báo cáo
          </Link>
          {/* Render nguyên thẻ SidebarItem với dữ liệu mẫu */}
          <div>
            {processList.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedItem === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
                onClick={() => {
                  setSelectedItem(item.id);
                  setSelectedTitle(item.title);
                }}
              >
                <div className="flex-1">{item.title}</div>
                {openIndex === idx ? (
                  <FaAngleDoubleLeft className="w-4 h-4" />
                ) : (
                  <FaAngleDoubleRight className="w-4 h-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
})}

      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-3">
              © 2025 University of Engineering and Technology
            </div>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="no-underline text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Liên hệ
              </a>
              <a
                href="#"
                className="no-underline text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Điều khoản
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Nút đóng/mở luôn cố định ở góc phải dưới của sidebar */}
      <button
        className={`z-10 transition-opacity duration-200 p-2 rounded hover:bg-gray-100
          ${hovered ? 'opacity-100' : 'opacity-80'}
        `}
        style={{
          position: 'fixed',
          bottom: 24,
          left: collapsed ? 16 : 288 - 48, // 48 = button width + margin
          width: 40,
          height: 40,
          background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e7eb',
          transition: 'left 0.3s',
        }}
        onClick={() => setCollapsed((v) => !v)}
        aria-label={collapsed ? "Mở sidebar" : "Đóng sidebar"}
      >
        {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
      </button>
    </aside>
  );
}