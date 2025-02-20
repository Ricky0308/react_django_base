import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store'; // Adjust the import path as necessary
import { API_ENDPOINTS } from '../../config/api'; // Ensure this path is correct
import { baseService } from '../../features/api/baseService'; // Import baseService

const UsernameSection: React.FC = () => {
  const userUsername = useSelector((state: RootState) => state.auth.user?.username);
  const [username, setUsername] = useState(userUsername || '');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userUsername) {
      setUsername(userUsername);
    }
  }, [userUsername]);

  const handleSave = async () => {
    try {
      const response = await baseService.request(API_ENDPOINTS.auth.updateUsername, {
        method: 'PUT',
        body: JSON.stringify({ username }),
      });

      setMessage('Username updated successfully.');
    } catch (error) {
      setMessage(`Failed to update username: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Username</h4>
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mt-1 block w-full"
      />
      <Button
        onClick={handleSave}
        className="mt-2 flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-400 transition-colors duration-800 focus:outline-none"
      >
        Save Username
      </Button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default UsernameSection; 