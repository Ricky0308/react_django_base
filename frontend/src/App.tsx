import "./index.css";
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from './features/auth/authSlice';
import { authService } from './features/auth/api/authService';
import Layout from './Layout';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Signup from './pages/Signup';
import PasswordReset from './pages/PasswordReset';
import UserDelete from './pages/UserDelete';
import UserActivation from './pages/UserActivation';
import PasswordResetConfirm from './pages/PasswordResetConfirm';
import UserList from './pages/UserList';
import SamplePage from './pages/SamplePage';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import EmailResetConfirm from './pages/EmailResetConfirm';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(loginSuccess(JSON.parse(storedUser)));
    } else {
      const fetchUserInfo = async () => {
        try {
          const userInfo = await authService.getUserInfo();
          dispatch(loginSuccess(userInfo));
        } catch (error) {
          dispatch(logout());
          console.error('Failed to fetch user info:', error);
        }
      };

      fetchUserInfo();
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="signup" element={<Signup />} />
          <Route path="password-reset" element={<PasswordReset />} />
          <Route path="user-delete" element={<UserDelete />} />
          <Route path="user-activate/:uid/:token" element={<UserActivation />} />
          <Route path="password-reset-confirm/:uid/:token" element={<PasswordResetConfirm />} />
          <Route path="user-list" element={<UserList />} />
          <Route path="sample" element={<SamplePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="reset-email-confirm/:uidb64/:token" element={<EmailResetConfirm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
