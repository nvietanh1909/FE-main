import React from 'react';
import { FaThLarge, FaSearch, FaRegCommentDots, FaCog, FaChevronRight } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const menu = [
  {
    label: 'Bảng điều khiển',
    desc: 'Tổng quan hệ thống và thống kê',
    icon: <FaThLarge className="text-xl" />,
    to: '/',
  },
  {
    label: 'Tra cứu thủ tục',
    desc: 'Tra cứu thủ tục hiện có',
    icon: <FaSearch className="text-xl" />,
    to: '/procedures',
  },
  {
    label: 'Tin nhắn',
    desc: 'Nhận tin nhắn từ hệ thống',
    icon: <FaRegCommentDots className="text-xl" />,
    to: '/messages',
  },
  {
    label: 'Cài đặt',
    desc: 'Cấu hình tài khoản và hệ thống',
    icon: <FaCog className="text-xl" />,
    to: '/settings',
  },
];

export default function SideBar() {
  const location = useLocation();
  return (
    <aside className="w-80 min-h-screen flex flex-col justify-between bg-[#F1F7FF] border-r border-gray-200">
      <nav className="flex flex-col gap-4 mt-[1rem]">
        {menu.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              to={item.to}
              key={item.label}
              className={`no-underline flex items-center gap-2 px-3 py-3 rounded-lg mx-2 transition-colors select-none
                ${isActive ? 'bg-[#e6f0ff]' : 'hover:bg-gray-100'}
              `}
            >
              <span className={`text-xl  ${isActive ? 'text-[#1E40AF] font-600 line-height-100%' : 'text-gray-500 line-height-100%'}`}>{item.icon}</span>
              <span className="flex-1 flex flex-col text-left p-[0.2rem] ml-[0.2rem]">
                <span className={`text-[1rem] leading-tight ${isActive ? 'text-[#1E40AF] font-600' : 'text-gray-800 font-normal'}`}>{item.label}</span>
                <span className={`text-[0.86rem] leading-tight ${isActive ? 'text-[#1E40AF]' : 'text-gray-400'}`}>{item.desc}</span>
              </span>
              <FaChevronRight className={`text-base ${isActive ? 'text-[#1E40AF]' : 'text-gray-400'}`} />
            </Link>
          );
        })}
      </nav>
      <div className="flex flex-col items-center mb-12 mt-8">
        <div className=" text-gray-400 mb-2 text-center font-size-[0.8rem]">© 2025 University of Engineering and Technology</div>
        <div className="flex gap-4">
          <a href="#" className="no-underline font-size-[0.8rem] text-[#1E40AF] hover:underline">Contact</a>
          <a href="#" className="no-underline font-size-[0.8rem] text-[#1E40AF] hover:underline">Terms</a>
        </div>
      </div>
    </aside>
  );
}
