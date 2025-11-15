import React, { useState } from "react";

const initialSessions = [
  {
    id: 1,
    name: "Bổ túc PPL A",
    lecturer: "Giảng viên A",
    room: "H3 - 301",
    time: "T3, 7h - 9h",
    status: "Đã xác nhận",
  },
  {
    id: 2,
    name: "Bổ túc PPL A",
    lecturer: "Giảng viên A",
    room: "H3 - 301",
    time: "T6, 7h - 9h",
    status: "Đã xác nhận",
  },
];

const LichCuaToiGV = () => {
  const [search, setSearch] = useState("");
  const [sessions] = useState(initialSessions);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredSessions = sessions.filter((s) => {
    const keyword = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(keyword) ||
      s.lecturer.toLowerCase().includes(keyword) ||
      s.room.toLowerCase().includes(keyword) ||
      s.time.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Lịch tư vấn của tôi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách các buổi tư vấn mà bạn đã tạo và đã chốt lịch.
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

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Tên buổi</th>
              <th className="px-4 py-3">Giảng viên</th>
              <th className="px-4 py-3">Phòng</th>
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((s) => (
              <tr
                key={s.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  {s.name}
                </td>
                <td className="px-4 py-3 text-slate-700">{s.lecturer}</td>
                <td className="px-4 py-3 text-slate-700">{s.room}</td>
                <td className="px-4 py-3 text-slate-700">{s.time}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(s)}
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
            {filteredSessions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Không có buổi nào phù hợp với từ khóa “{search}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <ConfirmModal
        open={!!confirmDelete}
        title="Xoá buổi tư vấn"
        message={
          confirmDelete
            ? `Bạn có chắc muốn xoá buổi “${confirmDelete.name}” khỏi lịch không?`
            : ""
        }
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => setConfirmDelete(null)}
      />
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const isConfirmed = status === "Đã xác nhận";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
        ${
          isConfirmed
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
            : "bg-slate-50 text-slate-600 border border-slate-200"
        }`}
    >
      {status}
    </span>
  );
};

const ConfirmModal = ({ open, title, message, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">
          {title || "Xác nhận"}
        </h2>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3 text-sm">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default LichCuaToiGV;
