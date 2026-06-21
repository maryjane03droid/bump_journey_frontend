// src/components/Footer.js
import React from 'react';
import { theme } from '../styles';

function Footer() {
  return (
    <footer style={{ 
      padding: '20px', 
      textAlign: 'center', 
      backgroundColor: theme.colors.white, 
      marginTop: 'auto',
      borderTop: `1px solid ${theme.colors.border}`,
      color: theme.colors.primary 
    }}>
      <p>&copy; 2026 Bump Journey. All rights reserved.</p>
    </footer>
  );
}

export default Footer;