import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '../features/auth/api/authService';

const UserActivation: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activateUser = async () => {
      if (uid && token) {
        try {
          await authService.activateUser(uid, token);
          setMessage('User activated successfully.');
        } catch (error) {
          setMessage('User activation failed.');
        }
      }
    };

    activateUser();
  }, [uid, token]);

  return (
    <div>
      <h2>User Activation</h2>
      <p>{message}</p>
    </div>
  );
};

export default UserActivation; 