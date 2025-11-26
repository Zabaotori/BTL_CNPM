import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "lucide-react";

const QuanLyDangKy = () => {
  const [consultationSessions, setConsultationSessions] = useState([]);
  const [participantsData, setParticipantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("session"); // "session", "date", "student"

  const tutorId = localStorage.getItem("userId");

  // Lấy consultation sessions của tutor (API 5)
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

  // Lấy participants của từng consultation session (API 9)
  const getParticipantsOfSession = async (sessionId) => {
    try {
      const res = await axios({
        url: `http://localhost:8080/tutor/consultation-sessions/${sessionId}/participants`,
        method: "GET"
      });
      return res.data;
    } catch (err) {
      console.log(`Lỗi khi lấy participants của session ${sessionId}:`, err);
      return [];
    }
  };

  // Load dữ liệu
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy danh sách consultation sessions
      const sessions = await getConsultationSessions();
      
      // Lấy participants của từng session
      const participantsPromises = sessions.map(async (session) => {
        const participants = await getParticipantsOfSession(session.id);
        return participants.map(participant => ({
          ...participant,
          sessionId: session.id,
          sessionName: session.name,
          sessionDate: session.date,
          sessionStartTime: session.startTime,
          sessionEndTime: session.endTime,
          sessionType: session.type,
          room: session.room
        }));
      });

      const participantsArrays = await Promise.all(participantsPromises);
      const allParticipants = participantsArrays.flat();
      
      setConsultationSessions(sessions);
      setParticipantsData(allParticipants);
      
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

  // Sắp xếp dữ liệu
  const sortedParticipants = [...participantsData].sort((a, b) => {
    switch (sortBy) {
      case "session":
        return a.sessionName.localeCompare(b.sessionName) || 
               new Date(a.sessionDate) - new Date(b.sessionDate);
      
      case "date":
        return new Date(a.sessionDate) - new Date(b.sessionDate) ||
               a.sessionStartTime.localeCompare(b.sessionStartTime);
      
      case "student":
        return a.studentName.localeCompare(b.studentName);
      
      default:
        return 0;
    }
  });

  // Nhóm theo session để dễ nhìn
  const groupedBySession = sortedParticipants.reduce((groups, participant) => {
    const sessionKey = `${participant.sessionId}-${participant.sessionName}`;
    if (!groups[sessionKey]) {
      groups[sessionKey] = {
        sessionId: participant.sessionId,
        sessionName: participant.sessionName,
        sessionDate: participant.sessionDate,
        sessionStartTime: participant.sessionStartTime,
        sessionEndTime: participant.sessionEndTime,
        sessionType: participant.sessionType,
        room: participant.room,
        participants: []
      };
    }
    groups[sessionKey].participants.push(participant);
    return groups;
  }, {});

  const sessionGroups = Object.values(groupedBySession);

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
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Quản lý sinh viên đăng ký
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách sinh viên đã đăng ký tham gia các buổi tư vấn của bạn.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="session">Sắp xếp theo buổi tư vấn</option>
            <option value="date">Sắp xếp theo ngày</option>
            <option value="student">Sắp xếp theo sinh viên</option>
          </select>
        </div>
      </header>

      {/* Hiển thị theo nhóm session */}
      <div className="space-y-6">
        {sessionGroups.map((sessionGroup) => (
          <section key={sessionGroup.sessionId} className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Session Header */}
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {sessionGroup.sessionName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-slate-600">
                    <span>
                      <Calendar className=" inline-block text-blue-400 mr-1 h-[50%]"></Calendar>
                       {sessionGroup.sessionDate ? new Date(sessionGroup.sessionDate).toLocaleDateString("vi-VN") : "N/A"}
                    </span>
                    <span>
                      ⏰ {sessionGroup.sessionStartTime?.slice(0, 5)} - {sessionGroup.sessionEndTime?.slice(0, 5)}
                    </span>
                    <span>
                      🏢 {sessionGroup.room || "Chưa có phòng"}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      sessionGroup.sessionType === "online" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {sessionGroup.sessionType === "online" ? "Trực tuyến" : "Trực tiếp"}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  {sessionGroup.participants.length} sinh viên
                </div>
              </div>
            </div>

            {/* Participants Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white text-left text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">MSSV</th>
                    <th className="px-4 py-3">Họ và tên</th>
                    <th className="px-4 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionGroup.participants.map((participant) => (
                    <tr
                      key={participant.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 text-slate-700">
                        {participant.studentId}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {participant.studentName}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Đã tham gia
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {/* Hiển thị khi không có dữ liệu */}
        {sessionGroups.length === 0 && (
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="px-4 py-12 text-center">
              <div className="text-slate-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-1">
                Chưa có sinh viên đăng ký
              </h3>
              <p className="text-sm text-slate-500">
                Hiện chưa có sinh viên nào đăng ký tham gia các buổi tư vấn của bạn.
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Thống kê tổng quan */}
      {sessionGroups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg bg-white p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">
              {consultationSessions.length}
            </div>
            <div className="text-sm text-slate-600">Tổng số buổi tư vấn</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">
              {participantsData.length}
            </div>
            <div className="text-sm text-slate-600">Tổng số sinh viên</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">
              {new Set(participantsData.map(p => p.studentId)).size}
            </div>
            <div className="text-sm text-slate-600">Số sinh viên duy nhất</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyDangKy;