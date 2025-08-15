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

          return (
            <Link
              to={item.to}
              key={item.label}
              className={`no-underline group relative flex items-center px-2 py-4 text-left transition-all duration-200 hover:bg-blue-50 ${
                isActive ? 'bg-blue-50 border-r-4 border-blue-500' : ''
              }`}
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
                <div className="ml-4 flex-1">
                  <div
                    className={`font-medium text-[1rem] transition-colors duration-200 ${
                      isActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                    {item.desc}
                  </div>
                </div>
              )}

              {/* Arrow indicator for active item */}
              {isActive && !collapsed && (
                <div className="text-blue-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </Link>
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