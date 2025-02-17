import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import UsernameSection from './UsernameSection';
import EmailSection from './EmailSection';
import ProfileTextSection from './ProfileTextSection';
import { authService } from '../../features/auth/api/authService';
import { loginSuccess, logout } from '../../features/auth/authSlice';
import { RefreshCw } from 'lucide-react';

const UserInfo: React.FC = () => {
  const dispatch = useDispatch();

  const handleReload = async () => {
    try {
      const userInfo = await authService.getUserInfo();
      dispatch(loginSuccess(userInfo));
    } catch (error) {
      dispatch(logout());
      console.error('Failed to fetch user info:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">User Information</h3>
        <Button
          onClick={handleReload}
          className="ml-4 flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-400 transition-colors duration-800"
        >
          <RefreshCw className="w-4 h-4" />
          Reload
        </Button>
      </div>
      <UsernameSection />
      <EmailSection />
      <ProfileTextSection />
    </div>
  );
};

export default UserInfo; 