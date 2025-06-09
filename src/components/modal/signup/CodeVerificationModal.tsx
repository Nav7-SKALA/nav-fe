import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { NaviLogo } from '../../../assets/common'
import { duplicate_code } from '../../../api/signup';

interface Props {
  onClose: () => void;
  email: string;
  onSuccess: () => void;
}

const CodeVerificationModal: React.FC<Props> = ({ email, onSuccess, onClose }) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);


  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // 숫자만 허용
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const finalCode = code.join('');
    try{
      if (finalCode.length === 6) {
        const response = await duplicate_code(email,finalCode);
        if (response.success) {
          alert('이메일 인증이 완료되었습니다.');
          onSuccess();
        } else {
          setError('인증 코드가 올바르지 않습니다.');
        }
      } else {
        alert('6자리 코드를 입력해주세요.');
      }
    }
    catch{
      setError('인증 중 오류가 발생했습니다.');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <NaviLogo/>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Title>코드 입력</Title>
        <SubText>입력하신 이메일로 발송된 6자리 숫자 코드를 입력하세요.</SubText>

        <InputGroup>
          {code.map((digit, i) => (
            <CodeInput
              key={i}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              
              autoFocus={i === 0}
            />
          ))}
        </InputGroup>

        <SubmitButton onClick={handleSubmit}>제출하기</SubmitButton>
      </ModalContainer>
    </Overlay>
  );
};

export default CodeVerificationModal;

// 스타일링
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  width: 400px;
  text-align: left;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 30px;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const Title = styled.h2`
  align-self: flex-start;
  margin-top: 16px;
  margin-bottom: 4px;
  font-size: 16px;
  color: black;
  font-weight: 900;
`;

const SubText = styled.p`
  align-self: flex-start;
  font-size: 14px;
  margin-bottom: 24px;
  color: #666;
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const CodeInput = styled.input`
  width: 44px;
  height: 50px;
  font-size: 24px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.8rem;
  background-color: #ff8b8b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  &:hover {
    background-color: #ff6b6b;
  }
  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px rgba(255, 0, 0, 0.5);
  }
`;
