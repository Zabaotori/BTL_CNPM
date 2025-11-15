import React, { useState } from "react";

const initialSessions = [
  {
    id: 1,
    name: "Bổ túc PPL A",
    course: "Nguyên lý ngôn ngữ lập trình",
    description: "Ôn tập phần đệ quy, kiểu dữ liệu trừu tượng, bài tập khó.",
    slots: [
      { id: "s1", label: "T3, 7h - 9h", room: "H3 - 301", count: 24, status: "Đang mở" },
      { id: "s2", label: "T6, 7h - 9h", room: "H3 - 301", count: 18, status: "Đang mở" },
    ],
  },
  {
    id: 2,
    name: "Tư vấn học kỳ 241",
    course: "Kế hoạch học tập cá nhân",
    description: "Trao đổi về lộ trình học tập, môn học nên đăng ký.",
    slots: [
      { id: "s3", label: "T4, 9h - 11h", room: "H6 - 201", count: 12, status: "Đã chốt" },
    ],
  },
];

const BuoiTuVanGV = () => {
  const [search, setSearch] = useState("");
  const [sessions] = useState(initialSessions);
  const [sortBy, setSortBy] = useState("name");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredSessions = sessions
    .filter((s) => {
      const keyword = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(keyword) ||
        s.course.toLowerCase().includes(keyword) ||
        s.description.toLowerCase().includes(keyword)
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "course") return a.course.localeCompare(b.course);
      return 0;
    });

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Quản lý buổi tư vấn
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tạo, chỉnh sửa và chốt lịch các buổi tư vấn. Mỗi buổi có thể có
            nhiều ca tư vấn khác nhau.
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

          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sắp xếp theo tên buổi</option>
            <option value="course">Sắp xếp theo môn học</option>
          </select>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700"
          >
            Tạo buổi tư vấn
          </button>
        </div>
      </header>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSessions.map((s) => (
          <article
            key={s.id}
            className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col"
          >
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-800">
                {s.name}
              </h2>
              <div className="text-sm text-slate-500">{s.course}</div>
              <p className="mt-2 text-sm text-slate-600">{s.description}</p>

              <div className="mt-4 space-y-2 text-sm">
                {s.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                  >
                    <div>
                      <div className="font-medium text-slate-800">
                        {slot.label} • {slot.room}
                      </div>
                      <div className="text-xs text-slate-500">
                        SV đã đăng ký: {slot.count}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium
                        ${
                          slot.status === "Đã chốt"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-50 text-slate-600 border border-slate-200"
                        }`}
                    >
                      {slot.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setEditingSession(s)}
                className="rounded-full border border-slate-200 px-3 py-1 font-medium text-slate-700 hover:bg-slate-50"
              >
                Chỉnh sửa
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(s)}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1 font-medium text-red-600 hover:bg-red-100"
              >
                Xoá
              </button>
            </div>
          </article>
        ))}

        {filteredSessions.length === 0 && (
          <div className="col-span-full text-center text-sm text-slate-500 py-10">
            Không có buổi tư vấn nào phù hợp với từ khóa “{search}”.
          </div>
        )}
      </section>

      <CreateSessionModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <EditSessionModal
        session={editingSession}
        onClose={() => setEditingSession(null)}
      />

      <ConfirmModal
        open={!!confirmDelete}
        title="Xoá buổi tư vấn"
        message={
          confirmDelete
            ? `Bạn có chắc muốn xoá buổi “${confirmDelete.name}” không?`
            : ""
        }
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => setConfirmDelete(null)}
      />
    </div>
  );
};

const CreateSessionModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Tạo buổi tư vấn mới
        </h2>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-700 text-sm font-medium">
              Tên buổi tư vấn
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ví dụ: Bổ túc PPL A"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium">
              Môn học
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ví dụ: Nguyên lý ngôn ngữ lập trình"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium">
              Mô tả
            </label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Nội dung buổi tư vấn, đối tượng sinh viên, yêu cầu chuẩn bị..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 text-sm font-medium">
                Thời gian đăng ký (Từ)
              </label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 text-sm font-medium">
                Thời gian đăng ký (Đến)
              </label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
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
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

const EditSessionModal = ({ session, onClose }) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Chỉnh sửa buổi tư vấn
        </h2>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-700 text-sm font-medium">
              Tên buổi tư vấn
            </label>
            <input
              type="text"
              defaultValue={session.name}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium">
              Môn học
            </label>
            <input
              type="text"
              defaultValue={session.course}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium">
              Mô tả
            </label>
            <textarea
              rows={3}
              defaultValue={session.description}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
            Lưu
          </button>
        </div>
      </div>
    </div>
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

export default BuoiTuVanGV;
