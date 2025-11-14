import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { DatePicker } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StuDashboard from './student/StuDashboard';
import StuHeader from './student/stuHeader';
import BuoiTuVan from './student/BuoiTuVan';
import LichCuaToi from './student/LichCuaToi';
import DanhSachGiangVien from './student/DanhSachGiangVien';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<StuHeader></StuHeader>}>
            <Route index element={<StuDashboard></StuDashboard>}></Route>
            <Route path='/buoituvan' element={<BuoiTuVan></BuoiTuVan>}></Route>
            <Route path='/lichcuatoi' element={<LichCuaToi></LichCuaToi>}></Route>
            <Route path='/xemgiangvien' element={<DanhSachGiangVien></DanhSachGiangVien>}></Route>
          </Route>
          <Route ></Route>
        </Routes>
      </BrowserRouter>
    </>
  </StrictMode>,
)
