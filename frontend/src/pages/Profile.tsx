import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <div>
          <p>ID: {user.id}</p>
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile; 