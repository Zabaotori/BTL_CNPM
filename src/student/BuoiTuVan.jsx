import axios from "axios";
import { Calendar, Clock, MessageCircle, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

const BuoiTuVan = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách tất cả giảng viên
  const getAllTutors = async () => {
    try {
      const res = await axios({
        url: `http://localhost:8080/student/tutors`,
        method: "GET"
      });
      return res.data;
    } catch (err) {
      console.log("Lỗi khi lấy danh sách giảng viên:", err);
      throw err;
    }
  };

  // Lấy sessions của từng giảng viên
  const getTutorSessions = async (tutorId) => {
    try {
      const res = await axios({
        url: `http://localhost:8080/student/tutors/${tutorId}/available-sessions`,
        method: "GET"
      });
      return res.data;
    } catch (err) {
      console.log(`Lỗi khi lấy sessions của giảng viên ${tutorId}:`, err);
      return [];
    }
  };

  // Load dữ liệu
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy danh sách giảng viên
      const tutorsData = await getAllTutors();
      
      // Với mỗi giảng viên, lấy sessions của họ
      const tutorsWithSessions = await Promise.all(
        tutorsData.map(async (tutor) => {
          try {
            const sessions = await getTutorSessions(tutor.id);
            // Thêm thông tin tutor vào mỗi session
            const sessionsWithTutor = sessions.map(session => ({
              ...session,
              tutor: {
                id: tutor.id,
                name: tutor.name,
                email: tutor.email
              }
            }));
            return sessionsWithTutor;
          } catch (err) {
            return [];
          }
        })
      );
      
      // Gom tất cả sessions thành một mảng duy nhất
      const allSessions = tutorsWithSessions.flat();
      setTutors(allSessions);
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      console.log("Lỗi khi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Lọc và sắp xếp sessions
  const filteredSessions = tutors
    .filter((session) => {
      if (!search) return true;
      const keyword = search.toLowerCase();
      return (
        session.tutor?.name?.toLowerCase().includes(keyword) ||
        session.name?.toLowerCase().includes(keyword) ||
        session.description?.toLowerCase().includes(keyword)
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.tutor?.name?.localeCompare(b.tutor?.name);
      if (sortBy === "course") return a.name?.localeCompare(b.name);
      return 0;
    });

  // Hàm đăng ký/huỷ đăng ký session
  const handleRegisterSession = async (sessionId, isRegistering) => {
    try {
      const studentId = localStorage.getItem("userId");
      
      if (isRegistering) {
        await axios.post(`http://localhost:8080/student/sessions/${sessionId}/register`, {
          studentId: Number(studentId)
        });
      } else {
        await axios.delete(`http://localhost:8080/student/sessions/${sessionId}/cancel`, {
          data: { studentId: Number(studentId) }
        });
      }
      
      await loadData();
      
    } catch (err) {
      console.log("Lỗi khi đăng ký/huỷ session:", err);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-slate-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
        <button 
          onClick={loadData}
          className="ml-4 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Buổi tư vấn cho sinh viên
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem danh sách buổi tư vấn theo giảng viên và đăng ký / huỷ đăng ký buổi phù hợp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm giảng viên hoặc buổi tư vấn..."
              className="w-56 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sắp xếp theo tên GV</option>
            <option value="course">Sắp xếp theo môn học</option>
          </select>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700"
          >
            Gợi ý buổi tư vấn
          </button>
        </div>
      </header>

      {/* Cards - Mỗi session là một card riêng */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <SessionCard 
            key={session.id} 
            session={session} 
            onRegister={handleRegisterSession}
          />
        ))}

        {filteredSessions.length === 0 && (
          <div className="col-span-full text-center text-sm text-slate-500 py-10">
            Không tìm thấy buổi tư vấn phù hợp với từ khóa "{search}".
          </div>
        )}
      </section>

      <CreateConsultationModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

// Component cho mỗi session card
const SessionCard = ({ session, onRegister }) => {
  const [registered, setRegistered] = useState(session.registered || false);

  const handleToggle = async () => {
    try {
      await onRegister(session.id, !registered);
      setRegistered(!registered);
    } catch (err) {
      console.log("Lỗi khi thay đổi trạng thái đăng ký:", err);
    }
  };

  return (
    <div className="bg-white border border-slate-300 rounded-xl shadow-sm p-5 flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      {/* Thông tin giảng viên */}
      <div className="mb-4 pb-3 border-b border-slate-100">
        <h3 className="text-xl font-semibold text-slate-800">
          {session.tutor?.name || "Giảng viên"}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          {session.tutor?.email}
        </p>
      </div>

      {/* Thông tin buổi tư vấn */}
      <div className="flex-1">
        <h4 className="font-medium text-slate-800 text-lg mb-2">
          {session.name || "Buổi tư vấn"}
        </h4>
        
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {session.description || "Không có mô tả"}
        </p>

        {/* Chi tiết buổi tư vấn */}
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span><Calendar size={16} className="text-red-500" /></span>
            <span>
              {session.date ? new Date(session.date).toLocaleDateString("vi-VN") : "Chưa xác định"}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span><Clock size={16} className="text-cyan-500" /></span>
            <span>
              {session.startTime?.slice(0, 5)} - {session.endTime?.slice(0, 5)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span><Users size={16} className="text-green-500" /></span>
            <span>
              {session.maxStudents || 1} sinh viên
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span><MessageCircle size={16} className="text-yellow-500" /></span>
            <span className="capitalize">
              {session.type === "online" ? "Trực tuyến" : "Trực tiếp"}
            </span>
          </div>
        </div>
      </div>

      {/* Nút đăng ký/huỷ */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleToggle}
          className={`w-full py-2 rounded-lg text-sm font-medium text-white transition-colors duration-200
            ${
              registered
                ? "bg-red-500 hover:bg-red-600"
                : "bg-cyan-600 hover:bg-cyan-700"
            }`}
        >
          {registered ? "Huỷ đăng ký" : "Đăng ký ngay"}
        </button>
      </div>
    </div>
  );
};

const CreateConsultationModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Gợi ý / yêu cầu buổi tư vấn
        </h2>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-700 text-sm font-medium">
              Môn học / chủ đề
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ví dụ: Nguyên lý ngôn ngữ lập trình"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium">
              Mô tả nhu cầu
            </label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Bạn cần giảng viên hỗ trợ nội dung gì, lớp/mã số SV, số lượng dự kiến..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 text-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-700"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuoiTuVan;