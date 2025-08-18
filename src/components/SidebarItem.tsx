import React, { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

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
// You may want to move this type to a shared types file if used elsewhere
export type ProcessItem = {
  id: string;
  title: string;
  children?: { id: string; title: string }[];
};

type SidebarItemProps = {
  item: ProcessItem;
  isOpen: boolean;
  onToggle: () => void;
  selected: string | null;
  onSelect: (id: string, title: string) => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isOpen,
  onToggle,
  selected,
  onSelect,
}) => (
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

const YourComponent = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSelect = (id: string, title: string) => {
    setSelectedItem(id);
    setSelectedTitle(title);
  };

  return (
    <div>
      {processList.map((item, idx) => (
        <SidebarItem
          key={item.id}
          item={item}
          isOpen={openIndex === idx}
          onToggle={() => handleToggle(idx)}
          selected={selectedItem}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};

export default YourComponent;