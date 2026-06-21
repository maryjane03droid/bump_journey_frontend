import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import LogForm from './LogForm';
import MetricsTable from './MetricsTable';
import { theme } from '../styles';

function Dashboard({ onLogout }) {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('bumpJourneyLogs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bumpJourneyLogs', JSON.stringify(logs));
  }, [logs]);

  return (
    <div style={{ backgroundColor: theme.colors.secondary, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: theme.spacing.padding, maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ color: theme.colors.primary }}>Bump Journey Dashboard</h1>
          <div style={{ 
            backgroundColor: theme.colors.white, 
            padding: '30px', 
            borderRadius: '20px', 
            boxShadow: '0 4px 12px rgba(45, 106, 79, 0.1)',
            border: `2px solid ${theme.colors.accent}` 
          }}>
            <h2 style={{ color: theme.colors.primary }}>Welcome Back, Mom-to-be</h2>
            <p>Your Bump Journey health metrics are the key to a safe and guided pregnancy. Track your daily vital signs below.</p>
          </div>
        </header>

        <section style={{ backgroundColor: theme.colors.white, padding: '25px', borderRadius: '20px' }}>
          <h3 style={{ color: theme.colors.primary }}>Clinical Health Logs</h3>
          <p>Record your weight and blood pressure to keep your care team informed.</p>
          <LogForm onAddLog={(newLog) => setLogs([newLog, ...logs])} />
          <MetricsTable logs={logs} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;