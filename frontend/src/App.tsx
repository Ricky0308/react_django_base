import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Signup from './pages/Signup';
import PasswordReset from './pages/PasswordReset';
import UserDelete from './pages/UserDelete';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="signup" element={<Signup />} />
          <Route path="password-reset" element={<PasswordReset />} />
          <Route path="user-delete" element={<UserDelete />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
