import React, { useState } from 'react';
import styled from 'styled-components';
import CustomSelect, { OptionType } from '../../common/CustomSelect';
import { ProjectFormDto } from '../../../types/project';

interface ProjectFormProps {
  onSubmit: (data: ProjectFormDto) => void;
  roleOptions: OptionType[];
  skillOptions: OptionType[];
  domainOptions: OptionType[];
}
const ProjectForm = ({ onSubmit, roleOptions, skillOptions, domainOptions }: ProjectFormProps) => {
  const [title, setTitle] = useState('');
  const [scale, setScale] = useState<OptionType | null>(null);
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [roles, setRoles] = useState<OptionType[]>([]);
  const [skills, setSkills] = useState<OptionType[]>([]);
  const [domain, setDomain] = useState<OptionType | null>(null);
  const [isImportant, setIsImportant] = useState(false);
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    const projectData: ProjectFormDto = {
      domainId: domain?.value ?? null,
      projectName: title,
      projectDescribe: description,
      startYear: Number(startYear),
      endYear: Number(endYear),
      projectSize: scale?.value ?? null,
      role: roles.map((r) => r.value),
      skillSetIds: skills.map((s) => s.value),
      isTurningPoint: isImportant,
    };
    onSubmit(projectData);
  };

  const projectSizeOptions: OptionType[] = [
    { value: 'NULL', label: '없음' },
    { value: 'SMALL', label: '소' },
    { value: 'MEDIUM_SMALL', label: '중소' },
    { value: 'MEDIUM', label: '중' },
    { value: 'LARGE', label: '대' },
    { value: 'EXTRA_LARGE', label: '특대' },
  ];

  const removeRole = (value: string | number) => {
    setRoles((prev) => prev.filter((r) => r.value !== value));
  };

  const removeSkill = (value: string | number) => {
    setSkills((prev) => prev.filter((s) => s.value !== value));
  };

  // 숫자만 허용하는 공통 함수
  const handleNumberInput = (value: string) => {
    // 숫자가 아닌 모든 문자 제거 (한글, 기호, 알파벳 등)
    return value.replace(/[^0-9]/g, '');
  };

  const handleStartYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = handleNumberInput(e.target.value);

    setStartYear(onlyDigits);

    if (onlyDigits !== '' && endYear !== '' && Number(onlyDigits) > Number(endYear)) {
      setEndYear(onlyDigits);
    }
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = handleNumberInput(e.target.value);

    setEndYear(onlyDigits);

    if (startYear !== '' && onlyDigits !== '' && Number(onlyDigits) < Number(startYear)) {
      setStartYear(onlyDigits);
    }
  };

  const isFormValid =
    title.trim() !== '' &&
    scale !== null &&
    domain !== null &&
    startYear !== '' &&
    endYear !== '' &&
    roles.length > 0 &&
    skills.length > 0;

  return (
    <FormContainer>
      <Row>
        <InputWrapper>
          <Label>프로젝트 명</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </InputWrapper>
        <InputWrapper>
          <Label>프로젝트 규모</Label>
          <CustomSelect options={projectSizeOptions} value={scale} onChange={setScale} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <Label>시작연차</Label>
          <NumberInput type="number" value={startYear} onChange={handleStartYearChange} />
        </InputWrapper>
        <InputWrapper>
          <Label>종료연차</Label>
          <NumberInput type="number" value={endYear} onChange={handleEndYearChange} />
        </InputWrapper>
      </Row>

      <InputWrapper>
        <Label>수행 역할</Label>
        <CustomSelect
          options={roleOptions.filter((opt) => !roles.find((r) => r.value === opt.value))}
          value={null}
          onChange={(v) => {
            if (roles.length >= 3) {
              return;
            }
            setRoles([...roles, v]);
          }}
          placeholder="최대 3개까지 선택 가능합니다"
        />
        <SelectedList>
          {roles.map((r, i) => (
            <Tag key={i} onClick={() => removeRole(r.value)}>
              {r.label}
            </Tag>
          ))}
        </SelectedList>
      </InputWrapper>

      <InputWrapper>
        <Label>Skill Set</Label>
        <CustomSelect
          options={skillOptions.filter((opt) => !skills.find((s) => s.value === opt.value))}
          value={null}
          onChange={(v) => {
            if (skills.length >= 4) {
              return;
            }
            setSkills([...skills, v]);
          }}
          placeholder="최대 4개까지 선택 가능합니다"
        />
        <SelectedList>
          {skills.map((s, i) => (
            <Tag key={i} onClick={() => removeSkill(s.value)}>
              {s.label}
            </Tag>
          ))}
        </SelectedList>
      </InputWrapper>

      <InputWrapper>
        <Label>Domain</Label>
        <CustomSelect options={domainOptions} value={domain} onChange={setDomain} />
      </InputWrapper>

      <CheckboxWrapper>
        <Label>해당 프로젝트가 커리어 형성에 큰 영향을 주었나요?</Label>
        <input type="checkbox" checked={isImportant} onChange={(e) => setIsImportant(e.target.checked)} />
      </CheckboxWrapper>

      <InputWrapper>
        <Label>프로젝트 설명</Label>
        <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
      </InputWrapper>

      <SubmitButton onClick={handleSubmit} disabled={!isFormValid}>
        저장하기
      </SubmitButton>
    </FormContainer>
  );
};

export default ProjectForm;

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

const NumberInput = styled(Input).attrs({ type: 'number' })``;

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

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #333;
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

const SelectedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background-color: #ffe1e1;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #000000 !important;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ffd3d3;
  }
`;
