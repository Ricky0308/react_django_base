import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store'; // Adjust the import path as necessary
import { loginSuccess, logout } from '../features/auth/authSlice';
import { authService } from '../features/api/authService';

const useAuthRedirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      if (!user) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          dispatch(loginSuccess(JSON.parse(storedUser)));
        } else {
          try {
            const userInfo = await authService.getUserInfo();
            dispatch(loginSuccess(userInfo));
          } catch (error) {
            dispatch(logout());
            navigate('/login');
          }
        }
      }
    };

    checkUserAuthentication();
  }, [user, dispatch, navigate]);
};

export default useAuthRedirect; 