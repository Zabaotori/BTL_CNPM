import React from "react";
import { NavLink } from "react-router-dom";

const TutorDashboard = () => {
  const stats = [
    { label: "Buổi tư vấn đã tạo", value: 5 },
    { label: "Buổi đã chốt lịch", value: 3 },
    { label: "Sinh viên đã đăng ký", value: 87 },
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-cyan-700 via-sky-600 to-blue-600 text-black shadow-lg">
        <div className="absolute inset-0 opacity-70">
          <img
            src="/img/bgMain.jpg"
            alt="Background"
            className=""
          />
        </div>

        <div className="relative bg-white/15 p-16 sm:p-24 lg:p-40 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              Quản lý buổi tư vấn &amp; lịch làm việc
            </h1>
            <p className="mt-4 text-sm sm:text-base text-black font-medium max-w-xl">
              Tạo, chỉnh sửa và chốt lịch các buổi tư vấn với sinh viên. Theo
              dõi số lượng đăng ký và trạng thái buổi tư vấn.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <NavLink
                to="/tutor/buoituvan"
                className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-cyan-200"
              >
                Quản lý buổi tư vấn
              </NavLink>
              <NavLink
                to="/tutor/lichcuatoi"
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
        </div>
      </section>
    </div>
  );
};

export default TutorDashboard;
