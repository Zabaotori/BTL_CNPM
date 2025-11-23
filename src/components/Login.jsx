// src/Login.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginAxios = async (e) => {
  e.preventDefault();
  setError(""); // reset lỗi trước đó

  try {
    let res = await axios.post(
      "http://localhost:8080/auth/login",
      {
        email: email,
        password: password,
      }
    );

    console.log("Login success:", res.data);

    // Lưu thông tin người dùng
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("name", res.data.name);

    // Điều hướng theo role
    if (res.data.role === "student") {
      navigate("/student");
    } else if (res.data.role === "tutor") {
      navigate("/tutor");
    }
  } catch (err) {
    console.log(err);

    // Trường hợp sai mật khẩu / không tìm thấy user
    if (err.response && err.response.status === 400) {
      setError("Email hoặc mật khẩu không đúng!");
    } else {
      setError("Lỗi kết nối server!");
    }
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-xl font-semibold text-center mb-6">
          Đăng nhập hệ thống tư vấn
        </h1>

        <form onSubmit={handleLoginAxios} className="space-y-4">

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
      </div>
    </div>
  );
};

export default Login;
