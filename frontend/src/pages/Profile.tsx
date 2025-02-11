import React, { useEffect, useState } from 'react';
import { authService } from '../features/auth/api/authService';

const Profile: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await authService.getUserInfo();
        setUserId(response.id);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      {userId ? <p>User ID: {userId}</p> : <p>Loading...</p>}
    </div>
  );
};

export default Profile; 