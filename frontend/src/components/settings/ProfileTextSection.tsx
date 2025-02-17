import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store'; // Adjust the import path as necessary

const ProfileTextSection: React.FC = () => {
  const userProfileText = useSelector((state: RootState) => state.auth.user?.profile?.profile_text);
  const [profileText, setProfileText] = useState(userProfileText || '');

  useEffect(() => {
    if (userProfileText) {
      setProfileText(userProfileText);
    }
  }, [userProfileText]);

  const handleSave = () => {
    // Implement save logic here
    console.log('Profile text saved:', profileText);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Profile Text</h4>
      <textarea
        value={profileText}
        onChange={(e) => setProfileText(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        rows={4}
      />
      <Button onClick={handleSave} className="mt-2">
        Save Profile Text
      </Button>
    </div>
  );
};

export default ProfileTextSection; 