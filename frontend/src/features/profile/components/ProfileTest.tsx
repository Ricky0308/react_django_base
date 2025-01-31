import { useState } from 'react';
import { profileService } from '../api/profileService';

export function ProfileTest() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<any>(null);

  const handleHello = async () => {
    try {
      const response = await profileService.hello();
      setResponse(response);
      setMessage('Hello endpoint called successfully');
      console.log('Hello response:', response);
    } catch (error) {
      setMessage('Failed to call hello endpoint: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Profile API Test</h2>
      <button onClick={handleHello}>Test Hello Endpoint</button>
      <p>{message}</p>
      {response && (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      )}
    </div>
  );
} 