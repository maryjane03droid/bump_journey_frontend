// src/components/Navbar.js
import React from 'react';
import { theme } from '../styles'; // Importing your theme

const Navbar = ({ setCurrentPage }) => {
  const navStyle = {
    padding: theme.spacing.padding,
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    gap: theme.spacing.gap,
    alignItems: 'center',
    backgroundColor: theme.colors.white
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    color: theme.colors.secondary
  };

  return (
    <nav style={navStyle}>
      <h2 style={{ color: theme.colors.primary, margin: 0 }}>MATERNACARE</h2>
      <button style={buttonStyle} onClick={() => setCurrentPage('home')}>Home</button>
      <button style={buttonStyle} onClick={() => setCurrentPage('about')}>About Us</button>
      <button style={buttonStyle} onClick={() => setCurrentPage('tracker')}>Track Pregnancy</button>
      <button style={buttonStyle} onClick={() => setCurrentPage('contact')}>Contact Us</button>
    </nav>
  );
};

export default Navbar;