import { useState } from 'react';
import { userService } from '../api/userService';

export function UserTest() {
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState<any>(null);

  const handleListUsers = async () => {
    try {
      const response = await userService.list();
      setUserData(response);
      setMessage('Users listed successfully');
      console.log('Users:', response);
    } catch (error) {
      setMessage('Failed to list users: ' + error.message);
    }
  };

  const handleGetUserDetails = async () => {
    try {
      const response = await userService.getDetails(userId);
      setUserData(response);
      setMessage('User details retrieved successfully');
      console.log('User details:', response);
    } catch (error) {
      setMessage('Failed to get user details: ' + error.message);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await userService.update(userId, {
        first_name: 'Test',
        last_name: 'User'
      });
      setUserData(response);
      setMessage('User updated successfully');
      console.log('Update response:', response);
    } catch (error) {
      setMessage('Failed to update user: ' + error.message);
    }
  };

  return (
    <div>
      <h2>User API Test</h2>
      <div>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleListUsers}>Test List Users</button>
        <button onClick={handleGetUserDetails}>Test Get User Details</button>
        <button onClick={handleUpdateUser}>Test Update User</button>
      </div>
      <p>{message}</p>
      {userData && (
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      )}
    </div>
  );
} 