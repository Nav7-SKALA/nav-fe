import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, easeOut } from 'framer-motion';

interface CareerSection<T> {
  title: string;
  subtitle?: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}

interface CareerStepperProps<T> {
  sections: CareerSection<T>[];
  onComplete: () => void;
}

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 90vh;
  // padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 0.5px solid rgba(234, 67, 53, 0.1);
  height: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 2rem; /* 버튼과 겹치지 않게 여유 공간 */
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #475569;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  color: #64748b;
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
  color: white;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(234, 67, 53, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(234, 67, 53, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

// 컨테이너 애니메이션 (전체 그리드)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // 각 자식 요소 사이의 딜레이
      delayChildren: 0.1, // 첫 번째 자식 요소의 딜레이
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1, // 역순으로 사라짐
    },
  },
};

// 각 카드 애니메이션
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      // type: 'spring' as const,
      // stiffness: 300,
      // damping: 24,
      // duration: 0.8,
      type: 'tween' as const,
      ease: easeOut,
      duration: 1.2,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9,
    transition: {
      duration: 0.3,
    },
  },
};

const CareerStepper = <T,>({ sections, onComplete }: CareerStepperProps<T>) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < sections.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const currentSection = sections[step];

  return (
    <Wrapper>
      <Container>
        <Content>
          <Header>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Title>{currentSection.title}</Title>
            </motion.div>
          </Header>

          {currentSection.items.length > 0 ? (
            <motion.div key={step} variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <CardsGrid>
                {currentSection.items.map((item, index) => (
                  <motion.div key={`${step}-${index}`} variants={itemVariants}>
                    {currentSection.renderItem(item, index)}
                  </motion.div>
                ))}
              </CardsGrid>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <EmptyState>
                <EmptyTitle>아직 추가된 항목이 없습니다</EmptyTitle>
                <EmptyDescription>나중에 추가하셔도 괜찮습니다. 다음 단계로 진행해보세요.</EmptyDescription>
              </EmptyState>
            </motion.div>
          )}
        </Content>

        {/* 버튼은 Container 하단에 고정 */}
        <ButtonContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: currentSection.items.length * 0.15 + 0.3,
              duration: 0.5,
            }}
          >
            <Button onClick={handleNext} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {step < sections.length - 1 ? '다음 단계로 →' : '🚀 지금 챗봇 시작하기'}
            </Button>
          </motion.div>
        </ButtonContainer>
      </Container>
    </Wrapper>
  );
};

export default CareerStepper;
