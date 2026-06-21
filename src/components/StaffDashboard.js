// src/components/StaffDashboard.js
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { theme } from '../styles';

function StaffDashboard({ onLogout }) {
  const [allLogs, setAllLogs] = useState([]);

  // Fetch all patient logs from your API
  useEffect(() => {
    fetch('/api/patient-logs/') // Replace with your Django API endpoint
      .then(res => res.json())
      .then(data => setAllLogs(data))
      .catch(err => console.error("Error fetching logs:", err));
  }, []);

  return (
    <div style={{ padding: theme.spacing.padding }}>
      <Navbar onLogout={onLogout} />
      <h1 style={{ color: theme.colors.primary }}>Staff Clinical Dashboard</h1>
      <p>Monitor patient vitals and health trends.</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: theme.colors.secondary }}>
            <th style={{ padding: '12px' }}>Patient Name</th>
            <th style={{ padding: '12px' }}>Date</th>
            <th style={{ padding: '12px' }}>Weight</th>
            <th style={{ padding: '12px' }}>Blood Pressure</th>
          </tr>
        </thead>
        <tbody>
          {allLogs.map((log) => (
            <tr key={log.id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
              <td style={{ padding: '12px' }}>{log.patient_name}</td>
              <td style={{ padding: '12px' }}>{log.date}</td>
              <td style={{ padding: '12px' }}>{log.weight} kg</td>
              <td style={{ padding: '12px' }}>{log.bp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffDashboard;