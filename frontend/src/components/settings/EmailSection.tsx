import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store'; // Adjust the import path as necessary

const EmailSection: React.FC = () => {
  const userEmail = useSelector((state: RootState) => state.auth.user?.email);
  const [email, setEmail] = useState(userEmail || '');

  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  const handleSave = () => {
    // Implement save logic here
    console.log('Email saved:', email);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Email</h4>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 block w-full"
      />
      <Button onClick={handleSave} className="mt-2">
        Save Email
      </Button>
    </div>
  );
};

export default EmailSection; 