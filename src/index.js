import React from 'react';
import ReactDOM from 'react-dom/client';

//Router設定
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

//引入分頁
import App from './App';
import Home from './pages/Home/Home';
import Training from './pages/Training/Training';
import Calender from './pages/Calender/Calender';
import Statistics from './pages/Statistics/Statistics';
import Map from './pages/Map/Map';
import Animal from './pages/Animal/Animal';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="training" element={<Training />} />
        <Route path="calender" element={<Calender />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="map" element={<Map />} />
        <Route path="animal" element={<Animal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
