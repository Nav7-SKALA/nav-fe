import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface CareerRevealProps {
  projectCount: number;
  experienceCount: number;
  certificationCount: number;
}

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  padding-top: 20vh;
`;
const InnerWrapper = styled(motion.div)`
  text-align: center;
  font-size: 1.25rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 1.5,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CareerReveal = ({ projectCount, experienceCount, certificationCount }: CareerRevealProps) => {
  const lines = [
    '당신의 커리어를 분석 중입니다...',
    `✔ ${projectCount}개의 프로젝트를 수행했어요.`,
    `✔ ${experienceCount}번의 성장 경험이 있어요.`,
    `✔ ${certificationCount}개의 자격증이 확인되었어요.`,
  ];
  return (
    <OuterWrapper>
      <InnerWrapper variants={container} initial="hidden" animate="visible">
        {lines.map((line, index) => (
          <motion.p key={index} variants={item}>
            {line}
          </motion.p>
        ))}
      </InnerWrapper>
    </OuterWrapper>
  );
};

export default CareerReveal;
