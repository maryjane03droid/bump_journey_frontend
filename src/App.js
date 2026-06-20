import React, { useState } from 'react';
import Login from './components/Login'; // 🔴 FIXED: Now correctly points into the components folder
import { authAPI } from './api';
import './App.css';

function App() {
  // Read local storage to see if an access token is already saved
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        // If not logged in, display the login form
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        // If logged in, show the temporary dashboard view
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
            <h1 style={{ color: '#2c3e50', margin: 0 }}>🤰 Bump Journey Dashboard</h1>
            <button 
              onClick={handleLogout} 
              style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Logout
            </button>
          </header>
          
          <main style={{ marginTop: '30px', textAlign: 'left' }}>
            <div style={{ backgroundColor: '#e8f4fd', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#1d3557' }}>Welcome Back!</h2>
              <p style={{ margin: 0, color: '#457b9d' }}>Your authentication structure is working completely.</p>
            </div>
            
            <h3>📋 Pregnancy Tracking Metrics Logs</h3>
            <p style={{ color: '#666' }}>Next step: Building the form and table to view your symptoms and daily health entries directly from the database.</p>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;