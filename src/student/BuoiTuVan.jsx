import axios from "axios";
import { Calendar, Clock, MessageCircle, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

const BuoiTuVan = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date"); // Mặc định sắp xếp theo ngày
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

      const studentId = localStorage.getItem("userId");

      // Lấy danh sách giảng viên
      const tutorsData = await getAllTutors();

      // Với mỗi GV lấy sessions
      const tutorsWithSessions = await Promise.all(
        tutorsData.map(async (tutor) => {
          const sessions = await getTutorSessions(tutor.id);

          return sessions.map(s => ({
            ...s,
            tutor: {
              id: tutor.id,
              name: tutor.name,
              email: tutor.email
            }
          }));
        })
      );

      const allSessions = tutorsWithSessions.flat();

      // ✨ Lấy danh sách đăng ký của SV
      const registrations = await axios.get(
        `http://localhost:8080/student/registrations?studentId=${studentId}`
      );

      console.log(registrations.data);

      const regList = registrations.data; // mảng các registration

      // ✨ Gắn trạng thái registered vào mỗi session
      const sessionsWithReg = allSessions.map((session) => {
        const reg = regList.find(
          (r) => r.availableSessionId === session.id
        );

        return {
          ...session,
          registered: reg?.status === "pending" || reg?.status === "approved",
          cancelled: reg?.status === "canceled",
          rejected: reg?.status === "rejected",
          registrationId: reg?.id || null,
          registrationStatus: reg?.status || null
        };
      });

      setTutors(sessionsWithReg);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
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
      // Ẩn các session có status approved hoặc rejected
      if (session.registrationStatus === "approved" || session.registrationStatus === "rejected") {
        return false;
      }

      if (!search) return true;
      const keyword = search.toLowerCase();
      return (
        session.tutor?.name?.toLowerCase().includes(keyword) ||
        session.name?.toLowerCase().includes(keyword) ||
        session.description?.toLowerCase().includes(keyword)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          // Sắp xếp theo ngày gần nhất
          return new Date(a.date) - new Date(b.date);
        
        case "name":
          // Sắp xếp theo tên giảng viên
          return a.tutor?.name?.localeCompare(b.tutor?.name);
        
        case "course":
          // Sắp xếp theo tên môn học
          return a.name?.localeCompare(b.name);
        
        case "time":
          // Sắp xếp theo thời gian trong ngày
          return a.startTime?.localeCompare(b.startTime);
        
        default:
          return 0;
      }
    });

  // Hàm đăng ký/huỷ đăng ký session
  const handleRegisterSession = async (session, isRegistering) => {
    const studentId = localStorage.getItem("userId");

    try {
      if (isRegistering) {
        await axios.post(
          `http://localhost:8080/student/available-sessions/${session.id}/register?studentId=${studentId}`
        );
      } else {
        await axios.delete(
          `http://localhost:8080/student/registrations/${session.registrationId}`
        );
      }

      await loadData();
    } catch (err) {
      console.log(err);
      alert("Không thể thực hiện yêu cầu.");
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
            <option value="date">Sắp xếp theo ngày</option>
            <option value="name">Sắp xếp theo tên GV</option>
            <option value="course">Sắp xếp theo môn học</option>
            <option value="time">Sắp xếp theo giờ</option>
          </select>
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
          <div className="col-span-full text-center py-12">
            <div className="text-slate-400 mb-3">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-1">
              Không tìm thấy buổi tư vấn
            </h3>
            <p className="text-sm text-slate-500">
              {search 
                ? `Không có buổi tư vấn nào phù hợp với từ khóa "${search}".` 
                : "Hiện không có buổi tư vấn nào đang mở đăng ký."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

// Component cho mỗi session card
const SessionCard = ({ session, onRegister }) => {
  const [processing, setProcessing] = useState(false);

  const handleToggle = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      await onRegister(session, !session.registered);
    } finally {
      setProcessing(false);
    }
  };

  // Kiểm tra xem session có còn trong tương lai không
  const isFutureSession = new Date(session.date) >= new Date();

  return (
    <div className={`bg-white border rounded-xl shadow-sm p-5 flex flex-col ${
      !session.open ? "opacity-60" : ""
    }`}>
      {/* Header với tên GV và status */}
      <div className="mb-4 pb-3 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{session.tutor?.name}</h3>
          <div className="flex flex-col items-end gap-1">
            {!session.open && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                Đã đóng
              </span>
            )}
            {session.registered && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Đã đăng ký
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-500">{session.tutor?.email}</p>
      </div>

      {/* Nội dung session */}
      <div className="flex-1">
        <h4 className="font-medium text-slate-800 text-lg mb-2">
          {session.name}
        </h4>

        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {session.description || "Không có mô tả"}
        </p>

        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-red-500" />
            <span>{new Date(session.date).toLocaleDateString("vi-VN")}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-cyan-500" />
            <span>
              {session.startTime?.slice(0, 5)} - {session.endTime?.slice(0, 5)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users size={16} className="text-green-500" />
            <span>{session.maxStudents} sinh viên</span>
          </div>

          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-yellow-500" />
            <span className="capitalize">
              {session.type === "online" ? "Trực tuyến" : "Trực tiếp"}
            </span>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          disabled={processing || session.cancelled || !session.open || !isFutureSession}
          onClick={handleToggle}
          className={`w-full py-2 rounded-lg text-sm font-medium text-white 
            ${session.cancelled
              ? "bg-slate-400 cursor-not-allowed"
              : !session.open || !isFutureSession
                ? "bg-slate-400 cursor-not-allowed"
                : session.registered
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-cyan-600 hover:bg-cyan-700"
            }`}
        >
          {processing
            ? "Đang xử lý..."
            : session.cancelled
              ? "Đã huỷ đăng ký"
              : !session.open
                ? "Đã đóng đăng ký"
                : !isFutureSession
                  ? "Đã kết thúc"
                  : session.registered
                    ? "Huỷ đăng ký"
                    : "Đăng ký ngay"}
        </button>
      </div>
    </div>
  );
};

export default BuoiTuVan;