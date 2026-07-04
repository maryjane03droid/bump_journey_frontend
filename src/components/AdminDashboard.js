import React from 'react';
import { theme } from '../styles';

function AdminDashboard() {
  const adminName = localStorage.getItem('username') || 'Admin';

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8faf8', minHeight: '80vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#2e7d32', marginBottom: '10px' }}>System Administration</h1>
        <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>
          Welcome back, {adminName}. Manage platform users and staff approvals here.
        </p>

        {/* STAT CARDS */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: 0, color: '#555', fontSize: '14px' }}>Pending Staff Approvals</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e53e3e', margin: '10px 0 0 0' }}>3</p>
          </div>
          <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: 0, color: '#555', fontSize: '14px' }}>Active Patients</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2e7d32', margin: '10px 0 0 0' }}>142</p>
          </div>
          <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: 0, color: '#555', fontSize: '14px' }}>Active Staff</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2b6cb0', margin: '10px 0 0 0' }}>18</p>
          </div>
        </div>

        {/* PENDING APPROVALS TABLE */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
            Action Required: Staff Approvals
          </h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', color: '#555' }}>
                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Username</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Requested Role</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy Data - Wire this up to your backend later */}
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>dr_smith</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>smith@hospital.com</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><span style={{ backgroundColor: '#ebf8fa', color: '#319795', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>DOCTOR</span></td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', gap: '10px' }}>
                  <button style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Approve</button>
                  <button style={{ backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Deny</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;