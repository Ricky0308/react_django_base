import { AuthTest } from './features/auth/components/AuthTest';
import { UserTest } from './features/user/components/UserTest';
import { ProfileTest } from './features/profile/components/ProfileTest';

function App() {
  return (
    <div className="App">
      <h1>API Testing Dashboard</h1>
      <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
        <AuthTest />
      </div>
      <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
        <UserTest />
      </div>
      <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
        <ProfileTest />
      </div>
    </div>
  );
}

export default App;
