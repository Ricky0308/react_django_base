import React from 'react';
import UsernameSection from './UsernameSection';
import EmailSection from './EmailSection';
import ProfileTextSection from './ProfileTextSection';

const UserInfo: React.FC = () => {
  return (
    <div className="space-y-8">
      <UsernameSection />
      <EmailSection />
      <ProfileTextSection />
    </div>
  );
};

export default UserInfo; 