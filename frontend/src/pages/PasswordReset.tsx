import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';
import { authService } from '../features/api/authService';

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.passwordReset(email);
      setMessage('Password reset email sent. Please check your inbox.');
      setError(''); // Clear any previous error
    } catch (error) {
      setError('Failed to send password reset email. Please try again.');
      setMessage(''); // Clear any previous success message
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Password Reset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-400 transition-colors duration-800 focus:outline-none"
            >
              Send Password Reset Email
            </Button>
          </form>
          {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
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

export default PasswordReset; 