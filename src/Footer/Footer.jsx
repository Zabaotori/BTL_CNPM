import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-neutral-800 text-white">
      <div className="px-4 sm:px-8 py-6 leading-relaxed text-sm">
        <h3 className="text-base font-semibold mb-2">
          Tổ kỹ thuật / Technician
        </h3>
        <p>
          Email:{" "}
          <a
            href="mailto:ddthu@hcmut.edu.vn"
            className="underline hover:text-cyan-300"
          >
            ddthu@hcmut.edu.vn
          </a>
        </p>
        <p className="mt-2">
          Quý Thầy/Cô chưa có tài khoản (hoặc quên mật khẩu) nhà trường vui
          lòng liên hệ Trung tâm Dữ liệu &amp; Công nghệ Thông tin, phòng 109
          nhà A5 để được hỗ trợ.
        </p>
        <p className="mt-2">
          Email:{" "}
          <a
            href="mailto:dl-cntt@hcmut.edu.vn"
            className="underline hover:text-cyan-300"
          >
            dl-cntt@hcmut.edu.vn
          </a>
        </p>
        <p className="mt-1">
          ĐT (Tel.): <span className="font-medium">(84-8) 38647256 - 7200</span>
        </p>
      </div>
      <div className="bg-neutral-900 text-center text-xs sm:text-sm py-3">
        Copyright 2007-2023 BKEL - Phát triển dựa trên Moodle
      </div>
    </footer>
  );
};

export default Footer;
