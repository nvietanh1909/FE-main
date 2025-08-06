import React from 'react';
import { FaCog, FaComments } from 'react-icons/fa';
import { MdOutlineContentPasteSearch, MdDashboard } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';

const menu = [
  {
    label: 'Bảng điều khiển',
    desc: 'Tổng quan hệ thống',
    icon: <MdDashboard />,
    to: '/',
  },
  {
    label: 'Tra cứu thủ tục',
    desc: 'Quy trình và thủ tục thanh toán',
    icon: <MdOutlineContentPasteSearch />,
    to: '/procedures',
  },
  {
    label: 'Tin nhắn',
    desc: 'Hỗ trợ và trao đổi',
    icon: <FaComments />,
    to: '/messages',
  },
  {
    label: 'Cài đặt',
    desc: 'Cấu hình tài khoản',
    icon: <FaCog />,
    to: '/settings',
  },
];

export default function SideBar() {
  const location = useLocation();
  
  return (
    <aside 
      className="w-72 min-h-screen bg-white flex flex-col"
      style={{ borderRight: '1px solid #e5e7eb' }}
    >

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menu.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
          
          return (
            <Link
              to={item.to}
              key={item.label}
              className={`no-underline group relative flex items-center px-6 py-4 text-left transition-all duration-200 hover:bg-blue-50 ${
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

              {/* Arrow indicator for active item */}
              {isActive && (
                <div className="text-blue-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 mt-auto">
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
    </aside>
  );
}
