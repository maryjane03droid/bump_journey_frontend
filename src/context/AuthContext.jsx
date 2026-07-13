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
    
    // FIX 1: Added optional chaining and toUpperCase() to prevent crashes from lowercase database roles
    const role = user?.role?.toUpperCase(); 
    
    if (role === 'ADMIN') return '/admin/dashboard';
    if (['DOCTOR', 'PEDIATRICIAN', 'NURSE', 'MIDWIFE', 'NUTRITIONIST', 'LAB_TECHNICIAN', 'THERAPIST'].includes(role)) {
      return '/staff/dashboard';
    }
    if (role === 'PATIENT') return '/patient/dashboard';
    
    // FIX 2: Replaced '/patient/dashboard' with '/' as the default fallback to stop the infinite redirect loop
    return '/'; 
  };

  const isAuthenticated = !!user;
  
  // FIX 3: Added toUpperCase() to the boolean checks to match your strict uppercase strings
  const isPatient = user?.role?.toUpperCase() === 'PATIENT';
  const isPrimaryStaff = ['DOCTOR', 'PEDIATRICIAN', 'NURSE'].includes(user?.role?.toUpperCase());
  const isSpecialistStaff = ['MIDWIFE', 'NUTRITIONIST', 'LAB_TECHNICIAN', 'THERAPIST'].includes(user?.role?.toUpperCase());
  const isAnyStaff = isPrimaryStaff || isSpecialistStaff;
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

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