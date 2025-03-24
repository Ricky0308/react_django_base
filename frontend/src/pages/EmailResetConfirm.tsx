import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert } from '../components/ui/alert';
import { authService } from '../features/api/authService';

const EmailResetConfirm: React.FC = () => {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const [status, setStatus] = useState<'success' | 'failure' | null>(null);

  useEffect(() => {
    const confirmEmailReset = async () => {
      try {
        await authService.confirmEmailReset(uidb64!, token!);
        setStatus('success');
      } catch (error) {
        setStatus('failure');
      }
    };

    confirmEmailReset();
  }, [uidb64, token]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Email Reset Confirmation</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'success' ? (
            <p className="text-center text-gray-700">
              Your email has been successfully updated. You can now log in with your new email.
            </p>
          ) : status === 'failure' ? (
            <p className="text-center text-red-600">
              Email reset confirmation failed. Please check the link or contact support.
            </p>
          ) : (
            <p className="text-center text-gray-700">Confirming your email reset...</p>
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

export default EmailResetConfirm; 