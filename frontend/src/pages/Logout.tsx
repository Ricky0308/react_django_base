import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { authService } from '../features/auth/api/authService';

const Logout: React.FC = () => {
  useEffect(() => {
    const performLogout = async () => {
      try {
        await authService.logout();
        console.log('Logout successful');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    performLogout();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Logout</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700">
            You have been successfully logged out.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logout; 