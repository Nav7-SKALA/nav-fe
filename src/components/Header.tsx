import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { NaviLogo } from '../assets/common';
import { FaPowerOff } from 'react-icons/fa';
import { FiSidebar, FiEdit } from 'react-icons/fi';
import { AiOutlineUser } from 'react-icons/ai';

type HeaderProps = {
  type?: 'default' | 'simple';
  username: string;
};

const Header = ({ type = 'default', username }: HeaderProps) => {
  const navigate = useNavigate();

  const handleClickHomeBtn = () => {
    navigate('/main/*');
  };

  const handleLogoutBtn = () => {
    alert('로그아웃 되었습니다.');
    // navigate('/login');
  };

  return (
    <NavSection>
      <LeftSection>
        {type === 'default' && (
          <>
            <IconBtn>
              <FiSidebar size={28} />
            </IconBtn>
            <IconBtn>
              <FiEdit size={28} />
            </IconBtn>
          </>
        )}
        <HomeBtn onClick={handleClickHomeBtn}>
          <NaviLogo />
        </HomeBtn>
      </LeftSection>
      <NavItems>
        <UserName>{username} 님</UserName>
        <IconBtn>
          <AiOutlineUser size={28} />
        </IconBtn>
        <ExitBtn onClick={handleLogoutBtn}>
          <FaPowerOff size={24} color="#FF8B8B" />
        </ExitBtn>
      </NavItems>
    </NavSection>
  );
};

export default Header;

const NavSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 1rem;
  box-sizing: border-box;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  //gap: 0.5rem; /* 간격 추가 */
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const HomeBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 3.5rem;
  //margin-left: 0.5rem;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const UserName = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0; /* 기본 마진 제거 */
`;

const ExitBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: #fff;
  border-radius: 100%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &:active {
    background-color: #e0e0e0;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;
