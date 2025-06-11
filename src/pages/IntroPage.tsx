import React, { useEffect } from 'react';
import RoleModelCard from '../components/chat/RoleModelCard';
import { RoleModel } from '../types/roleModel';

interface BackendResponse {
  response: RoleModel[];
}

const IntroPage = () => {
  return (
    <div>
      <h1>인트로</h1>
    </div>
  );
};

export default IntroPage;
