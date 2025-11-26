import React from "react";
import { NavLink } from "react-router-dom";

const StuDashboard = () => {
  const stats = [
    { label: "Buổi tư vấn đã đăng ký", value: 3 },
    { label: "Buổi sắp diễn ra", value: 2 },
    { label: "Giảng viên đang mở lịch", value: 5 },
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-cyan-700 via-sky-600 to-blue-600 text-black shadow-lg">
        <div className="absolute inset-0 opacity-70">
          <img
            src="/img/bgMain.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative bg-white/15 p-16 sm:p-24 lg:p-40 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              Quản lý buổi tư vấn <br />
              &amp; lịch làm việc với giảng viên
            </h1>
            <p className="mt-4 text-sm sm:text-base text-black font-medium max-w-xl">
              Đăng ký buổi tư vấn, theo dõi lịch và trạng thái buổi làm việc với
              giảng viên một cách trực quan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <NavLink
                to="/student/buoituvan"
                className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-cyan-200"
              >
                Đăng ký buổi tư vấn
              </NavLink>
              <NavLink
                to="/student/lichcuatoi"
                className="inline-flex items-center rounded-full border border-white/70 px-4 py-2 text-sm font-medium text-black hover:bg-white/10"
              >
                Xem lịch của tôi
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Đi đến thư viện
        </h2>
        <div className="">
          
        </div>
      </section>
    </div>
  );
};

export default StuDashboard;
