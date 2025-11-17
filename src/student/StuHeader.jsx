import React from "react";
import { Bell, MessageCircle } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";

const StuHeader = () => {
    const navLinkClass = ({ isActive }) =>
        `px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition
     ${isActive ? "bg-white/20" : "hover:bg-cyan-600"}`;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* HEADER */}
            <header className="w-full bg-cyan-600 text-white px-6 py-3 flex items-center justify-between shadow">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="/img/01_logobachkhoasang.png"
                            alt="HCMUT Logo"
                            className="w-16 h-auto"
                        />
                        <div className="hidden sm:block">
                            <div className="text-xs uppercase tracking-wide text-cyan-100">
                                HCMUT Consultation System
                            </div>
                            <div className="text-sm font-semibold">
                                Hệ thống tư vấn học tập
                            </div>
                        </div>
                    </div>

                    <nav className="flex items-center gap-1 text-sm">
                        <NavLink to="/student" end className={navLinkClass}>
                            Trang chủ
                        </NavLink>
                        <NavLink to="/student/buoituvan" className={navLinkClass}>
                            Buổi tư vấn
                        </NavLink>
                        <NavLink to="/student/lichcuatoi" className={navLinkClass}>
                            Lịch của tôi
                        </NavLink>
                        <NavLink to="/student/giangvien" className={navLinkClass}>
                            Giảng viên
                        </NavLink>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className="relative p-2 rounded-full hover:bg-cyan-600 transition"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                            3
                        </span>
                    </button>

                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-cyan-600 transition"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        <img
                            src="/img/avatar.png"
                            alt="Avatar"
                            className="w-9 h-9 rounded-full border border-white/60 object-cover"
                        />
                        <div className="hidden sm:block text-xs leading-tight">
                            <div className="font-semibold">SV. Nguyễn Văn A</div>
                            <div className="text-cyan-100">Khoa KH &amp; KT Máy tính</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 w-full bg-blue-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
                    <Outlet />
                </div>
            </main>

            {/* FOOTER */}
            <Footer />
        </div>
    );
};

export default StuHeader;
