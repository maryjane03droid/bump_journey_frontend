import React from 'react';
import { theme } from '../styles';

function MetricsTable({ logs = [] }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: '20px', borderRadius: '8px', border: '1px solid var(--border-color, #e2e8f0)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left', backgroundColor: 'var(--card-bg, #fff)' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--input-bg, #f7fafc)', borderBottom: `2px solid var(--border-color, #e2e8f0)` }}>
            <th style={{ padding: '12px 16px', color: theme.colors.primary, fontWeight: 'bold' }}>Date</th>
            <th style={{ padding: '12px 16px', color: theme.colors.primary, fontWeight: 'bold' }}>Weight</th>
            <th style={{ padding: '12px 16px', color: theme.colors.primary, fontWeight: 'bold' }}>Blood Pressure</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted, #718096)', italic: 'true' }}>
                No vitals metrics recorded yet.
              </td>
            </tr>
          ) : (
            logs.map((log) => {
              // Fallback chain to find a genuinely unique key for React's reconciliation engine
              const uniqueKey = log.id || log.recorded_at || log.date;
              
              // Handle date string formatting safely
              const formattedDate = log.date || (log.recorded_at ? new Date(log.recorded_at).toLocaleDateString() : 'N/A');
              const weightVal = log.weight_kg || log.weight;
              const bpVal = log.blood_pressure || log.bp;

              return (
                <tr 
                  key={uniqueKey} 
                  style={{ borderBottom: '1px solid var(--border-color, #edf2f7)', transition: 'background-color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--input-bg, #f7fafc)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>{formattedDate}</td>
                  <td style={{ padding: '12px 16px' }}>{weightVal ? `${weightVal} kg` : '—'}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '15px' }}>{bpVal || '—'}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MetricsTable;