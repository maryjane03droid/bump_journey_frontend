import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { theme } from '../styles';

function StaffDashboard({ onLogout }) {
  // Mock data for presentation
  const patients = ['Anny', 'Mery', 'Joy', 'Sarah', 'Lucy'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.colors.background }}>
      <Navbar onLogout={onLogout} />
      
      <main style={{ flex: 1, padding: '40px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ color: theme.colors.primary }}>Staff Clinical Overview</h1>
        
        <div style={{ backgroundColor: theme.colors.white, padding: '30px', borderRadius: '15px', border: `1px solid ${theme.colors.border}` }}>
          <h3>Patient Records</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${theme.colors.border}` }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Patient Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Last Update</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((name, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '12px' }}>{name}</td>
                  <td style={{ padding: '12px' }}>2026-06-23</td>
                  <td style={{ padding: '12px' }}>
                    <button style={{ backgroundColor: theme.colors.primary, color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>View Logs</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default StaffDashboard;