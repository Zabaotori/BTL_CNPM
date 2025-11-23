import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Clock,
  Users,
  Calendar,
  MapPin,
  Laptop,
  Edit3,
  Trash2,
  Search,
  Circle,
  SquarePen
} from 'lucide-react';

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
  const [sessions, setSessions] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const userId = localStorage.getItem('userId');
  const getAllMySessions = async () => {
    try {
      let res = await axios({
        url: `http://localhost:8080/tutor/${userId}/available-sessions`,
        method: "GET"
      })
      console.log("dataSessions", res.data);
      setSessions(res.data);
    }
    catch (err) {
      console.log(err);
    }
  }

  const deleteSession = async (id) => {
    try {
      let res = await axios({
        url: `http://localhost:8080/tutor/available-sessions/${id}`,
        method: "DELETE"
      });
      await getAllMySessions();
      setConfirmDelete(null);
    }
    catch (err) {
      console.log(err);
    }
  }

  const openSession = async (id) => {
    try {
      let res = await axios({
        url: `http://localhost:8080/tutor/available-sessions/${id}/open`,
        method: 'PATCH'
      });
      await getAllMySessions();
    }
    catch (err) {
      console.log(err);
    }
  }

  const filteredSessions = sessions
    .filter((s) => {
      const keyword = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(keyword) ||
        s.date.toLowerCase().includes(keyword) ||
        s.description.toLowerCase().includes(keyword)
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date") {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA - dateB;
      }
      return 0;
    });


  useEffect(() => {
    getAllMySessions();
  }, []);

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
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sắp xếp theo tên buổi</option>
            <option value="date">Sắp xếp theo ngày</option>
          </select>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center cursor-pointer rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700"
          >
            Tạo buổi tư vấn
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((s) => (
          <article
            key={s.id}
            className="bg-white border border-slate-300 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col"
          >
            <div className="flex-1">
              {/* Header với tên và trạng thái */}
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-bold text-slate-800 pr-2">
                  {s.name}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border
              ${s.open
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                >
                  <Circle
                    size={8}
                    fill={s.open ? "#10b981" : "#f59e0b"}
                    color={s.open ? "#10b981" : "#f59e0b"}
                  />
                  {s.open ? "Đang mở" : "Chưa mở"}
                </span>
              </div>

              {/* Mô tả */}
              <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                {s.description || "Không có mô tả"}
              </p>

              {/* Thông tin chi tiết */}
              <div className="space-y-3">
                {/* Hình thức & Thời lượng */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    {s.type === "online" ?
                      <Laptop size={16} className="text-blue-500" /> :
                      <MapPin size={16} className="text-green-500" />
                    }
                    Hình thức:
                  </span>
                  <span className="font-medium text-slate-700 capitalize">
                    {s.type === "online" ? "Online" : "Offline"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Clock size={16} className="text-purple-500" />
                    Thời lượng:
                  </span>
                  <span className="font-medium text-slate-700">
                    {s.duration} phút
                  </span>
                </div>

                {/* Số học sinh */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Users size={16} className="text-orange-500" />
                    Số học sinh:
                  </span>
                  <span className="font-medium text-slate-700">
                    {s.minStudents}-{s.maxStudents}
                  </span>
                </div>

                {/* Ngày & giờ */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span className="flex items-center gap-2">
                      <Calendar size={16} className="text-red-500" />
                      Ngày:
                    </span>
                    <span className="font-medium">
                      {s.date
                        ? new Date(s.date).toLocaleDateString("vi-VN")
                        : "Chưa đặt lịch"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span className="flex items-center gap-2">
                      <Clock size={16} className="text-cyan-500" />
                      Thời gian:
                    </span>
                    <span className="font-medium">
                      {s.startTime?.slice(0, 5)} - {s.endTime?.slice(0, 5)}
                    </span>
                  </div>
                </div>

                {/* Slot count */}
                {s.slots && (
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <SquarePen size={16} className="text-indigo-500" />
                      Số ca:
                    </span>
                    <span className="font-medium text-slate-700">
                      {s.slots.length} ca
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between gap-2">
              {!s.open && (
                <button
                  type="button"
                  onClick={() => openSession(s.id)}
                  className="flex-1 rounded-lg border border-slate-300 cursor-pointer bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} />
                  Mở đăng ký
                </button>
              )}
              <button
                type="button"
                onClick={() => setConfirmDelete(s)}
                className="flex-1 rounded-lg border border-red-300 cursor-pointer bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Xoá
              </button>
            </div>
          </article>
        ))}

        {/* Not found */}
        {filteredSessions.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Search size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500 mb-2">
              Không có buổi tư vấn nào phù hợp với từ khóa
            </p>
            <p className="text-sm text-slate-400">"{search}"</p>
          </div>
        )}
      </section>


      <CreateSessionModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        refresh={getAllMySessions}
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
        onConfirm={() => deleteSession(confirmDelete.id)}
      />
    </div>
  );
};

const CreateSessionModal = ({ open, onClose, refresh }) => {
  if (!open) return null;

  const userId = localStorage.getItem("userId");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("offline");
  const [minStu, setMinStu] = useState(1);
  const [maxStu, setMaxStu] = useState(1);
  const [duration, setDuration] = useState(60);
  const [slots, setSlots] = useState([
    { date: "", startTime: "", endTime: "" },
  ]);

  // State for errors
  const [errors, setErrors] = useState({});

  const addSlot = () => {
    setSlots([...slots, { date: "", startTime: "", endTime: "" }]);
  };

  const updateSlot = (index, field, value) => {
    const copy = [...slots];
    copy[index][field] = value;
    setSlots(copy);

    // Clear slot errors when user starts typing
    if (errors.slots && errors.slots[index]) {
      const newErrors = { ...errors };
      delete newErrors.slots[index];
      if (Object.keys(newErrors.slots).length === 0) {
        delete newErrors.slots;
      }
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Tên buổi tư vấn là bắt buộc";
    }

    // Validate description
    if (!description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    // Validate min and max students
    if (!minStu || minStu < 1) {
      newErrors.minStu = "Số học sinh tối thiểu phải lớn hơn 0";
    }

    if (!maxStu || maxStu < 1) {
      newErrors.maxStu = "Số học sinh tối đa phải lớn hơn 0";
    }

    if (minStu > maxStu) {
      newErrors.maxStu = "Số học sinh tối đa phải lớn hơn hoặc bằng số học sinh tối thiểu";
    }

    // Validate duration
    if (!duration || duration < 1) {
      newErrors.duration = "Thời lượng phải lớn hơn 0";
    }

    // Validate slots
    const slotErrors = {};
    slots.forEach((slot, index) => {
      const slotError = {};

      if (!slot.date) {
        slotError.date = "Ngày là bắt buộc";
      }

      if (!slot.startTime) {
        slotError.startTime = "Thời gian bắt đầu là bắt buộc";
      }

      if (!slot.endTime) {
        slotError.endTime = "Thời gian kết thúc là bắt buộc";
      }

      if (slot.startTime && slot.endTime && slot.startTime >= slot.endTime) {
        slotError.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu";
      }

      if (Object.keys(slotError).length > 0) {
        slotErrors[index] = slotError;
      }
    });

    if (Object.keys(slotErrors).length > 0) {
      newErrors.slots = slotErrors;
    }

    if (slots.length === 0) {
      newErrors.slots = "Ít nhất một ca tư vấn là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      tutorId: Number(userId),
      name: name,
      description: description,
      type: type,
      minStudents: minStu,
      maxStudents: maxStu,
      duration: duration,
      slots: slots,
    };

    try {
      await axios.post(
        "http://localhost:8080/tutor/available-sessions/create",
        payload
      );
      onClose();
      refresh();
    } catch (err) {
      console.error(err);
      alert("Lỗi tạo buổi tư vấn!");
    }
  };

  // Helper function to get error message for a field
  const getError = (field, index = null) => {
    if (index !== null && errors.slots && errors.slots[index]) {
      return errors.slots[index][field];
    }
    return errors[field];
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Tạo buổi tư vấn mới
        </h2>

        <form className="space-y-4 text-sm" onSubmit={(e) => e.preventDefault()}>
          {/* Name field */}
          <div>
            <label className="block text-slate-700 text-sm font-medium">
              Tên buổi tư vấn *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${errors.name ? "border-red-500" : "border-slate-400"
                }`}
              placeholder="Ví dụ: Bổ túc PPL A"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description field */}
          <div>
            <label className="block text-slate-700 text-sm font-medium">
              Mô tả *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${errors.description ? "border-red-500" : "border-slate-400"
                }`}
              placeholder="Nội dung buổi tư vấn..."
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Type selection */}
          <div>
            <label className="block text-slate-700 text-sm font-medium">
              Hình thức *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2 text-sm"
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-slate-700 text-sm font-medium">
              Thời lượng (phút) *
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => {
                setDuration(Number(e.target.value));
                if (errors.duration) setErrors({ ...errors, duration: "" });
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${errors.duration ? "border-red-500" : "border-slate-400"
                }`}
              placeholder="Nhập thời lượng mỗi buổi"
            />
            {errors.duration && (
              <p className="mt-1 text-xs text-red-500">{errors.duration}</p>
            )}
          </div>

          {/* Min and Max Students */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 text-sm font-medium">
                Số học sinh tối thiểu *
              </label>
              <input
                type="number"
                min="1"
                value={minStu}
                onChange={(e) => {
                  setMinStu(Number(e.target.value));
                  if (errors.minStu) setErrors({ ...errors, minStu: "" });
                  if (errors.maxStu) setErrors({ ...errors, maxStu: "" });
                }}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${errors.minStu ? "border-red-500" : "border-slate-400"
                  }`}
              />
              {errors.minStu && (
                <p className="mt-1 text-xs text-red-500">{errors.minStu}</p>
              )}
            </div>
            <div>
              <label className="block text-slate-700 text-sm font-medium">
                Số học sinh tối đa *
              </label>
              <input
                type="number"
                min="1"
                value={maxStu}
                onChange={(e) => {
                  setMaxStu(Number(e.target.value));
                  if (errors.maxStu) setErrors({ ...errors, maxStu: "" });
                }}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${errors.maxStu ? "border-red-500" : "border-slate-400"
                  }`}
              />
              {errors.maxStu && (
                <p className="mt-1 text-xs text-red-500">{errors.maxStu}</p>
              )}
            </div>
          </div>

          {/* Slots section */}
          <div>
            <div className="font-medium text-slate-700 mt-4 mb-2">
              Các ca tư vấn (Slots) *
            </div>

            {typeof errors.slots === "string" && (
              <p className="text-xs text-red-500 mb-3">{errors.slots}</p>
            )}

            {slots.map((slot, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 border rounded-lg mb-3 ${errors.slots && errors.slots[index] ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"
                  }`}
              >
                <div>
                  <input
                    type="date"
                    value={slot.date}
                    onChange={(e) => updateSlot(index, "date", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm ${getError("date", index) ? "border-red-500" : "border-slate-400"
                      }`}
                  />
                  {getError("date", index) && (
                    <p className="mt-1 text-xs text-red-500">{getError("date", index)}</p>
                  )}
                </div>

                <div>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateSlot(index, "startTime", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm ${getError("startTime", index) ? "border-red-500" : "border-slate-400"
                      }`}
                  />
                  {getError("startTime", index) && (
                    <p className="mt-1 text-xs text-red-500">{getError("startTime", index)}</p>
                  )}
                </div>

                <div>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateSlot(index, "endTime", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm ${getError("endTime", index) ? "border-red-500" : "border-slate-400"
                      }`}
                  />
                  {getError("endTime", index) && (
                    <p className="mt-1 text-xs text-red-500">{getError("endTime", index)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className="bg-cyan-500 text-white rounded text-center p-2 mt-3 cursor-pointer hover:bg-cyan-600"
            onClick={addSlot}
          >
            + Thêm ca tư vấn
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
              onClick={handleCreate}
              className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-700 disabled:bg-cyan-300 disabled:cursor-not-allowed"
              disabled={Object.keys(errors).length > 0}
            >
              Lưu
            </button>
          </div>
        </form>
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
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuoiTuVanGV;
