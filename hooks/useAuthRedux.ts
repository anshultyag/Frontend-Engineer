import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { setCredentials, logout, setLoading } from '@/lib/slices/authSlice';
import { useLoginMutation } from '@/lib/api/authApi';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, token, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const initialized = useRef(false);
  const [loginMutation] = useLoginMutation();

  const initializeAuth = useCallback(() => {
    if (initialized.current) return;
    
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        dispatch(setCredentials({ user: userData, token: storedToken }));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(logout());
      }
    } else {
      dispatch(setLoading(false));
    }
    
    initialized.current = true;
  }, [dispatch]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (username: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const result = await loginMutation({ username, password }).unwrap();

      const { token, ...user } = result;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch(setCredentials({ user, token }));

      return { success: true };
    } catch (error: any) {
      dispatch(setLoading(false));
      return {
        success: false,
        message: error.data?.message || 'Login failed'
      };
    }
  };


  const logoutUser = async () => {
    console.log('Logout function called');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    console.log('Logout dispatched, redirecting to login');
    try {
      await router.push('/login');
      console.log('Router push completed');
    } catch (error) {
      console.error('Router push failed:', error);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout: logoutUser,
  };
};
