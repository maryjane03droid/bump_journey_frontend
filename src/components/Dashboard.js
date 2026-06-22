import React, { useEffect } from 'react';
import Navbar from './Navbar';
import EncouragementCards from './EncouragementCards';
import LogForm from './LogForm';
import MetricsTable from './MetricsTable';
import { theme } from '../styles';
import api from '../services/api';

function Dashboard({ onLogout, logs, setLogs }) {
  useEffect(() => {
    api.get('tracker/logs/').then(res => setLogs(res.data)).catch(err => console.error(err));
  }, [setLogs]);

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
      <Navbar onLogout={onLogout} />
      <main style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: theme.colors.primary }}>Welcome Back, Mom-to-be</h1>
        <EncouragementCards />
        <div style={{ marginTop: '40px', backgroundColor: theme.colors.white, padding: '30px', borderRadius: '15px' }}>
          <h3 style={{ color: theme.colors.primary }}>Clinical Health Logs</h3>
          <LogForm onAddLog={(newLog) => setLogs([newLog, ...logs])} />
          <MetricsTable logs={logs} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;