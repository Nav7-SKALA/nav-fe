import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const InputModal = ({ title, onClose, children }: ModalProps) => {
  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalContent>{children}</ModalContent>
      </ModalContainer>
    </Overlay>
  );
};

export default InputModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 1.5rem;
  padding: 2rem 3rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
`;

const CloseButton = styled.button`
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
