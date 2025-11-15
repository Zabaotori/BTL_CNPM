// src/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const predefinedUsers = [
  {
    email: "student@hcmut.edu.vn",
    password: "123456",
    role: "student",
  },
  {
    email: "tutor@hcmut.edu.vn",
    password: "123456",
    role: "tutor",
  },
];

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const user = predefinedUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Sai email hoặc mật khẩu!");
      return;
    }

    // Lưu role vào localStorage
    localStorage.setItem("role", user.role);

    // Điều hướng theo role
    if (user.role === "student") {
      navigate("/student");
    } else {
      navigate("/tutor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-xl font-semibold text-center mb-6">
          Đăng nhập hệ thống tư vấn
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
          >
            Đăng nhập
          </button>
        </form>

        {/* Tài khoản mẫu */}
        <div className="mt-6 text-xs text-slate-500 border-t pt-4">
          <p className="font-semibold mb-1">Tài khoản mẫu:</p>
          <p>👨‍🎓 Sinh viên → student@hcmut.edu.vn / 123456</p>
          <p>👨‍🏫 Giảng viên → tutor@hcmut.edu.vn / 123456</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
