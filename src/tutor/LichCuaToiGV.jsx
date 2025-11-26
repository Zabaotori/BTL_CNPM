import React, { useState, useEffect } from "react";
import axios from "axios";

const LichCuaToiGV = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("available"); // "available" hoặc "confirmed"
  const [availableSessions, setAvailableSessions] = useState([]); // API 2: Available sessions
  const [consultationSessions, setConsultationSessions] = useState([]); // API 5: Consultation sessions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmSession, setConfirmSession] = useState(null); // Session cần xác nhận
  const [room, setRoom] = useState(""); // Phòng cho buổi tư vấn
  const [approvingRegistrations, setApprovingRegistrations] = useState(false); // Trạng thái đang duyệt registration
  const [registrationCounts, setRegistrationCounts] = useState({}); // Lưu số lượng registration của từng session

  const tutorId = localStorage.getItem("userId");

  // Lấy available sessions của tutor 
  const getAvailableSessions = async () => {
    try {
      let res = await axios({
        url: `http://localhost:8080/tutor/${tutorId}/available-sessions`,
        method: "GET"
      });
      return res.data;
    } catch (err) {
      console.log("Lỗi khi lấy available sessions:", err);
      return [];
    }
  };

  // Lấy consultation sessions của tutor 
  const getConsultationSessions = async () => {
    try {
      const res = await axios({
        url: `http://localhost:8080/tutor/${tutorId}/consultation-sessions`,
        method: "GET"
      });
      return res.data;
    } catch (err) {
      console.log("Lỗi khi lấy consultation sessions:", err);
      return [];
    }
  };

  // Lấy số lượng registration của một available session
  const getRegistrationCount = async (availableSessionId) => {
    try {
      let res = await axios({
        url: `http://localhost:8080/tutor/available-sessions/${availableSessionId}/registrations`,
        method: "GET"
      });
      return res.data.length;
    } catch (err) {
      console.log(`Lỗi khi lấy registrations của session ${availableSessionId}:`, err);
      return 0;
    }
  };

  // Load dữ liệu
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [availableData, consultationData] = await Promise.all([
        getAvailableSessions(),
        getConsultationSessions()
      ]);
      
      setAvailableSessions(availableData);
      setConsultationSessions(consultationData);

      // Lấy số lượng registration cho từng available session
      const countPromises = availableData.map(async (session) => {
        const count = await getRegistrationCount(session.id);
        return { sessionId: session.id, count };
      });

      const counts = await Promise.all(countPromises);
      const countsMap = counts.reduce((acc, { sessionId, count }) => {
        acc[sessionId] = count;
        return acc;
      }, {});

      setRegistrationCounts(countsMap);
      
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      console.log("Lỗi khi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tutorId) {
      loadData();
    }
  }, [tutorId]);

  // Lấy tất cả registrations của một available session 
  const getRegistrationsOfAvailableSession = async (availableSessionId) => {
    try {
      let res = await axios({
        url: `http://localhost:8080/tutor/available-sessions/${availableSessionId}/registrations`,
        method: "GET"
      });
      return res.data;
    } catch (err) {
      console.log("Lỗi khi lấy registrations:", err);
      return [];
    }
  };

  // Duyệt một registration (API 7)
  const approveRegistration = async (registrationId) => {
    try {
      let res = await axios({
        url: `http://localhost:8080/tutor/registrations/${registrationId}/approve`,
        method: "PATCH"
      });
      return true;
    } catch (err) {
      console.log(`Lỗi khi duyệt registration ${registrationId}:`, err);
      return false;
    }
  };

  // Duyệt toàn bộ registrations của một session
  const approveAllRegistrations = async (availableSessionId) => {
    try {
      setApprovingRegistrations(true);
      
      // Lấy tất cả registrations của session
      const registrations = await getRegistrationsOfAvailableSession(availableSessionId);
      
      if (registrations.length === 0) {
        console.log("Không có registration nào để duyệt");
        return true;
      }

      // Lọc chỉ những registration có status PENDING
      const pendingRegistrations = registrations.filter(reg => reg.status === "pending");
      
      if (pendingRegistrations.length === 0) {
        console.log("Không có registration nào ở trạng thái PENDING");
        return true;
      }

      console.log(`Bắt đầu duyệt ${pendingRegistrations.length} registration(s)`);

      // Duyệt từng registration
      const approvePromises = pendingRegistrations.map(reg => 
        approveRegistration(reg.id)
      );

      const results = await Promise.allSettled(approvePromises);
      
      const successfulApprovals = results.filter(result => result.status === 'fulfilled' && result.value).length;
      const failedApprovals = results.filter(result => result.status === 'rejected' || !result.value).length;

      console.log(`Kết quả duyệt: ${successfulApprovals} thành công, ${failedApprovals} thất bại`);

      if (failedApprovals > 0) {
        alert(`Đã xác nhận buổi tư vấn nhưng có ${failedApprovals} registration duyệt thất bại. Vui lòng kiểm tra lại.`);
        return false;
      }

      alert(`Đã xác nhận buổi tư vấn và duyệt thành công ${successfulApprovals} registration(s).`);
      return true;

    } catch (err) {
      console.log("Lỗi trong quá trình duyệt registrations:", err);
      alert("Có lỗi xảy ra khi duyệt các registration. Vui lòng thử lại.");
      return false;
    } finally {
      setApprovingRegistrations(false);
    }
  };

  // Xác nhận buổi tư vấn (API 4) và duyệt toàn bộ registration
  const handleConfirmSession = async () => {
    if (!room.trim()) {
      alert("Vui lòng nhập thông tin phòng");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/tutor/consultation-sessions/create",
        {
          availableSessionId: confirmSession.id,
          room: room.trim()
        }
      );
      
      // Bước 2: Duyệt toàn bộ registration của session này
      const approvalSuccess = await approveAllRegistrations(confirmSession.id);
      
      if (approvalSuccess) {
        alert("Xác nhận buổi tư vấn và duyệt registration thành công!");
      } else {
        alert("Đã xác nhận buổi tư vấn nhưng có lỗi khi duyệt một số registration.");
      }
      
      setConfirmSession(null);
      setRoom("");
      await loadData(); // Reload dữ liệu
      
    } catch (err) {
      console.log("Lỗi khi xác nhận buổi tư vấn:", err);
      alert("Có lỗi xảy ra khi xác nhận buổi tư vấn. Vui lòng thử lại.");
    }
  };

  // Lọc dữ liệu theo search
  const filteredAvailableSessions = availableSessions.filter((session) => {
    if (!search) return true;
    const keyword = search.toLowerCase();
    return (
      session.name?.toLowerCase().includes(keyword) ||
      session.description?.toLowerCase().includes(keyword)
    );
  });

  const filteredConsultationSessions = consultationSessions.filter((session) => {
    if (!search) return true;
    const keyword = search.toLowerCase();
    return (
      session.name?.toLowerCase().includes(keyword) ||
      session.description?.toLowerCase().includes(keyword) ||
      session.room?.toLowerCase().includes(keyword)
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
            Quản lý các buổi tư vấn đang chờ xác nhận và đã được xác nhận.
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
            onClick={() => setActiveTab("available")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "available"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Đang chờ xác nhận
            <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
              {availableSessions.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "confirmed"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Đã xác nhận
            <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
              {consultationSessions.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Bảng Available Sessions - Đang chờ xác nhận */}
      {activeTab === "available" && (
        <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Tên buổi</th>
                <th className="px-4 py-3">Mô tả</th>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Hình thức</th>
                <th className="px-4 py-3">Số SV đăng ký</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAvailableSessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {session.name}
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                    {session.description || "Không có mô tả"}
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
                  <td className="px-4 py-3 text-slate-700 text-center">
                    <div className="flex items-center justify-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        registrationCounts[session.id] > 0 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {registrationCounts[session.id] || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge open={session.open} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setConfirmSession(session)}
                      disabled={registrationCounts[session.id] === 0}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        registrationCounts[session.id] > 0
                          ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                          : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Xác nhận
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAvailableSessions.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
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

      {/* Bảng Consultation Sessions - Đã xác nhận */}
      {activeTab === "confirmed" && (
        <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Tên buổi</th>
                <th className="px-4 py-3">Mô tả</th>
                <th className="px-4 py-3">Phòng/Zoom</th>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Hình thức</th>
              </tr>
            </thead>
            <tbody>
              {filteredConsultationSessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {session.name}
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                    {session.description || "Không có mô tả"}
                  </td>
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
                </tr>
              ))}
              {filteredConsultationSessions.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    {search ? `Không có buổi nào phù hợp với từ khóa "${search}".` : "Chưa có buổi tư vấn nào đã xác nhận."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* Modal xác nhận buổi tư vấn */}
      <ConfirmSessionModal
        open={!!confirmSession}
        session={confirmSession}
        room={room}
        onRoomChange={setRoom}
        onCancel={() => {
          setConfirmSession(null);
          setRoom("");
        }}
        onConfirm={handleConfirmSession}
        approving={approvingRegistrations}
        registrationCount={confirmSession ? registrationCounts[confirmSession.id] || 0 : 0}
      />
    </div>
  );
};

const StatusBadge = ({ open }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border
        ${
          open
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-amber-50 text-amber-700 border-amber-100"
        }`}
    >
      {open ? "Đang mở" : "Đang đóng"}
    </span>
  );
};

// Modal xác nhận buổi tư vấn
const ConfirmSessionModal = ({ open, session, room, onRoomChange, onCancel, onConfirm, approving, registrationCount }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Xác nhận buổi tư vấn
        </h2>
        
        <div className="text-sm text-slate-700 space-y-3 mb-4">
          <div>
            <span className="font-medium">Tên buổi: </span>
            <span>{session.name}</span>
          </div>
          <div>
            <span className="font-medium">Ngày: </span>
            <span>{session.date ? new Date(session.date).toLocaleDateString("vi-VN") : "N/A"}</span>
          </div>
          <div>
            <span className="font-medium">Thời gian: </span>
            <span>{session.startTime?.slice(0, 5)} - {session.endTime?.slice(0, 5)}</span>
          </div>
          <div>
            <span className="font-medium">Số sinh viên đã đăng ký: </span>
            <span className="font-semibold text-blue-600">{registrationCount}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Phòng/Zoom *
          </label>
          <input
            type="text"
            value={room}
            onChange={(e) => onRoomChange(e.target.value)}
            placeholder="Ví dụ: H3-301 hoặc Zoom-123"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <p className="text-xs text-slate-500">
            {session.type === "online" 
              ? "Nhập link Zoom/Meet hoặc ID phòng họp" 
              : "Nhập số phòng học trực tiếp"}
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6 text-sm">
          <button
            type="button"
            onClick={onCancel}
            disabled={approving}
            className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!room.trim() || approving}
            className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-700 disabled:bg-cyan-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {approving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </>
            ) : (
              "Xác nhận"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LichCuaToiGV;