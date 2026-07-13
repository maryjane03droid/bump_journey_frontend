import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('user_role');
    const userId = localStorage.getItem('user_id');

    if (token && username && role) {
      setUser({ username, role, userId });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/accounts/login/', { username, password });
    const data = res.data.data;

    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('username', data.username);
    localStorage.setItem('user_role', data.role);
    localStorage.setItem('user_id', data.user_id);

    setUser({
      username: data.username,
      role: data.role,
      userId: data.user_id,
    });

    return data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (!user) return '/';
    const role = user.role;
    if (role === 'ADMIN') return '/admin/dashboard';
    if (['DOCTOR', 'PEDIATRICIAN', 'NURSE', 'MIDWIFE', 'NUTRITIONIST', 'LAB_TECHNICIAN', 'THERAPIST'].includes(role)) {
      return '/staff/dashboard';
    }
    return '/patient/dashboard';
  };

  const isAuthenticated = !!user;
  const isPatient = user?.role === 'PATIENT';
  const isPrimaryStaff = ['DOCTOR', 'PEDIATRICIAN', 'NURSE'].includes(user?.role);
  const isSpecialistStaff = ['MIDWIFE', 'NUTRITIONIST', 'LAB_TECHNICIAN', 'THERAPIST'].includes(user?.role);
  const isAnyStaff = isPrimaryStaff || isSpecialistStaff;
  const isAdmin = user?.role === 'ADMIN';

  if (loading) return null;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      isPatient,
      isPrimaryStaff,
      isSpecialistStaff,
      isAnyStaff,
      isAdmin,
      getDashboardRoute,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
