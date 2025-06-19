import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MaleImg, FemaleImg } from '../../assets/common';
import CustomSelect, { OptionType } from '../common/CustomSelect';
import { useUserStore } from '../../store/useUserStore';
import { fetchProjectSkillSets } from '../../api/project';
import { ProfileFormDto } from '../../types/profile';

interface ProfileSectionProps {
  profileData: ProfileFormDto;
  onChange: React.Dispatch<React.SetStateAction<ProfileFormDto>>;
}
const ProfileSection = ({ profileData, onChange }: ProfileSectionProps) => {
  const [skillSetOptions, setSkillSetOptions] = useState<OptionType[]>([]);
  const { gender } = useUserStore();
  const profileImg = gender === 'FEMALE' ? FemaleImg : MaleImg;

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자만 허용
    onChange({ ...profileData, years: Number(value) });
  };

  const handleRemoveSkill = (value: string | number) => {
    const updated = profileData.skillSetIds.filter((id) => id !== value);
    onChange({ ...profileData, skillSetIds: updated });
  };

  const handleAddSkill = (selected: OptionType) => {
    if (profileData.skillSetIds.length >= 3) return;
    onChange({ ...profileData, skillSetIds: [...profileData.skillSetIds, selected.value] });
  };

  useEffect(() => {
    const fetchSkillsOptions = async () => {
      try {
        const skills = await fetchProjectSkillSets();
        const skillOpts = skills.map((s) => ({ value: s.skillSetId, label: s.skillSetName }));
        setSkillSetOptions(skillOpts);
      } catch (err) {
        console.error('옵션 불러오기 실패:', err);
      }
    };

    fetchSkillsOptions();
  }, []);

  useEffect(() => {
    const imgSrc = gender === 'FEMALE' ? FemaleImg : MaleImg;

    if (!profileData.profileImg) {
      onChange({ ...profileData, profileImg: imgSrc });
    }
  }, [gender]);

  return (
    <CardWrapper>
      <Label>프로필 이미지</Label>
      <ProfileImageWrapper>
        <ProfileImage src={profileImg} alt="프로필 이미지" />
      </ProfileImageWrapper>
      <Label>Skill Set</Label>
      <CustomSelect
        options={skillSetOptions.filter((opt) => !profileData.skillSetIds.includes(opt.value))}
        value={null}
        onChange={handleAddSkill}
        placeholder="최대 3개까지 선택 가능합니다"
      />
      <SelectedList>
        {profileData.skillSetIds.map((id, i) => {
          const skill = skillSetOptions.find((opt) => opt.value === id);
          return (
            <Tag key={i} onClick={() => handleRemoveSkill(id)}>
              {skill?.label ?? 'Unknown'}
            </Tag>
          );
        })}
      </SelectedList>
      <Label>연차</Label>
      <Input
        type="text"
        value={profileData.years.toString()}
        onChange={handleYearChange}
        placeholder="숫자로 입력해주세요"
      />
    </CardWrapper>
  );
};

export default ProfileSection;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 2rem;
  border-radius: 25px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
  gap: 0.1rem;
  min-width: 0;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const Label = styled.div`
  font-weight: 600;
  margin: 0.8rem 0 0.2rem;
  text-align: left;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #e5e5e5;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  font-size: 0.8rem;
  color: #606060;
`;

const SelectedList = styled.div`
  display: flex;
  flex-wrap: nowrap; /* wrap 제거 */
  gap: 0.3rem;
  overflow-x: auto; /* 수평 스크롤 활성화 */
  padding: 0.2rem 0; /* 스크롤바와의 간격 */
  width: 100%;
  min-width: 0;

  /* 스크롤바 스타일링 (선택사항) */
  &::-webkit-scrollbar {
    height: 3px; /* 스크롤바 높이 */
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const Tag = styled.span`
  display: flex; /* ✅ Flex 사용 */
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center;
  background-color: #ffe1e1;
  padding: 0.6rem 0.6rem;

  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #606060 !important;
  cursor: pointer;
  transition: background-color 0.2s;

  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background-color: #ffd3d3;
    color: #000000;
  }
`;
