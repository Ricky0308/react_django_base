import { useState } from 'react';
import { authService } from '../api/authService';

export function AuthTest() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await authService.login({ email, password });
      setMessage('Login successful');
      console.log('Login response:', response);
    } catch (error) {
      setMessage('Login failed: ' + error.message);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await authService.signup({ email, password });
      setMessage('Signup successful');
      console.log('Signup response:', response);
    } catch (error) {
      setMessage('Signup failed: ' + error.message);
    }
  };

  const handleRefresh = async () => {
    try {
      const response = await authService.refresh();
      setMessage('Token refresh successful');
      console.log('Refresh response:', response);
    } catch (error) {
      setMessage('Token refresh failed: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Auth API Test</h2>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleLogin}>Test Login</button>
        <button onClick={handleSignup}>Test Signup</button>
        <button onClick={handleRefresh}>Test Token Refresh</button>
      </div>
      <p>{message}</p>
    </div>
  );
} 