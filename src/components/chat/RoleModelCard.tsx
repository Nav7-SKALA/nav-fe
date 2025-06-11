import React from 'react';
import styled from 'styled-components';
import { FiBookmark } from 'react-icons/fi';
import { SkLogo } from '../../assets/common';
import { RoleModel } from '../../types/roleModel';

interface RoleModelCardProps {
  roleModels: RoleModel[];
}

const RoleModelCard = ({ roleModels = [] }: RoleModelCardProps) => {
  if (!Array.isArray(roleModels) || roleModels.length === 0) return null;
  const handleMoreClick = (roleModel: RoleModel) => {
    console.log('더보기 클릭:', roleModel);
  };

  const handleBookmarkClick = (roleModel: RoleModel) => {
    console.log('북마크 클릭:', roleModel);
  };

  const backgroundColors = [
    '#F9F0F0', // 연한 빨강
    '#FEFCEA', // 연한 노랑
    '#F6F8FE', // 연한 파랑
  ];
  return (
    <CardsContainer>
      {roleModels.map((roleModel, index) => (
        <Card key={index}>
          <BookmarkIcon onClick={() => handleBookmarkClick(roleModel)} />
          <CardContent backgroundColor={backgroundColors[index % backgroundColors.length]}>
            <JobTitle>
              <Experience>{roleModel.years}년차 </Experience>

              <CareerTitle>{roleModel.careerTitle}</CareerTitle>
            </JobTitle>
          </CardContent>
          <CardFooter>
            <Footer>
              <CompanyLogo>
                <SkLogo title="SK Logo" />
              </CompanyLogo>
              <CompanyDetails>
                <CompanyName>
                  {roleModel.years}년차 {roleModel.careerTitle}
                </CompanyName>
                <Nickname>{roleModel.name}</Nickname>
              </CompanyDetails>
            </Footer>
            <MoreButton onClick={() => handleMoreClick(roleModel)}>더보기</MoreButton>
          </CardFooter>
        </Card>
      ))}
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 8px 8px 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  position: relative;
  width: 240px;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const BookmarkIcon = styled(FiBookmark)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  color: #666;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

const CardContent = styled.div<{ backgroundColor?: string }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: center;
  margin-bottom: 5px;
  padding-left: 16px;
  padding-top: 40px;
  background-color: ${({ backgroundColor }) => backgroundColor || 'transparent'};
`;

const JobTitle = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  gap: 8px;
`;

const CareerTitle = styled.h3`
  font-size: 24px;
  font-weight: 400;
  color: #333;
  line-height: 1.2;
  margin: 0;
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: none;
  text-align: left;
`;

const Experience = styled.span`
  font-size: 20px;
  font-weight: 400;
  color: #666;
  line-height: 1.2;
  text-align: left;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

const CompanyLogo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const CompanyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CompanyName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #333;
`;

const Nickname = styled.span`
  font-size: 12px;
  color: #666;
`;

const MoreButton = styled.button`
  background: #333;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #555;
  }
`;

export default RoleModelCard;
