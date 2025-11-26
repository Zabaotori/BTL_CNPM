import React, { useState, useEffect } from "react";
import axios from "axios";

const LichCuaToi = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("pending"); // "pending" hoặc "attended"
  const [registrations, setRegistrations] = useState([]); // API 5: Đăng ký đang chờ
  const [attendedSessions, setAttendedSessions] = useState([]); // API 8: Buổi đã tham gia
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  // Lấy danh sách đăng ký của student (API 5)
  const getStudentRegistrations = async () => {
    try {
      const studentId = localStorage.getItem("userId");
      if (!studentId) return [];
      
      const res = await axios({
        url: `http://localhost:8080/student/registrations?studentId=${studentId}`,
        method: "GET"
      });
      return res.data;
    } catch (err) {
      console.log("Lỗi khi lấy danh sách đăng ký:", err);
      return [];
    }
  };

  // Lấy danh sách buổi đã tham gia (API 8)
  const getAttendedSessions = async () => {
    try {
      const studentId = localStorage.getItem("userId");
      if (!studentId) return [];
      
      const res = await axios({
        url: `http://localhost:8080/student/consultation-sessions?studentId=${studentId}`,
        method: "GET"
      });
      return res.data;
    } catch (err) {
      console.log("Lỗi khi lấy danh sách buổi đã tham gia:", err);
      return [];
    }
  };

  // Load dữ liệu
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [registrationsData, attendedData] = await Promise.all([
        getStudentRegistrations(),
        getAttendedSessions()
      ]);
      
      setRegistrations(registrationsData);
      setAttendedSessions(attendedData);
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

  // Hàm huỷ đăng ký
  const handleCancelRegistration = async (registrationId) => {
    try {
      await axios.delete(
        `http://localhost:8080/student/registrations/${registrationId}`
      );
      
      alert("Đã huỷ đăng ký thành công!");
      await loadData(); // Reload dữ liệu
      
    } catch (err) {
      console.log("Lỗi khi huỷ đăng ký:", err);
      alert("Có lỗi xảy ra khi huỷ đăng ký. Vui lòng thử lại.");
    }
  };

  // Lọc dữ liệu theo search
  const filteredRegistrations = registrations.filter((reg) => {
    if (!search) return true;
    const keyword = search.toLowerCase();
    return (
      reg.sessionName?.toLowerCase().includes(keyword) ||
      reg.tutorName?.toLowerCase().includes(keyword) ||
      reg.description?.toLowerCase().includes(keyword)
    );
  });

  const filteredAttendedSessions = attendedSessions.filter((session) => {
    if (!search) return true;
    const keyword = search.toLowerCase();
    return (
      session.name?.toLowerCase().includes(keyword) ||
      session.tutorName?.toLowerCase().includes(keyword) ||
      session.description?.toLowerCase().includes(keyword)
    );
  });

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
            Lịch tư vấn của tôi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách các buổi tư vấn mà bạn đã đăng ký hoặc đã tham gia.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-56 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "pending"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Đang chờ xác nhận
            <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
              {registrations.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("attended")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "attended"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Đã xác nhận
            <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
              {attendedSessions.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Bảng Đang chờ xác nhận */}
      {activeTab === "pending" && (
        <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Tên buổi</th>
                <th className="px-4 py-3">Giảng viên</th>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Hình thức</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((reg) => (
                <tr
                  key={reg.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {reg.sessionName}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{reg.tutorName}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {reg.date ? new Date(reg.date).toLocaleDateString("vi-VN") : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {reg.startTime?.slice(0, 5)} - {reg.endTime?.slice(0, 5)}
                  </td>
                  <td className="px-4 py-3 text-slate-700 capitalize">
                    {reg.type === "online" ? "Trực tuyến" : "Trực tiếp"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={reg.status} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSession(reg)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Chi tiết
                    </button>
                    {reg.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => handleCancelRegistration(reg.id)}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        Huỷ
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRegistrations.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    {search ? `Không có buổi nào phù hợp với từ khóa "${search}".` : "Chưa có buổi tư vấn nào đang chờ xác nhận."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* Bảng Đã tham gia */}
      {activeTab === "attended" && (
        <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Tên buổi</th>
                <th className="px-4 py-3">Giảng viên</th>
                <th className="px-4 py-3">Phòng/Zoom</th>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Hình thức</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendedSessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {session.name}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{session.tutorName}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {session.room || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {session.date ? new Date(session.date).toLocaleDateString("vi-VN") : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {session.startTime?.slice(0, 5)} - {session.endTime?.slice(0, 5)}
                  </td>
                  <td className="px-4 py-3 text-slate-700 capitalize">
                    {session.type === "online" ? "Trực tuyến" : "Trực tiếp"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedSession(session)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAttendedSessions.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    {search ? `Không có buổi nào phù hợp với từ khóa "${search}".` : "Chưa có buổi tư vấn nào được xác nhận."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      <SessionDetailModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
        type={activeTab}
      />
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          borderColor: "border-amber-100",
          label: "Chờ xác nhận"
        };
      case "approved":
        return {
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-100",
          label: "Đã xác nhận"
        };
      case "canceled":
        return {
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-100",
          label: "Đã huỷ"
        };
      case "rejected":
        return {
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-100",
          label: "Đã bị từ chối"
        };
      default:
        return {
          bgColor: "bg-slate-50",
          textColor: "text-slate-600",
          borderColor: "border-slate-200",
          label: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      {config.label}
    </span>
  );
};

const SessionDetailModal = ({ session, onClose, type }) => {
  if (!session) return null;

  const isAttendedTab = type === "attended";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Chi tiết buổi tư vấn
        </h2>
        <div className="text-sm text-slate-700 space-y-3">
          <div>
            <span className="font-medium">Tên buổi: </span>
            <span>{session.sessionName || session.name}</span>
          </div>
          <div>
            <span className="font-medium">Giảng viên: </span>
            <span>{session.tutorName}</span>
          </div>
          {isAttendedTab && (
            <div>
              <span className="font-medium">Phòng/Zoom: </span>
              <span>{session.room || "N/A"}</span>
            </div>
          )}
          <div>
            <span className="font-medium">Ngày: </span>
            <span>{session.date ? new Date(session.date).toLocaleDateString("vi-VN") : "N/A"}</span>
          </div>
          <div>
            <span className="font-medium">Thời gian: </span>
            <span>{session.startTime?.slice(0, 5)} - {session.endTime?.slice(0, 5)}</span>
          </div>
          <div>
            <span className="font-medium">Hình thức: </span>
            <span className="capitalize">{session.type === "online" ? "Trực tuyến" : "Trực tiếp"}</span>
          </div>
          <div>
            <span className="font-medium">Mô tả: </span>
            <span>{session.description || "Không có mô tả"}</span>
          </div>
          {!isAttendedTab && (
            <div>
              <span className="font-medium">Trạng thái: </span>
              <StatusBadge status={session.status} />
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default LichCuaToi;