import React, { useState, useEffect } from 'react';
import { fetchProcedures } from '@/features-user/procedure/services/procedureService.ts';
import { FaCog, FaComments, FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { MdOutlineContentPasteSearch, MdDashboard } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';

// const menu = [
//   {
//     label: 'Bảng điều khiển',
//     desc: 'Tổng quan hệ thống',
//     icon: <MdDashboard />,
//     to: '/',
//   },
//   {
//     label: 'Tra cứu thủ tục',
//     desc: 'Quy trình và thủ tục thanh toán',
//     icon: <MdOutlineContentPasteSearch />,
//     to: '/procedures',
//     children: [
//       {
//         label: 'Quy trình thanh toán hoạt động thường xuyên',
//         to: '/procedures?category=payment',
//         children: [
//           {
//             label: '1. Công tác phí trong nước',
//             to: '/procedures?process=p1&item=p1c1',
//           },
//           {
//             label: '2. Công tác phí nước ngoài',
//             to: '/procedures?process=p1&item=p1c2',
//           },
//           {
//             label: '3. Hội nghị, hội thảo trong nước',
//             to: '/procedures?process=p1&item=p1c3',
//           },
//           {
//             label: '4. Hội nghị, hội thảo quốc tế tại Việt Nam',
//             to: '/procedures?process=p1&item=p1c4',
//           }
//         ]
//       },
//       {
//         label: 'Quy trình mua sắm trang thiết bị',
//         to: '/procedures?category=procurement',
//         children: [
//           {
//             label: '1. Mua máy tính',
//             to: '/procedures?process=p2&item=p2c1',
//           },
//           {
//             label: '2. Mua bàn ghế',
//             to: '/procedures?process=p2&item=p2c2',
//           },
//           {
//             label: '3. Mua vật tư tiêu hao',
//             to: '/procedures?process=p2&item=p2c3',
//           }
//         ]
//       }
//     ],
//   },
//   {
//     label: 'Tin nhắn',
//     desc: 'Hỗ trợ và trao đổi',
//     icon: <FaComments />,
//     to: '/messages',
//   },
//   {
//     label: 'Cài đặt',
//     desc: 'Cấu hình tài khoản',
//     icon: <FaCog />,
//     to: '/settings',
//   },
// ];

export default function UserSideBar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [menu, setMenu] = useState<any[]>([]);

  useEffect(() => {
    // Tạo menu tĩnh đơn giản
    const staticMenu = [
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
        children: [
          {
            label: 'Quy trình thanh toán hoạt động thường xuyên',
            to: '/procedures?category=payment',
            children: [
              {
                label: '1. Công tác phí trong nước',
                to: '/procedures?type=trong-nuoc'
              },
              {
                label: '2. Công tác phí nước ngoài',
                to: '/procedures?type=nuoc-ngoai'
              }
            ]
          }
        ]
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
      }
    ];

    setMenu(staticMenu);
  }, []);

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
      item.to === '/'
        ? location.pathname === '/'
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
            className={`group relative flex items-center ${paddingLeft} py-4 text-left transition-all duration-200 hover:bg-blue-50 cursor-pointer ${isActive ? 'bg-blue-50 border-r-4 border-blue-500' : ''
              }`}
            onClick={() => toggleSubmenu(item.label)}
          >
            {/* Icon - only show for top level */}
            {level === 0 && (
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200 ${isActive
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
                  className={`font-medium ${level === 0 ? 'text-[1rem]' : 'text-sm'} transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'
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
          {!collapsed && isExpanded && (() => {
            // Nếu là menu con của 'Quy trình thanh toán hoạt động thường xuyên' và có nhiều hơn 5 item thì cho scroll toàn bộ
            const isHoatDong = item.label === 'Quy trình thanh toán hoạt động thường xuyên' && item.children && item.children.length > 5;
            const scrollStyle: React.CSSProperties = isHoatDong ? { maxHeight: 240, overflowY: 'auto' } : {};
            return (
              <div className={level === 0 ? '!bg-white' : '!bg-white'} style={scrollStyle}>
                {item.children.map((child: any) => renderMenuItem(child, level + 1))}
              </div>
            );
          })()}
        </div>
      );
    }

    // Leaf menu item without children
    const leafIsActive = (() => {
      // Xử lý đặc biệt cho các menu có URL parameters
      if (item.to?.includes('?type=trong-nuoc')) {
        return location.pathname === '/procedures' && location.search.includes('type=trong-nuoc');
      }
      if (item.to?.includes('?type=nuoc-ngoai')) {
        return location.pathname === '/procedures' && location.search.includes('type=nuoc-ngoai');
      }
      // Xử lý thông thường cho các menu khác
      return location.pathname === item.to;
    })();

    // Nếu có item.to thì cho click, nếu không thì chỉ render text
    if (item.to) {
      return (
        <Link
          to={item.to}
          key={item.label}
          className={`no-underline group relative flex items-center ${paddingLeft} py-3 text-left transition-all duration-200 hover:bg-blue-50 ${leafIsActive ? 'bg-[#EFF6FF] border-r-4 border-blue-500' : ''}`}
        >
          {/* Icon - only show for top level */}
          {level === 0 && (
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200 ${leafIsActive
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
                className={`font-medium ${level === 0 ? 'text-[1rem]' : 'text-sm  !font-400'} transition-colors duration-200 ${leafIsActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}`}
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
    } else {
      // Không có đường dẫn, chỉ render text
      return (
        <div key={item.label} className={`flex items-center ${paddingLeft} py-3 text-left`}>
          {!collapsed && (
            <div className={`${level === 0 ? 'ml-4' : ''} flex-1`}>
              <div className={`font-medium ${level === 0 ? 'text-[1rem]' : 'text-sm  !font-400'}`}>{item.label}</div>
            </div>
          )}
        </div>
      );
    }
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
        {menu.map((item) => renderMenuItem(item))}
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