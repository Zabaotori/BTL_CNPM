import axios from "axios";
import React, { useEffect, useState } from "react";
import { data, NavLink } from "react-router-dom";

const DanhSachGiangVien = () => {
  const [listTutors, setListTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const getAllTutors = async() => {
    try {
      let res = await axios({
        url: `http://localhost:8080/student/tutors`,
        method: 'GET',
      })
      console.log("data",res.data);
      setListTutors(res.data);
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(()=> {
    getAllTutors();
  }, []);

  const filteredLecturers = listTutors
    .filter((l) => {
      const keyword = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(keyword) ||
        l.department.toLowerCase().includes(keyword) 
        // l.course.toLowerCase().includes(keyword)
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      // if (sortBy === "course") return a.course.localeCompare(b.course);
      return 0;
    });

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Danh sách giảng viên
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem thông tin giảng viên và các môn học, hỗ trợ tìm buổi tư vấn phù
            hợp.
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
            <option value="name">Sắp xếp theo tên</option>
            {/* <option value="course">Sắp xếp theo môn học</option> */}
          </select>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLecturers.map((lec) => (
          <article
            key={lec.id}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-sm font-semibold text-cyan-700">
                {lec.name.split(" ").pop()?.[0] || "G"}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  {lec.name}
                </h2>
                <div className="text-xs text-slate-500">{lec.department}</div>
              </div>
            </div>

            
            <div className="mt-3 text-xs text-slate-500">
              Education Level:
              <span className="ml-1 font-medium text-slate-800">
                {lec.educationLevel}
              </span>
            </div>

            <div className="mt-3 text-xs text-slate-500">
              Experience years:
              <span className="ml-1 font-medium text-slate-800">
                {lec.experienceYears}
              </span>
            </div>


            <div className="mt-4 flex justify-end">
              <NavLink
                to="/student/buoituvan"
                className="inline-flex items-center rounded-full border border-cyan-600 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-50"
              >
                Xem buổi tư vấn
              </NavLink>
            </div>
          </article>
        ))}

        {filteredLecturers.length === 0 && (
          <div className="col-span-full text-center text-sm text-slate-500 py-10">
            Không tìm thấy giảng viên phù hợp với từ khóa “{search}”.
          </div>
        )}
      </section>
    </div>
  );
};

export default DanhSachGiangVien;
