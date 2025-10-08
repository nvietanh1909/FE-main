import React from 'react'
import logoUET from "@/assets/images/ImgLogoUET.png";
import UET from "@/assets/images/UET.svg";
import RegisterImg from "@/assets/images/undraw_referral_j2rw.svg";

export default function InfoFormRegister() {
    return (
        <div className="relative w-[947.74px] h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#146DA8] to-[#0E3454]">
                {/* Header bên trái */}
                <div className="absolute top-0 left-0 w-full flex items-center gap-3 px-8 py-5 z-[10] bg">
                    <img src={logoUET} alt="Logo UET" className="h-20 w-auto drop-shadow-md" />
                    <span className="text-white text-[1.4rem] font-bold tracking-wide drop-shadow">Phòng Kế hoạch Tài chính</span>
                </div>
                
                {/* Logo mờ lớn */}
                <img src={UET} alt="UET Logo" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] opacity-10 z-[1] pointer-events-none select-none" />
                
                {/* Các chấm tròn trang trí */}
                <div className="absolute top-[18%] left-[18%] w-16 h-16 bg-white/10 rounded-full blur-md z-[2] animate-pulse"></div>
                <div className="absolute top-[60%] left-[10%] w-8 h-8 bg-white/15 rounded-full blur-sm z-[2] animate-pulse"></div>
                <div className="absolute top-[30%] left-[70%] w-10 h-10 bg-white/10 rounded-full blur z-[2] animate-pulse"></div>
                <div className="absolute top-[80%] left-[60%] w-6 h-6 bg-white/20 rounded-full blur-sm z-[2] animate-pulse"></div>
                
                {/* Blur nhẹ phía sau hình minh họa */}
                <div className="absolute left-1/2 bottom-[160px] -translate-x-1/2 w-[260px] h-[90px] bg-white/20 rounded-full blur-2xl z-[2]"></div>
                
                {/* Hình minh họa đăng nhập */}
                <img src={RegisterImg} alt="Login Illustration" className="absolute left-1/2 bottom-[120px] -translate-x-1/2 w-[420px] max-w-[90%] z-[3] opacity-95 pointer-events-none select-none" />
                
                {/* Slogan */}
                <div className="absolute top-[40px] left-1/2 -translate-x-1/2 text-white font-semibold text-[1.7rem] w-full tracking-wide text-center z-[4] drop-shadow-xl shadow-black/40">
                </div>
                
                {/* SVG sóng dưới cùng */}
                <svg className="absolute bottom-0 left-0 w-full z-[2]" height="120" viewBox="0 0 947 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 60 Q 236 120 473 60 T 947 60 V120 H0Z" fill="#fff" fillOpacity="0.18"/>
                  <path d="M0 90 Q 236 30 473 90 T 947 90 V120 H0Z" fill="#fff" fillOpacity="0.12"/>
                </svg>
                
                {/* Thông tin liên hệ */}
                <div className="absolute left-6 bottom-3 text-white text-[0.95rem] opacity-70 z-[5]">
                    Liên hệ: khtc@uet.vnu.edu.vn
                </div>
            </div>
    )
}