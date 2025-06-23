import React from 'react';
import styled from 'styled-components';

interface RoleModelProfileCardProps {
  name?: string;
  careerTitle?: string;
  skillSet?: string;
  tenure?: number;
  profileImage?: string;
}

const RoleModelProfileCard = ({
  name = '김현준',
  careerTitle = 'Senior PM Engineer',
  skillSet = 'Infra PM',
  tenure = 20,
  profileImage = '',
}: RoleModelProfileCardProps) => {
  return (
    <CardWrapper>
      {/* Header */}
      <Header>
        <BackButton>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </BackButton>
        <HeaderTitle>채팅</HeaderTitle>
      </Header>

      {/* Profile Section */}
      <ProfileSection>
        <ProfileImageWrapper>
          <ProfileImage src={profileImage} alt={`${name} 프로필`} />
        </ProfileImageWrapper>
        <Name>{name}</Name>

        <Divider />

        {/* Profile Info */}
        <ProfileInfo>
          <ProfileTitle>Profile</ProfileTitle>

          <InfoRow>
            <InfoLabel>Job</InfoLabel>
            <InfoValue>{careerTitle}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Skill set</InfoLabel>
            <InfoValue>{skillSet}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Tenure</InfoLabel>
            <InfoValue>{tenure}</InfoValue>
          </InfoRow>
        </ProfileInfo>
      </ProfileSection>
    </CardWrapper>
  );
};

export default RoleModelProfileCard;

const CardWrapper = styled.div`
  max-width: 320px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
`;

const BackButton = styled.button`
  padding: 0.3rem;
  background: none;
  border: none;
  border-radius: 5px;
  color: #6b7280;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const HeaderTitle = styled.h1`
  margin-left: 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #606060;
  margin: 0;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px;
`;

const ProfileImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Name = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: #606060;
  margin: 0 0 1rem 0;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e5e7eb;
  margin-bottom: 1.2rem;
`;

const ProfileInfo = styled.div`
  width: 100%;
`;

const ProfileTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #606060;
  margin: 0 0 1rem 0;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const InfoLabel = styled.span`
  color: #606060;
  font-weight: 500;
  font-size: 0.9rem;
`;

const InfoValue = styled.span`
  color: #5c5c5c;
  font-weight: 500;
  font-size: 0.9rem;
  text-align: right;
`;
