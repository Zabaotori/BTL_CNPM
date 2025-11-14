import React from 'react'
import Footer from '../Footer/Footer'

const StuDashboard = () => {
  return (
    <div>
      {/* ---------------------------- */}
      <div className="relative w-full h-[600px]">
        <div className=" opacity-100 transition-opacity duration-700">
          <img src="/img/bgMain.jpg" className="w-full h-full object-cover" />
          <div className="absolute top-20 left-10 bg-black/50 text-white p-10 rounded-lg w-[40%]">
            <h1 className="text-5xl font-semibold mb-5 leading-tight">
              Thư viện, tài liệu học tập<br />(HCMUT_LIBRARY)
            </h1>
            <button className="px-6 cursor-pointer py-3 bg-blue-500 rounded text-lg hover:bg-blue-600">
              Xem (View)
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------- */}
      <Footer></Footer>
    </div>
  )
}

export default StuDashboard