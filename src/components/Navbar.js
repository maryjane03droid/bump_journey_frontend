// src/components/Navbar.js
import React from 'react';
import { theme } from '../styles';

function Navbar() {
  return (
    <nav style={{ padding: '20px', backgroundColor: theme.colors.white, display: 'flex', gap: '20px', alignItems: 'center' }}>
      <h2 style={{ color: theme.colors.primary, margin: 0 }}>Bump Journey</h2>
      {/* Rest of your links */}
      <a href="/">Home</a>
      <a href="/about">About Us</a>
      <a href="/track">Track Pregnancy</a>
      <a href="/contact">Contact Us</a>
    </nav>
  );
}

export default Navbar;