import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { NaviLogo } from '../assets/common';
import { FaPowerOff } from 'react-icons/fa';
import { FiSidebar, FiEdit } from 'react-icons/fi';

type Header1Props = {
  type?: 'default' | 'simple';
  username: string;
};

const Header = ({ type = 'default', username }: Header1Props) => {
  const navigate = useNavigate();

  const handleClickHomeBtn = () => {
    alert('홈으로 이동합니다.');
    // navigate('/');
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
              <FiSidebar size={30} />
            </IconBtn>
            <IconBtn>
              <FiEdit size={30} />
            </IconBtn>
          </>
        )}
        <HomeBtn onClick={handleClickHomeBtn}>
          <NaviLogo />
        </HomeBtn>
      </LeftSection>
      <NavItems>
        <UserName>{username} 님</UserName>

        <ExitBtn onClick={handleLogoutBtn}>
          <FaPowerOff size={30} color="#FF8B8B" />
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
  padding: 1rem 3rem;
  box-sizing: border-box;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0rem;
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
`;

const HomeBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 7rem;
`;
const NavItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
const UserName = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
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
