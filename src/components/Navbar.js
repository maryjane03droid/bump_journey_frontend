import React from 'react';
import { theme } from '../styles';

function Navbar({ onLogout, userRole }) {
  const navLinkStyle = { 
    color: theme.colors.primary, 
    textDecoration: 'none', 
    fontWeight: '600', 
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <nav style={{ 
      padding: '20px 40px', 
      backgroundColor: theme.colors.white, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      borderBottom: `1px solid ${theme.colors.border}` 
    }}>
      <h2 style={{ color: theme.colors.primary, margin: 0 }}>Bump Journey</h2>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <a href="/" style={navLinkStyle}>Home</a>
        <a href="/about" style={navLinkStyle}>About Us</a>
        <a href="/contact" style={navLinkStyle}>Contact Us</a>
        
        {/* Only show tracking/feedback for patients */}
        {userRole === 'patient' && (
          <>
            <a href="/track" style={navLinkStyle}>Track Pregnancy</a>
            <a href="/feedback" style={navLinkStyle}>Clinic Feedback</a>
          </>
        )}
        
        <a href="/profile" style={navLinkStyle}>Profile</a>
        
        <button 
          onClick={onLogout} 
          style={{ 
            backgroundColor: '#e63946', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;