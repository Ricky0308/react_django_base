import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store'; // Adjust the import path as necessary

const UsernameSection: React.FC = () => {
  const userUsername = useSelector((state: RootState) => state.auth.user?.username);
  const [username, setUsername] = useState(userUsername || '');

  useEffect(() => {
    if (userUsername) {
      setUsername(userUsername);
    }
  }, [userUsername]);

  const handleSave = () => {
    // Implement save logic here
    console.log('Username saved:', username);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Username</h4>
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mt-1 block w-full"
      />
      <Button onClick={handleSave} className="mt-2">
        Save Username
      </Button>
    </div>
  );
};

export default UsernameSection; 