import React from 'react';
import { FaThLarge, FaSearch, FaRegCommentDots, FaCog, FaChevronRight } from 'react-icons/fa';
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import { BiSolidDashboard } from "react-icons/bi";
import { AiOutlineMessage } from "react-icons/ai";
import { RiUserSettingsFill } from "react-icons/ri";

const menu = [
  {
    label: 'Bảng điều khiển',
    desc: '',
    icon: <BiSolidDashboard className="font-100 size-[1.4rem] " />,
    to: '/',
  },
  {
    label: 'Tra cứu thủ tục',
    desc: '',
    icon: <MdOutlineContentPasteSearch className="font-100 size-[1.4rem] " />,
    to: '/procedures',
  },
  {
    label: 'Tin nhắn',
    desc: '',
    icon: <AiOutlineMessage className="font-100 size-[1.4rem]  " />,
    to: '/messages',
  },
  {
    label: 'Cài đặt',
    desc: '',
    icon: <RiUserSettingsFill className="font-100 size-[1.4rem]  " />,
    to: '/settings',
  },
];

export default function SideBar() {
  const location = useLocation();
  return (
    <aside className="w-60 min-h-screen flex flex-col justify-between  border-r-2 ">
      <nav className="flex flex-col gap-4 mt-[1rem]">
        {menu.map((item) => {
          const isActive =
          item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to);
          return (
            <Link
              to={item.to}
              key={item.label}
              className={`no-underline flex items-center gap-3 px-4 py-3 transition-colors select-none
                ${isActive ? 'bg-blue-50 border-r-3 border-blue-500' : 'hover:bg-gray-50'}
              `}
            >
              <span className={`text-lg flex items-center ${isActive ? 'text-blue-500 rounded' : 'text-gray-600'}`}>{item.icon}</span>
              <span className={`text-[0.95rem] flex items-center ${isActive ? 'text-blue-500 font-medium rounded' : 'text-gray-700 font-normal'}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="flex flex-col items-center mb-12 mt-8">
        <div className=" text-gray-400 mb-2 text-center font-size-[0.8rem]">© 2025 University of Engineering and Technology</div>
        <div className="flex gap-4">
          <a href="#" className="no-underline font-size-[0.8rem] text-[#1F64E5] hover:underline font-600">Contact</a>
          <a href="#" className="no-underline font-size-[0.8rem] text-[#1F64E5] hover:underline font-600">Terms</a>
        </div>
      </div>
    </aside>
  );
}
