import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store'; // Adjust the import path as necessary
import { API_ENDPOINTS } from '../../config/api'; // Ensure this path is correct
import { baseService } from '../../features/api/baseService'; // Import baseService

const EmailSection: React.FC = () => {
  const userEmail = useSelector((state: RootState) => state.auth.user?.email);
  const [email, setEmail] = useState(userEmail || '');
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  const handleSave = async () => {
    if (!showPasswordInput) {
      setShowPasswordInput(true);
      return;
    }

    try {
      const response = await baseService.request(API_ENDPOINTS.auth.resetEmail, {
        method: 'POST',
        body: JSON.stringify({ new_email: email, password }),
      });

      setMessage('Email change request sent successfully.');
      setShowPasswordInput(false);
      setPassword('');
    } catch (error) {
      setMessage(`Failed to change email: ${error.message}`);
    }
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
      {showPasswordInput && (
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="mt-1 block w-full"
        />
      )}
      <Button
        onClick={handleSave}
        className="mt-2 flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-400 transition-colors duration-800 focus:outline-none"
      >
        {showPasswordInput ? 'Confirm Email Change' : 'Save Email'}
      </Button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default EmailSection; 