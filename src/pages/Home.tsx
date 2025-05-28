import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>🚀 페이지 목록</h1>
      <ul>
        <li>
          <Link to="/">홈페이지</Link>
        </li>
        <li>
          <Link to="/intro">Intro 페이지</Link>
        </li>
        <li>
          <Link to="/login/*">로그인 페이지</Link>
        </li>
        <li>
          <Link to="/register">회원가입 페이지</Link>
        </li>
        <li>
          <Link to="/main/*">메인 페이지</Link>
        </li>
        <li>
          <Link to="/mypage">마이 페이지</Link>
        </li>
        <li>
          <Link to="/chat">채팅 페이지</Link>
        </li>
        <li>
          <Link to="/rolemodel/*">롤모델 상세 페이지</Link>
        </li>
        <li>
          <Link to="/rolemodelchat/*">롤모델 채팅 페이지</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
