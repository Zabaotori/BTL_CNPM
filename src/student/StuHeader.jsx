import { Bell, ChevronDown, MessageCircle, MessageSquare } from 'lucide-react'
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const StuHeader = () => {
    return (
        <>
            <header className="w-full bg-cyan-700 text-white px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-5 fs-2">
                    <img src="/img/01_logobachkhoasang.png" className="w-20 " />
                    <NavLink to={"/"} className="cursor-pointer hover:underline">Trang chủ</NavLink>
                    <NavLink to={"/buoituvan"} className="cursor-pointer hover:underline">Buổi tư vấn</NavLink>
                    <NavLink to={"/lichcuatoi"} className="cursor-pointer hover:underline">Lịch của tôi</NavLink>
                    <NavLink to={"/xemgiangvien"} className="cursor-pointer hover:underline">Giảng viên</NavLink>
                </div>
                <div className="flex items-center space-x-4">
                    <button className=" cursor-pointer">
                        <Bell className='w-5'></Bell>
                    </button>
                    <button className="cursor-pointer">
                        <MessageCircle className='w-5'></MessageCircle>
                    </button>
                    <img src="avatar.png" className="w-10 h-10 rounded-full border" />
                </div>
            </header>

            <Outlet></Outlet>
        </>
    )
}

export default StuHeader