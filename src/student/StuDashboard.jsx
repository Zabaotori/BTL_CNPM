import React from "react";
import { NavLink } from "react-router-dom";

const StuDashboard = () => {
  const stats = [
    { label: "Buổi tư vấn đã đăng ký", value: 3 },
    { label: "Buổi sắp diễn ra", value: 2 },
    { label: "Giảng viên đang mở lịch", value: 5 },
  ];

  const nextSessions = [
    {
      id: 1,
      name: "Bổ túc PPL A",
      course: "Nguyên lý ngôn ngữ lập trình",
      time: "T3, 7h - 9h",
      room: "H3 - 301",
    },
    {
      id: 2,
      name: "Tư vấn học kỳ 241",
      course: "Kế hoạch học tập cá nhân",
      time: "T6, 9h - 11h",
      room: "H6 - 201",
    },
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

        <div className="relative bg-white/15 p-8 sm:p-16 lg:p-24 flex flex-col gap-6 sm:flex-row sm:items-center">
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

          <div className="mt-6 sm:mt-0 sm:w-64 lg:w-72">
            <div className="rounded-xl bg-black/10 p-4 backdrop-blur">
              <div className="text-xs font-semibold uppercase text-black">
                Buổi sắp diễn ra
              </div>
              <div className="mt-3 space-y-3 text-sm">
                {nextSessions.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-lg bg-black/5 px-3 py-2 border border-white/15"
                  >
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-black">{s.course}</div>
                    <div className="mt-1 flex justify-between text-xs text-black">
                      <span>{s.time}</span>
                      <span>{s.room}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[11px] text-black">
                Dữ liệu chỉ mang tính minh họa giao diện.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Tổng quan tư vấn của tôi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-white border border-slate-100 shadow-sm px-4 py-3"
            >
              <div className="text-xs font-medium text-slate-500">
                {s.label}
              </div>
              <div className="mt-2 text-2xl font-semibold text-cyan-700">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StuDashboard;
