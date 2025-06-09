import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiSidebar, FiEdit, FiMoreHorizontal } from 'react-icons/fi';
import { ChatSession } from '../../types/session';
import { useSessionStore } from '../../store/useSessionStore';

interface NavbarProps {
  sessions: ChatSession[];
  onDeleteSession: (sessionId: string) => void;
  onNewChat: () => void;
  onToggleSidebar: () => void;
}

// Styled Components
const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #ffe1e1;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
`;

const NavbarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 0.5px solid #5f6368;
  background-color: #ffe1e1;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ffd1d1;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #5f6368;
  }
`;

const SessionList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.6rem;
`;

const SessionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;

  &:hover {
    background-color: #ffd1d1;
  }
`;

const SessionTitle = styled.span`
  font-size: 14px;
  color: #606060; //#3c4043;
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 4px;
`;

const MoreButton = styled(IconButton)`
  opacity: 0;
  transition: opacity 0.2s ease;

  ${SessionItem}:hover & {
    opacity: 1;
  }
`;

const DropdownMenu = styled.div<{ show: boolean }>`
  position: absolute;
  right: 8px;
  top: 100%;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 120px;
  display: ${(props) => (props.show ? 'block' : 'none')};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #dc3545;

  &:hover {
    background-color: #f8f9fa;
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

const Navbar = ({ sessions, onDeleteSession, onNewChat, onToggleSidebar }: NavbarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const fetchNextSessions = useSessionStore((state) => state.fetchNextSessions);
  const hasNext = useSessionStore((state) => state.hasNext);
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  const isLoading = useSessionStore((state) => state.isLoading);
  const isInitialized = useSessionStore((state) => state.isInitialized);

  const lastSessionRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!hasNext || isLoading || !node || !isInitialized) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNextSessions();
        }
      });

      observer.current.observe(node);
    },
    [hasNext, isLoading, fetchNextSessions, isInitialized]
  );

  const handleMoreClick = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === sessionId ? null : sessionId);
  };

  const handleDeleteClick = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onDeleteSession(sessionId);
    setActiveDropdown(null);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  const handleSessionClick = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
  };

  // 외부 클릭 감지를 위한 이벤트 리스너
  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <SidebarContainer>
      <NavbarHeader>
        <IconButton onClick={onToggleSidebar} title="사이드바 토글">
          <FiSidebar />
        </IconButton>
        <IconButton onClick={onNewChat} title="새 채팅">
          <FiEdit />
        </IconButton>
      </NavbarHeader>

      <SessionList>
        {Array.isArray(sessions) &&
          sessions.map((session, idx) => {
            const isLast = idx === sessions.length - 1;
            return (
              <SessionItem
                key={session.sessionId}
                ref={isLast ? lastSessionRef : null}
                onClick={() => handleSessionClick(session.sessionId)}
              >
                <SessionTitle>{session.sessionTitle}</SessionTitle>
                <MoreButton onClick={(e) => handleMoreClick(session.sessionId, e)} title="더보기">
                  <FiMoreHorizontal />
                </MoreButton>

                <DropdownMenu show={activeDropdown === session.sessionId}>
                  <DropdownItem onClick={(e) => handleDeleteClick(session.sessionId, e)}>삭제</DropdownItem>
                </DropdownMenu>
              </SessionItem>
            );
          })}
      </SessionList>
    </SidebarContainer>
  );
};

export default Navbar;
