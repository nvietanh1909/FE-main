import React, { useState } from 'react';
import { FaUsers, FaClipboardList, FaCog, FaComments, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { SiGoogledocs } from "react-icons/si";
import { Link, useLocation } from 'react-router-dom';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { IoDocumentText } from "react-icons/io5";
import { RiFlowChart } from "react-icons/ri";

const adminMenu = [
  {
    label: 'Bảng điều khiển',
    desc: 'Tổng quan hệ thống',
    icon: <MdDashboard />,
    to: '/admin',
  },
  {
    label: 'Quản lý tài liệu',
    desc: 'Tài liệu cập nhật',
    icon: <IoDocumentText />,
    to: '/admin/procedures',
  },
  {
    label: 'Quản lý quy trình',
    desc: 'Quy trình và thủ tục thanh toán',
    icon: <RiFlowChart />,
    to: '/admin/documents',
    children: [
      {
        label: 'Quy trình thanh toán hoạt động thường xuyên',
        to: '/admin/documents?category=payment',
        children: [
          {
            label: '1. Công tác phí trong nước',
            to: '/admin/documents?process=p1&item=p1c1',
          },
          {
            label: '2. Công tác phí nước ngoài',
            to: '/admin/documents?process=p1&item=p1c2',
          },
          {
            label: '3. Hội nghị, hội thảo trong nước',
            to: '/admin/documents?process=p1&item=p1c3',
          },
          {
            label: '4. Hội nghị, hội thảo quốc tế tại Việt Nam',
            to: '/admin/documents?process=p1&item=p1c4',
          }
        ]
      },
      {
        label: 'Quy trình mua sắm trang thiết bị',
        to: '/admin/documents?category=procurement',
        children: [
          {
            label: '1. Mua máy tính',
            to: '/admin/documents?process=p2&item=p2c1',
          },
          {
            label: '2. Mua bàn ghế',
            to: '/admin/documents?process=p2&item=p2c2',
          },
          {
            label: '3. Mua vật tư tiêu hao',
            to: '/admin/documents?process=p2&item=p2c3',
          }
        ]
      }
    ],
  },
  {
    label: 'Quản lý người dùng',
    desc: 'Thông tin người dùng',
    icon: <FaUsers />,
    to: '/admin/users',
  },
  // {
  //   label: 'Quản lý hồ sơ',
  //   desc: 'Quản lý hồ sơ',
  //   icon: <SiGoogledocs />,
  //   to: '/admin/applications',
  // },
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubmenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const renderMenuItem = (item: any, level: number = 0) => {
    // Chỉ check active cho level 0 (menu chính)
    const isActive = level === 0 ? (
      item.to === '/admin'
        ? location.pathname === '/admin'
        : location.pathname.startsWith(item.to)
    ) : false;
    
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.label);
    const paddingLeft = level === 0 ? 'px-2' : level === 1 ? 'pl-16 pr-2' : 'pl-20 pr-2';

    if (hasChildren) {
      return (
        <div key={item.label}>
          {/* Parent menu item */}
          <div
            className={`group relative flex items-center ${paddingLeft} py-4 text-left transition-all duration-200 hover:bg-blue-50 cursor-pointer ${
              isActive ? 'bg-blue-50 border-r-4 border-blue-500' : ''
            }`}
            onClick={() => toggleSubmenu(item.label)}
          >
            {/* Icon - only show for top level */}
            {level === 0 && (
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                }`}
              >
                <span className="text-lg flex items-center justify-center">{item.icon}</span>
              </div>
            )}

            {/* Content */}
            {!collapsed && (
              <div className={`${level === 0 ? 'ml-4' : ''} flex-1`}>
                <div
                  className={`font-medium ${level === 0 ? 'text-[1rem]' : 'text-sm'} transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </div>
                <div className="text-xs text-gray-500  mt-0.5 leading-tight">
                  {item.desc}
                </div>
              </div>
            )}

            {/* Dropdown indicator */}
            {!collapsed && (
              <div className="text-gray-400">
                {isExpanded ? <FaChevronDown className="w-2.6 h-2.6" /> : <FaChevronRight className="w-2.6 h-2.6" />}
              </div>
            )}
          </div>

          {/* Submenu items */}
          {!collapsed && isExpanded && (
            <div className={level === 0 ? '!bg-white' : '!bg-white'}>
              {item.children.map((child: any) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // Leaf menu item without children
    const leafIsActive = level === 0 && location.pathname === item.to;
    
    return (
      <Link
        to={item.to}
        key={item.label}
        className={`no-underline group relative flex items-center ${paddingLeft} py-3 text-left transition-all duration-200 hover:bg-blue-50 ${
          leafIsActive ? 'bg-[#EFF6FF] border-r-4 border-blue-500' : ''
        }`}
      >
        {/* Icon - only show for top level */}
        {level === 0 && (
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200 ${
              leafIsActive
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
            }`}
          >
            <span className="text-lg flex items-center justify-center">{item.icon}</span>
          </div>
        )}

        {/* Content */}
        {!collapsed && (
          <div className={`${level === 0 ? 'ml-4' : ''} flex-1`}>
            <div
              className={`font-medium ${level === 0 ? 'text-[1rem]' : 'text-sm  !font-400'} transition-colors duration-200 ${
                leafIsActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'
              }`}
            >
              {item.label}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 leading-tight">
              {item.desc}
            </div>
          </div>
        )}
      </Link>
    );
  };

  return (
    <aside
      className="min-h-screen bg-white flex flex-col transition-all duration-300 relative"
      style={{
        width: collapsed ? 64 : 268,
        borderRight: '1px solid #e5e7eb',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Navigation */}
      <nav className="flex-1 py-4">
        {adminMenu.map((item) => renderMenuItem(item))}
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
          left: collapsed ? 16 : 268 - 48, // 48 = button width + margin
          width: 40,
          height: 40,
          cursor: 'pointer',
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