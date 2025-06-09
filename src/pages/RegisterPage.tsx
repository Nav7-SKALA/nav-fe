import React, {useState} from 'react';
import CodeVerificationModal from '../components/modal/signup/CodeVerificationModal';

function RegisterPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleSuccess = () => {
    alert('인증 성공!');
    setIsModalOpen(false);
  };

  return (
    <div>
      {isModalOpen && (
        <CodeVerificationModal
          email="user@example.com"
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
export default RegisterPage;
