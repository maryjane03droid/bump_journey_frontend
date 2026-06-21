import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import StaffDashboard from './components/StaffDashboard';
import Login from './components/Login'; // Assuming you have a Login component

function App() {
  // 'user' state stores the logged-in user profile, including their role
  // Example structure: { username: 'maryjane', role: 'patient' } or { role: 'staff' }
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]); // Shared state for patient logs

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token'); // Assuming you use JWT or token auth
  };

  // If no user is logged in, show the Login page
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Role-based routing: 
  // If role is 'staff' or 'admin', show the StaffDashboard.
  // Otherwise, show the client Dashboard.
  return (
    <>
      {user.role === 'staff' || user.role === 'admin' ? (
        <StaffDashboard 
          onLogout={handleLogout} 
        />
      ) : (
        <Dashboard 
          onLogout={handleLogout} 
          logs={logs} 
          setLogs={setLogs} 
        />
      )}
    </>
  );
}

export default App;