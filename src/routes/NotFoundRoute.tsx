import React from "react";
import NotFound from "@/assets/images/undraw_page-not-found_6wni.svg";


export default function NotFoundPage() {
    return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={NotFound} alt="" className="w-[36rem] mb-6"/>
      <p className="text-[1.2rem] font-bold">Oops! Trang bạn muốn truy cập không tồn tại.</p>
    </div>
    );
}