import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import IntroPage from '../pages/IntroPage';
import LoginPage from '../pages/LoginPage';
import MyPage from '../pages/MyPage';
import RegisterPage from '../pages/RegisterPage';
import ChatPage from '../pages/ChatPage';
import RoleModelPage from '../pages/RoleModelPage';
import ProfilePage from '../pages/ProfilePage';
import CareerIntroPage from '../pages/CareerIntroPage';
import AdminPage from '../pages/AdminPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/main/*" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/signup/*" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />
        <Route path="/rolemodel/:rolemodelId" element={<RoleModelPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/careerintro" element={<CareerIntroPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
