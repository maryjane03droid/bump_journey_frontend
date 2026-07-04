import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Login from './components/Login';
import Home from './components/Welcome'; 
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import About from './components/About';
import Contact from './components/Contact';
import Tracker from './components/Tracker';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Role Dashboards
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  // Sync Dark Mode state at the root level on application launch
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role'); 
    localStorage.removeItem('username');  
    setIsAuthenticated(false);
  };

  // Guard for protected endpoints
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  // Smart Redirection Mapper
  const getDashboardRoute = () => {
    const role = localStorage.getItem('user_role');
    if (role === 'ADMIN') return '/admin-dashboard';
    if (role === 'DOCTOR' || role === 'MIDWIFE' || role === 'NURSE' || role === 'STAFF') return '/staff-dashboard';
    return '/dashboard'; 
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Pass state update handlers down if components need theme refresh triggers */}
        <Navbar onLogout={handleLogout} isAuthenticated={isAuthenticated} />
        
        {/* Main Viewport Grid */}
        <div style={{ flex: '1' }}>
          <Routes>
            {/* Public Entry Points */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Gateway Authentications */}
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to={getDashboardRoute()} />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to={getDashboardRoute()} />} />

            {/* Guarded Patient Layouts */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard onLogout={handleLogout} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/tracker" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
            
            {/* Guarded Clinical/Admin Layouts */}
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/staff-dashboard" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />

            {/* Catch-all Routing Strategy */}
            <Route path="*" element={<Navigate to={isAuthenticated ? getDashboardRoute() : "/"} />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;