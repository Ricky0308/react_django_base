import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '../features/auth/api/authService';

const PasswordResetConfirm: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uid && token) {
      try {
        await authService.passwordResetConfirm(uid, token, newPassword);
        setMessage('Password has been reset successfully.');
      } catch (error) {
        setMessage('Password reset failed.');
      }
    }
  };

  return (
    <div>
      <h2>Password Reset Confirmation</h2>
      <form onSubmit={handlePasswordResetConfirm}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordResetConfirm; 