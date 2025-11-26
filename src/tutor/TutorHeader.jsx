import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Bell, MessageCircle } from "lucide-react";
import Footer from "../Footer/Footer";

const TutorHeader = () => {
    const navLinkClass = ({ isActive }) =>
        `px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition
     ${isActive ? "bg-white/20" : "hover:bg-cyan-600"}`;

    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    // console.log(userId);
    // console.log(name);
    // console.log(role);

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
                                Khu vực giảng viên tư vấn
                            </div>
                        </div>
                    </div>

                    <nav className="flex items-center gap-1 text-sm">
                        <NavLink to="/tutor" end className={navLinkClass}>
                            Bảng điều khiển
                        </NavLink>
                        <NavLink to="/tutor/buoituvan" className={navLinkClass}>
                            Buổi tư vấn
                        </NavLink>
                        <NavLink to="/tutor/lichcuatoi" className={navLinkClass}>
                            Lịch của tôi
                        </NavLink>
                        <NavLink to="/tutor/quanly" className={navLinkClass}>
                            Quản lý đăng ký
                        </NavLink>
                    </nav>
                </div>

                <div className="flex items-center gap-4">

                    <div className="flex items-center gap-2">
                        <img
                            src="/img/avatar.png"
                            alt="Avatar"
                            className="w-9 h-9 rounded-full border border-white/60 object-cover"
                        />
                        <div className="hidden sm:block text-xs leading-tight">
                            <div className="font-semibold">{name}</div>
                            <div className="text-cyan-100">
                                {role}
                            </div>
                        </div>
                    </div>

                    <NavLink className=" bg-cyan-700 cursor-pointer p-2 rounded hover:bg-cyan-400 text-sm" to={'/login'}>
                        Đăng xuất
                    </NavLink>
                </div>
            </header>

            {/* CONTENT */}
            <main className="flex-1 w-full">
                <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
                    <Outlet />
                </div>
            </main>

            {/* FOOTER */}
            <Footer />
        </div>
    );
};

export default TutorHeader;
