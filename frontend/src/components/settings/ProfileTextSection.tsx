import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store'; // Adjust the import path as necessary
import { API_ENDPOINTS } from '../../config/api'; // Ensure this path is correct
import { baseService } from '../../features/api/baseService'; // Import baseService

const ProfileTextSection: React.FC = () => {
  const userProfileText = useSelector((state: RootState) => state.auth.user?.profile?.profile_text);
  const [profileText, setProfileText] = useState(userProfileText || '');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userProfileText) {
      setProfileText(userProfileText);
    }
  }, [userProfileText]);

  const handleSave = async () => {
    try {
      const response = await baseService.request(API_ENDPOINTS.auth.updateProfileText, {
        method: 'PUT',
        body: JSON.stringify({ profile_text: profileText }),
      });

      setMessage('Profile text updated successfully.');
    } catch (error) {
      setMessage(`Failed to update profile text: ${error.message}`);
    }
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
      <Button
        onClick={handleSave}
        className="mt-2 flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-400 transition-colors duration-800 focus:outline-none"
      >
        Save Profile Text
      </Button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default ProfileTextSection; 