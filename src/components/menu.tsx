// import React, { useState } from "react";

// interface SubItem {
//   id: number;
//   title: string;
// }

// interface Category {
//   id: number;
//   title: string;
//   subItems?: SubItem[];
// }

// const categories: Category[] = [
//   {
//     id: 1,
//     title: "Quy trình thanh toán hoạt động thường xuyên",
//     subItems: [
//       { id: 1, title: "Công tác phí trong nước" },
//       { id: 2, title: "Công tác phí nước ngoài" },
//       { id: 3, title: "Hội nghị, hội thảo trong nước" },
//       { id: 4, title: "Hội nghị, hội thảo quốc tế tại Việt Nam do Nhà trường chủ trì tổ chức" },
//     ],
//   },
//   { id: 2, title: "Quy trình thanh toán hoạt động thường xuyên" },
//   { id: 3, title: "Quy trình thanh toán hoạt động thường xuyên" },
//   { id: 4, title: "Quy trình thanh toán hoạt động thường xuyên" },
// ];

// const App: React.FC = () => {
//   const [openCategory, setOpenCategory] = useState<number | null>(1);
//   const [selectedItem, setSelectedItem] = useState<number | null>(1);

//   return (
//     <div className="w-full max-w-md mx-auto font-sans">
//       {/* Header */}
//       <div className="flex items-center bg-blue-600 p-3 text-white font-bold text-lg">
//         <span className="mr-2">≡</span>
//         DANH MỤC QUY TRÌNH
//       </div>

//       {/* Categories */}
//       {categories.map((cat) => (
//         <div key={cat.id} className="border rounded mb-2">
//           <div
//             className="flex justify-between p-3 cursor-pointer"
//             onClick={() =>
//               setOpenCategory(openCategory === cat.id ? null : cat.id)
//             }
//           >
//             <div className="text-blue-700">{cat.title}</div>
//             {cat.subItems && <span>{openCategory === cat.id ? "▲" : "▶"}</span>}
//           </div>

//           {/* Sub items */}
//           {cat.subItems && openCategory === cat.id && (
//             <div className="max-h-60 overflow-y-auto">
//               {cat.subItems.map((sub) => (
//                 <div
//                   key={sub.id}
//                   className={`px-4 py-2 cursor-pointer ${
//                     selectedItem === sub.id ? "bg-blue-100" : ""
//                   }`}
//                   onClick={() => setSelectedItem(sub.id)}
//                 >
//                   {sub.id}. {sub.title}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default App;
