import React from 'react';
import RoleModelProfileCard from '../components/chat/RoleModelProfileCard';
import { MaleImg } from '../assets/common';
interface RoleModelProfileCardProps {
  name: string;
  careerTitle: string;
  skillSet: string;
  tenure: number;
  profileImage: string;
}

const IntroPage = () => {
  return (
    <RoleModelProfileCard
      name="김현준"
      careerTitle="미친 PM Leader"
      skillSet="주늑들게하기"
      tenure={10}
      profileImage={MaleImg}
    />
  );
};

export default IntroPage;
