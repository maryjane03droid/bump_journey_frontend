import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem('username') || 'User';
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (document.body.classList.contains('dark-mode')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    setIsDarkMode(!isDarkMode);
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav style={{ 
      backgroundColor: 'var(--card-bg, #ffffff)', /* Crisp white in light mode, dark in dark mode */
      padding: '15px 40px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)', /* Gives it a professional floating effect */
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'background-color 0.3s ease' 
    }}>
      
      {/* BRANDING LOGO */}
      <div>
        <Link to="/" style={{ 
          color: 'var(--primary-color, #2e7d32)', 
          textDecoration: 'none', 
          fontSize: '26px', 
          fontFamily: 'Georgia, serif', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '30px' }}>🤱</span> BumpJourney
        </Link>
      </div>

      {/* NAVIGATION LINKS */}
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <Link to="/about" style={{ color: 'var(--text-color, #333)', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>About</Link>
        <Link to="/contact" style={{ color: 'var(--text-color, #333)', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>Contact</Link>
        
        {/* THEME TOGGLE BUTTON */}
        <button onClick={toggleDarkMode} style={{ 
          background: 'var(--input-bg, #f0f0f0)', 
          border: '1px solid var(--border-color, #ccc)', 
          color: 'var(--text-color, #333)', 
          padding: '6px 14px', 
          borderRadius: '20px', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          fontWeight: 'bold',
          fontSize: '13px'
        }}>
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        
        {/* CONDITIONAL AUTH LINKS */}
        {isAuthenticated ? (
          <>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color, #ccc)', margin: '0 5px' }}></div>
            
            <Link to="/dashboard" style={{ color: 'var(--text-color, #333)', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>Dashboard</Link>
            <Link to="/tracker" style={{ color: 'var(--text-color, #333)', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>Tracker</Link>
            
            <Link to="/profile" style={{ 
              color: 'var(--primary-color, #2e7d32)', 
              textDecoration: 'none', 
              fontWeight: 'bold', 
              fontSize: '15px',
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              padding: '6px 12px',
              borderRadius: '8px'
            }}>
              Hi, {loggedInUser}
            </Link>
            
            <button onClick={handleLogoutClick} style={{ 
              backgroundColor: 'var(--primary-color, #2e7d32)', 
              color: '#ffffff', 
              border: 'none', 
              padding: '8px 20px', 
              borderRadius: '20px', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '14px',
              transition: 'opacity 0.2s'
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color, #ccc)', margin: '0 5px' }}></div>
            <Link to="/login" style={{ color: 'var(--primary-color, #2e7d32)', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>Log In</Link>
            <Link to="/signup" style={{ 
              backgroundColor: 'var(--primary-color, #2e7d32)', 
              color: '#ffffff', 
              padding: '10px 22px', 
              borderRadius: '25px', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              fontSize: '15px',
              boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)'
            }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;