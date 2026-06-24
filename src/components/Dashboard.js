import React, { useEffect } from 'react';
import Navbar from './Navbar';
import EncouragementCards from './EncouragementCards';
import LogForm from './LogForm';
import MetricsTable from './MetricsTable';
import Footer from './Footer'; 
import { theme } from '../styles';
import api from '../services/api';

// Simple, elegant ImageFrame component
const ImageFrame = ({ src, height }) => {
  return (
    <div style={{
      height: height,
      width: '100%',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
      border: `1px solid ${theme.colors.border || '#e0e0e0'}`,
      backgroundColor: '#fff'
    }}>
      <img 
        src={src} 
        alt="Maternity graphic" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }} 
      />
    </div>
  );
};

function Dashboard({ onLogout, logs = [], setLogs }) {
  useEffect(() => {
    api.get('tracker/logs/')
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));
  }, [setLogs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.colors.background }}>
      <Navbar onLogout={onLogout} />
      
      <main style={{ flex: 1, padding: '40px', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ color: theme.colors.primary, marginBottom: '30px' }}>Welcome Back, Mom-to-be</h1>

        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
          {/* Left: Your Restored Image Layout using the correct public path string */}
          <div style={{ flex: 1 }}>
            <ImageFrame src="/images/babybump.jpg" height="400px" />
          </div>
          
          {/* Right: Restored Cards Layout */}
          <div style={{ flex: 2 }}>
            <EncouragementCards />
          </div>
        </div>

        {/* Restored Clinical Logs Section */}
        <div style={{ marginTop: '40px', backgroundColor: theme.colors.white, padding: '30px', borderRadius: '15px', border: `1px solid ${theme.colors.border}` }}>
          <h3 style={{ color: theme.colors.primary, marginBottom: '20px' }}>Clinical Health Logs</h3>
          <LogForm onAddLog={(newLog) => setLogs([newLog, ...logs])} />
          <MetricsTable logs={logs} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;