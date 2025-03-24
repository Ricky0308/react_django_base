import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';
import { authService } from '../features/api/authService';
import { useNavigate } from 'react-router-dom';

const UserDelete: React.FC = () => {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirmationInput !== 'DELETE') {
      setError('Please type DELETE to confirm.');
      return;
    }

    try {
      await authService.deleteUser();
      setMessage('Your account has been successfully deleted.');
      setError('');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      setError('Failed to delete account. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700 mb-4">
            Please type <strong>DELETE</strong> to confirm account deletion.
          </p>
          <Input
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="mb-4"
          />
          <Button className="w-full" onClick={handleDelete}>
            Confirm Deletion
          </Button>
          {error && (
            <Alert variant="destructive" className="mt-4 p-2 text-sm w-full">
              {error}
            </Alert>
          )}
          {message && (
            <Alert variant="success" className="mt-4 p-2 text-sm w-full">
              {message}
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDelete; 