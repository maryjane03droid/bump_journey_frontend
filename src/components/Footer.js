import React from 'react';
import { theme } from '../styles';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      role="contentinfo"
      style={{ 
        backgroundColor: theme.colors.primary, 
        // Swapped to white/off-white for crisp WCAG color contrast over the dark green background
        color: '#f8faf8', 
        textAlign: 'center', 
        padding: '20px 15px', 
        marginTop: 'auto',
        width: '100%',
        boxSizing: 'border-box',
        borderTop: `1px solid rgba(255, 255, 255, 0.1)`
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', letterSpacing: '0.3px' }}>
          &copy; {currentYear} BumpJourney Maternity Management System.
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(248, 250, 248, 0.7)' }}>
          Secured Clinical Workspace &bull; All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;