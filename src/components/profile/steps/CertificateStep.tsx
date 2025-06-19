import React from 'react';
import styled from 'styled-components';
import CertificationCard from '../card/CertificationCard';
import { Certification, CertificationDto } from '../../../types/certification';
import { useEncryptedStorage } from '../../../hooks/useEncryptedStorage';

interface CertificationStepProps {
  certificates: Certification[];
  setCertificates: React.Dispatch<React.SetStateAction<Certification[]>>;
  certificatesDto: CertificationDto[];
  setCertificatesDto: React.Dispatch<React.SetStateAction<CertificationDto[]>>;
}
const CertificationStep = ({
  certificates,
  setCertificates,
  certificatesDto,
  setCertificatesDto,
}: CertificationStepProps) => {
  const { removeEncryptedItemByIndex: removeEncryptedCertificateByIndex } =
    useEncryptedStorage<CertificationDto>('encrypted-certificates');
  const handleDeleteCertificate = (index: number) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index));
    setCertificatesDto((prev) => prev.filter((_, i) => i !== index));
    removeEncryptedCertificateByIndex(index);
  };

  return (
    <CertificationSection>
      <CertificationList>
        {certificates.map((certificate, index) => (
          <CertificationCard key={index} certification={certificate} onDelete={() => handleDeleteCertificate(index)} />
        ))}
      </CertificationList>

      {certificates.length === 0 && (
        <EmptyState>
          <EmptyMessage>등록된 자격증이 없습니다.</EmptyMessage>
          <EmptySubMessage>+ 버튼을 클릭하여 자격증을 추가해보세요.</EmptySubMessage>
        </EmptyState>
      )}
    </CertificationSection>
  );
};

const CertificationSection = styled.div`
  margin-bottom: 1.5rem;
`;

const CertificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
`;

const EmptyMessage = styled.p`
  color: #606060;
  margin-bottom: 0.25rem;
`;

const EmptySubMessage = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
`;

export default CertificationStep;
