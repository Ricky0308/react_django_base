import React from 'react';
import useAuthRedirect from '../hooks/useAuthRedirect';

const ProtectedPage: React.FC = () => {
  useAuthRedirect();

  return (
    <div>
      <h1>Protected Page</h1>
      <p>This page is only accessible to authenticated users.</p>
    </div>
  );
};

export default ProtectedPage; 