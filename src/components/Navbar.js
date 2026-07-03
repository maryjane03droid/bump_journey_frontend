import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { theme } from '../styles';

function Navbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav style={{ backgroundColor: theme.colors.primary, padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/" style={{ color: theme.colors.white, textDecoration: 'none', fontSize: '24px', fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
          🤱 BumpJourney
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/about" style={{ color: theme.colors.border, textDecoration: 'none', fontWeight: 'bold' }}>About</Link>
        <Link to="/contact" style={{ color: theme.colors.border, textDecoration: 'none', fontWeight: 'bold' }}>Contact</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={{ color: theme.colors.white, textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</Link>
            <Link to="/tracker" style={{ color: theme.colors.white, textDecoration: 'none', fontWeight: 'bold' }}>Health Tracker</Link>
            
            {/* NEW PROFILE LINK ADDED HERE */}
            <Link to="/profile" style={{ color: theme.colors.white, textDecoration: 'none', fontWeight: 'bold' }}>My Profile</Link>
            
            <button onClick={handleLogoutClick} style={{ backgroundColor: 'transparent', color: theme.colors.white, border: `1px solid ${theme.colors.white}`, padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: theme.colors.white, textDecoration: 'none', fontWeight: 'bold' }}>Log In</Link>
            <Link to="/signup" style={{ backgroundColor: theme.colors.secondary, color: theme.colors.white, padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;