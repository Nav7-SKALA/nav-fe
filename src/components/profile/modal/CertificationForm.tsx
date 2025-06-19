import React, { useState } from 'react';
import styled from 'styled-components';
import CustomSelect, { OptionType } from '../../common/CustomSelect';
import { CertificationDto } from '../../../types/certification';

interface CertificationFormProps {
  onSubmit: (data: CertificationDto) => void;
  certiOptions: OptionType[];
}
const CertificationForm = ({ onSubmit, certiOptions }: CertificationFormProps) => {
  const [id, setId] = useState<OptionType | null>(null);
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('6');

  const acquisitedAt = `${year}-${month.toString().padStart(2, '0')}`;

  const handleSubmit = () => {
    const certificationData = {
      certificationId: id?.value,
      acquisitionDate: acquisitedAt,
    };
    onSubmit(certificationData);
  };

  const isFormValid = id !== null;

  return (
    <FormContainer>
      <Row>
        <InputWrapper>
          <Label>자격증 명</Label>
          <CustomSelect options={certiOptions} value={id} onChange={setId} />
        </InputWrapper>
        <InputWrapper>
          <Label>취득일자</Label>
          <DateRow>
            <YearInput type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            <InlineText>년</InlineText>
            <MonthInput type="number" value={month} min={1} max={12} onChange={(e) => setMonth(e.target.value)} />
            <InlineText>월</InlineText>
          </DateRow>
        </InputWrapper>
      </Row>

      <SubmitButton onClick={handleSubmit} disabled={!isFormValid}>
        저장하기
      </SubmitButton>
    </FormContainer>
  );
};

export default CertificationForm;

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
