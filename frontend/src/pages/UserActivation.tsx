import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { authService } from '../features/auth/api/authService';
import { Link } from 'react-router-dom';
const UserActivation: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [activationStatus, setActivationStatus] = useState<string | null>(null);

  useEffect(() => {
    const activateUser = async () => {
      try {
        await authService.activateUser(uid!, token!);
        setActivationStatus('success');
      } catch (error) {
        setActivationStatus('failure');
      }
    };

    activateUser();
  }, [uid, token]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>User Activation</CardTitle>
        </CardHeader>
        <CardContent>
          {activationStatus === 'success' ? (
            <p className="text-center text-gray-700">
              Your account has been successfully activated. You can now log in.
            </p>
          ) : activationStatus === 'failure' ? (
            <p className="text-center text-red-600">
              Activation failed. Please check the link or contact support.
            </p>
          ) : (
            <p className="text-center text-gray-700">Activating your account...</p>
          )}
          <div className="mt-4 flex justify-center">
            <Link to="/login" className="text-blue-600 hover:underline">
              Go to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivation; 