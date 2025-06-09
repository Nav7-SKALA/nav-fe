import React from 'react';
import { Link } from 'react-router-dom';
import { login } from '../api/login';

function Home() {
  const handleLoginTest = async () => {
    try {
      const response = await login('testId', 'test1234'); // 테스트용 계정 정보
      console.log('로그인 성공!', response);
      alert(`로그인 성공! 사용자 이름: ${response.username || 'N/A'}`);
    } catch (error: any) {
      console.error('로그인 실패', error);
      alert('로그인 실패: ' + (error.response?.data?.message || error.message));
    }
  };
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
          <Link to="/signup">회원가입 페이지</Link>
        </li>
        <li>
          <Link to="/register">이메일 인증 모달</Link>
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
      <button onClick={handleLoginTest} style={{ marginTop: '20px' }}>
        🔐 로그인 테스트
      </button>
    </div>
  );
}

export default Home;
