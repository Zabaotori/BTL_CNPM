import React, { useState } from "react";

const lecturers = [
  {
    id: 1,
    name: "Giảng viên A",
    topic: "Bổ túc Nguyên lý ngôn ngữ lập trình",
    course: "Nguyên lý ngôn ngữ lập trình",
    slots: [
      { id: "a1", label: "T3, 7h - 9h", registeredCount: 24 },
      { id: "a2", label: "T4, 7h - 9h", registeredCount: 18 },
      { id: "a3", label: "T6, 7h - 9h", registeredCount: 30 },
    ],
  },
  {
    id: 2,
    name: "Giảng viên B",
    topic: "Tư vấn đồ án môn học",
    course: "Lập trình Web",
    slots: [
      { id: "b1", label: "T2, 9h - 11h", registeredCount: 15 },
      { id: "b2", label: "T5, 13h - 15h", registeredCount: 22 },
    ],
  },
];

const BuoiTuVan = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredLecturers = lecturers
    .filter((l) => {
      const keyword = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(keyword) ||
        l.topic.toLowerCase().includes(keyword) ||
        l.course.toLowerCase().includes(keyword)
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
            Buổi tư vấn cho sinh viên
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem danh sách buổi tư vấn theo giảng viên và đăng ký / huỷ đăng ký
            buổi phù hợp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
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
            <option value="name">Sắp xếp theo tên</option>
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

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLecturers.map((lecturer) => (
          <div
            key={lecturer.id}
            className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col h-full"
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                {lecturer.name}
              </h3>
              <p className="text-sm text-slate-500">{lecturer.topic}</p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {lecturer.course}
              </p>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              {lecturer.slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div>
                    <div className="font-medium text-slate-800">
                      {slot.label}
                    </div>
                    <div className="text-xs text-slate-500">
                      SV đã đăng ký: {slot.registeredCount}
                    </div>
                  </div>
                  <SessionToggleButton />
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredLecturers.length === 0 && (
          <div className="col-span-full text-center text-sm text-slate-500 py-10">
            Không tìm thấy buổi tư vấn phù hợp từ từ khóa “{search}”.
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

const SessionToggleButton = () => {
  const [registered, setRegistered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setRegistered((v) => !v)}
      className={`px-3 py-1 rounded-full text-xs font-medium text-white transition
        ${
          registered
            ? "bg-red-500 hover:bg-red-600"
            : "bg-cyan-600 hover:bg-cyan-700"
        }`}
    >
      {registered ? "Huỷ đăng ký" : "Đăng ký"}
    </button>
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
