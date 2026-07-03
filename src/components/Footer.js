import React from 'react';
import { theme } from '../styles';

function Footer() {
  return (
    <footer style={{ backgroundColor: theme.colors.primary, color: theme.colors.border, textAlign: 'center', padding: '15px', marginTop: 'auto' }}>
      <p style={{ margin: 0 }}>© {new Date().getFullYear()} BumpJourney Maternity Management System.</p>
    </footer>
  );
}

export default Footer;