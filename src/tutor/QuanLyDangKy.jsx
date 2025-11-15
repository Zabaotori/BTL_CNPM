import React from "react";

const registeredStudents = [
  {
    id: 1,
    studentId: "2012345",
    name: "Nguyễn Văn A",
    session: "Bổ túc PPL A",
    time: "T3, 7h - 9h",
  },
  {
    id: 2,
    studentId: "2012567",
    name: "Trần Thị B",
    session: "Bổ túc PPL A",
    time: "T3, 7h - 9h",
  },
  {
    id: 3,
    studentId: "2012789",
    name: "Lê Văn C",
    session: "Tư vấn học kỳ 241",
    time: "T6, 9h - 11h",
  },
];

const QuanLyDangKy = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-800">
          Quản lý sinh viên đăng ký
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Danh sách sinh viên đã đăng ký tham gia các buổi tư vấn của bạn.
        </p>
      </header>

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">MSSV</th>
              <th className="px-4 py-3">Họ và tên</th>
              <th className="px-4 py-3">Buổi tư vấn</th>
              <th className="px-4 py-3">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {registeredStudents.map((st) => (
              <tr
                key={st.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-slate-700">{st.studentId}</td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {st.name}
                </td>
                <td className="px-4 py-3 text-slate-700">{st.session}</td>
                <td className="px-4 py-3 text-slate-700">{st.time}</td>
              </tr>
            ))}
            {registeredStudents.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Chưa có sinh viên nào đăng ký.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default QuanLyDangKy;
