import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';
import { authService } from '../features/api/authService';

const PasswordResetConfirm: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await authService.passwordResetConfirm(uid!, token!, newPassword);
      setMessage('Password has been reset successfully.');
      setError(''); // Clear any previous error
    } catch (error) {
      setError('Failed to reset password. Please try again.');
      setMessage(''); // Clear any previous success message
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordResetConfirm} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-400 transition-colors duration-800 focus:outline-none"
            >
              Reset Password
            </Button>
          </form>
          {message && (
            <div className="mt-4 text-center">
              <p className="text-gray-700">{message}</p>
              <Link to="/login" className="text-blue-600 hover:underline">
                Go to Login
              </Link>
            </div>
          )}
          {error && (
            <Alert variant="destructive" className="mt-4 p-2 text-sm w-full">
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordResetConfirm; 