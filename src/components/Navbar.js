// src/components/Navbar.js
import React from 'react';
import { theme } from '../styles';

function Navbar({ onLogout }) {
  return (
    <nav style={{ padding: '20px 40px', backgroundColor: theme.colors.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.colors.border}` }}>
      <h2 style={{ color: theme.colors.primary, margin: 0 }}>Bump Journey</h2>
      
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
    </nav>
  );
}

export default Navbar;