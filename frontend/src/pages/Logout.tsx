import React, { useState } from 'react';
import { authService } from '../features/auth/api/authService';

const Logout: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    try {
      // Assuming there's a logout method in authService
      await authService.logout();
      setMessage('Logout successful');
    } catch (error) {
      setMessage('Logout failed');
    }
  };

  return (
    <div>
      <h2>Logout Page</h2>
      <button onClick={handleLogout}>Logout</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Logout; 