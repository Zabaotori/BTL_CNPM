import { useState } from "react";
import Footer from "../Footer/Footer";

import React from 'react'

const BuoiTuVan = () => {
    return (
        <div>    <div className="container mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <input type="text" placeholder="Tìm kiếm" className="px-4 py-2 border rounded-lg w-full md:w-1/3" />
                <select className="px-4 py-2 border rounded-lg w-full md:w-1/4">
                    <option>Sắp xếp theo tên</option>
                    <option>Sắp xếp theo ngày</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map(id => (
                    <div key={id} className="bg-white shadow-md p-6 rounded-lg border">
                        <h3 className="text-xl font-semibold">Giảng viên A</h3>
                        <p className="text-gray-500">Bổ túc Nguyên lý ngôn ngữ lập trình</p>
                        <p className="mt-3 font-medium">Nguyên lý ngôn ngữ lập trình</p>

                        <div className="mt-4 space-y-3">
                            {["T3, 7h - 9h", "T4, 7h - 9h", "T6, 7h - 9h"].map(t => (
                                <div key={t} className="flex justify-between">
                                    <span>{t}</span>
                                    <ToggleButton />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <Footer></Footer>
        </div>
    )
}

export default BuoiTuVan

function ToggleButton() {
    const [registered, setRegistered] = useState(false);

    return (
        <button
            onClick={() => setRegistered(!registered)}
            className={`px-3 py-1 rounded text-white ${registered ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
        >
            {registered ? "Huỷ đăng ký" : "Đăng ký"}
        </button>
    );
}
