// src/components/Dashboard.js
import React from 'react';
import Navbar from './Navbar';
import EncouragementCards from './EncouragementCards';
import LogForm from './LogForm';
import MetricsTable from './MetricsTable';
import { theme } from '../styles';

function Dashboard({ onLogout, logs, setLogs }) {
  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
      {/* Pass onLogout to the Navbar */}
      <Navbar onLogout={onLogout} />

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', padding: theme.spacing.padding, maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Left Column: Hero Image */}
        <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src="/mom-to-be.jpg" 
            alt="Bump Journey" 
            style={{ width: '100%', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} 
          />
        </section>

        {/* Right Column: Dashboard Content */}
        <section>
          <h1 style={{ color: theme.colors.primary }}>Bump Journey Dashboard</h1>
          <EncouragementCards />
          
          <div style={{ marginTop: '30px', backgroundColor: theme.colors.white, padding: '20px', borderRadius: '15px' }}>
            <h3>Pregnancy Tracking Metrics Logs</h3>
            <LogForm onAddLog={(newLog) => setLogs([newLog, ...logs])} />
            <MetricsTable logs={logs} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;