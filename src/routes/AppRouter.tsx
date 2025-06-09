import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import MainPage from '../pages/MainPage';
import IntroPage from '../pages/IntroPage';
import LoginPage from '../pages/LoginPage';
import MyPage from '../pages/MyPage';
import RegisterPage from '../pages/RegisterPage';
import ChatPage from '../pages/ChatPage';
import RoleModelChatPage from '../pages/RoleModelChatPage';
import RoleModelPage from '../pages/RoleModelPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/main/*" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />
        <Route path="/rolemodel/*" element={<RoleModelPage />} />
        <Route path="/rolemodelchat/*" element={<RoleModelChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
