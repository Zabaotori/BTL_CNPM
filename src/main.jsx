import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// Auth
import RequireAuth from "./components/RequireAuth";
import Login from "./components/Login";

// Student
import StuHeader from "./student/StuHeader";
import StuDashboard from "./student/StuDashboard";
import BuoiTuVan from "./student/BuoiTuVan";
import LichCuaToi from "./student/LichCuaToi";
import DanhSachGiangVien from "./student/DanhSachGiangVien";

// Tutor
import TutorHeader from "./tutor/TutorHeader";
import TutorDashboard from "./tutor/TutorDashboard";
import BuoiTuVanGV from "./tutor/BuoiTuVanGV";
import LichCuaToiGV from "./tutor/LichCuaToiGV";
import QuanLyDangKy from "./tutor/QuanLyDangKy";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* Trang login */}
        <Route path="/login" element={<Login />} />

        {/* Mở trang web → luôn đưa về login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ================= STUDENT ================= */}
        <Route
          path="/student"
          element={
            // <RequireAuth role="student">
              <StuHeader />
            // </RequireAuth>
          }
        >
          <Route index element={<StuDashboard />} />
          <Route path="buoituvan" element={<BuoiTuVan />} />
          <Route path="lichcuatoi" element={<LichCuaToi />} />
          <Route path="giangvien" element={<DanhSachGiangVien />} />
        </Route>

        {/* ================= TUTOR ================= */}
        <Route
          path="/tutor"
          element={
            // <RequireAuth role="tutor">
              <TutorHeader />
            // </RequireAuth>
          }
        >
          <Route index element={<TutorDashboard />} />
          <Route path="buoituvan" element={<BuoiTuVanGV />} />
          <Route path="lichcuatoi" element={<LichCuaToiGV />} />
          <Route path="quanly" element={<QuanLyDangKy />} />
        </Route>

        {/* Nếu route không tồn tại → trở về /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
