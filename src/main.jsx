import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { DatePicker } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StuDashboard from './student/StuDashboard';
import StuHeader from './student/stuHeader';
import BuoiTuVan from './student/BuoiTuVan';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<StuHeader></StuHeader>}>
            <Route index element={<StuDashboard></StuDashboard>}></Route>
            <Route path='/buoituvan' element={<BuoiTuVan></BuoiTuVan>}></Route>
          </Route>
          <Route ></Route>
        </Routes>
      </BrowserRouter>
    </>
  </StrictMode>,
)
