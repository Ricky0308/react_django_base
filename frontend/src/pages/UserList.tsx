import React, { useState, useEffect } from 'react';
import { userService } from '../features/user/api/userService';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.list();
        setUsers(response);
        setMessage('Users retrieved successfully.');
      } catch (error) {
        setMessage('Failed to retrieve users.');
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>
      {message && <p>{message}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList; 