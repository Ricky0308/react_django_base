import React, { useState } from 'react';
import { authService } from '../features/auth/api/authService';

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Assuming there's a passwordReset method in authService
      await authService.passwordReset(email);
      setMessage('Password reset email sent');
    } catch (error) {
      setMessage('Password reset failed');
    }
  };

  return (
    <div>
      <h2>Password Reset Page</h2>
      <form onSubmit={handlePasswordReset}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordReset; 