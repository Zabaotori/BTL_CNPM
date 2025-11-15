import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Bell, MessageSquare } from "lucide-react";
import Footer from "../Footer/Footer";

const TutorHeader = () => {
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition
     ${isActive ? "bg-white/20" : "hover:bg-cyan-600"}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* HEADER */}
      <header className="w-full bg-cyan-700 text-white px-6 py-3 flex items-center justify-between shadow">
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
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-cyan-600 transition"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
              2
            </span>
          </button>

          <button
            type="button"
            className="p-2 rounded-full hover:bg-cyan-600 transition"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <img
              src="/img/avatar.png"
              alt="Avatar"
              className="w-9 h-9 rounded-full border border-white/60 object-cover"
            />
            <div className="hidden sm:block text-xs leading-tight">
              <div className="font-semibold">GV. Nguyễn Văn A</div>
              <div className="text-cyan-100">
                Khoa Khoa học &amp; Kỹ thuật Máy tính
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default TutorHeader;
