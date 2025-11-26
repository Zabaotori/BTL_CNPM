import React from "react";
import { NavLink } from "react-router-dom";
import { ExternalLink, BookOpen, Library, Calendar, Users } from "lucide-react";

const StuDashboard = () => {
  

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

        <div className="relative p-16 sm:p-24 lg:p-40 gap-6 sm:items-center">
          <div className="bg-cyan-900/15 p-4 rounded-2xl inline-block">
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
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-sm hover:bg-cyan-200 transition-colors duration-200"
              >
                <Calendar className="w-4 h-4" />
                Đăng ký buổi tư vấn
              </NavLink>
              <NavLink
                to="/student/lichcuatoi"
                className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-medium text-black hover:bg-white/10 transition-colors duration-200"
              >
                <Users className="w-4 h-4" />
                Xem lịch của tôi
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Library Card */}
      <section className="bg-white rounded-2xl border mt-20 border-slate-300 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-2/5">
            <img
              src="https://www.uit.edu.vn/sites/vi/files/image_from_word/thu_vien_trung_tam_1.jpg"
              alt="Thư viện Đại học VNU"
              className="w-full h-48 lg:h-full object-cover"
            />
          </div>
          
          {/* Content Section */}
          <div className="lg:w-3/5 p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-cyan-600 rounded-xl p-3 text-white">
                <Library className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">
                  Thư viện Đại học VNU
                </h2>
                <p className="text-slate-600 mt-1">
                  Khám phá kho tài liệu điện tử phong phú với hàng ngàn đầu sách, 
                  luận văn, tạp chí khoa học và tài liệu tham khảo
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="https://www.vnulib.edu.vn/index.php/tai-lieu-dien-tu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-cyan-600 px-6 py-4 text-white font-medium shadow-sm transition-all duration-200 group"
              >
                <BookOpen className="w-5 h-5" />
                <span>Truy cập Thư viện điện tử</span>
                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              </a>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  10,000+ tài liệu
                </span>
                <span>•</span>
                <span>Truy cập 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StuDashboard;