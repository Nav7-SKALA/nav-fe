import React, { useState } from 'react';
import styled from 'styled-components';

const ExperienceForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('6');

  const experiencedAt = `${year}-${month.toString().padStart(2, '0')}`;

  const handleSubmit = () => {
    const experienceData = {
      experienceName: title,
      experienceDescribe: description,
      experiencedAt: experiencedAt,
    };
    onSubmit(experienceData);
  };

  const isFormValid = title.trim() !== '' && description.trim() !== '';

  return (
    <FormContainer>
      <Row>
        <InputWrapper>
          <Label>경험 명</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </InputWrapper>
        <InputWrapper>
          <Label>수행일자</Label>
          <DateRow>
            <YearInput type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            <InlineText>년</InlineText>
            <MonthInput type="number" value={month} min={1} max={12} onChange={(e) => setMonth(e.target.value)} />
            <InlineText>월</InlineText>
          </DateRow>
        </InputWrapper>
      </Row>

      <InputWrapper>
        <Label>설명</Label>
        <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
      </InputWrapper>

      <SubmitButton onClick={handleSubmit} disabled={!isFormValid}>
        저장하기
      </SubmitButton>
    </FormContainer>
  );
};

export default ExperienceForm;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
`;

const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  font-size: 1rem;
  color: #606060;
`;

const TextArea = styled.textarea`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  font-size: 0.8rem;
  color: #606060;
  resize: none;
  min-height: 80px;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #ff8b8b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ff6f6f;
  }
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const InlineText = styled.span`
  font-size: 0.875rem;
  color: #606060;
`;

const YearInput = styled(Input)`
  width: 60px;
  min-width: 50px;
`;

const MonthInput = styled(Input)`
  width: 40px;
  min-width: 40px;
`;
