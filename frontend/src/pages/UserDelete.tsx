import React, { useState } from 'react';
import { userService } from '../features/user/api/userService';

const UserDelete: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleUserDelete = async () => {
    try {
      await userService.delete(userId);
      setMessage('User deleted successfully');
    } catch (error) {
      setMessage('User deletion failed');
    }
  };

  return (
    <div>
      <h2>User Deletion Page</h2>
      <div>
        <label>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>
      <button onClick={handleUserDelete}>Delete User</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserDelete; 