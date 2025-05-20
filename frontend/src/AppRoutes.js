// src/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// صفحات المصادقة
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import RegisterPro from './pages/Auth/RegisterPro';

// الصفحات الرئيسية
import Home from './pages/Main/Home';
import Search from './pages/Main/Search';
import Profile from './pages/Main/Profile';

// صفحات المهنيين
import Dashboard from './pages/Professional/Dashboard';
import Services from './pages/Professional/Services';
import ProfessionalsPage from './pages/Professional/ProfessionalsPage';

// صفحات إضافية
import NotFoundPage from './pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* الصفحات العامة */}
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/profile" element={<Profile />} />

      {/* صفحات المصادقة */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-pro" element={<RegisterPro />} />

      {/* صفحات المهنيين */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/services" element={<Services />} />
      <Route path="/professionals" element={<ProfessionalsPage />} />

      {/* صفحة غير موجودة */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
