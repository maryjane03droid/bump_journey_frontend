import React, { useState, useEffect } from 'react';
import { theme } from '../styles';

const Tracker = () => {
  // Load from LocalStorage on mount
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('maternaLogs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [weight, setWeight] = useState('');

  // Persist to LocalStorage whenever logs change
  useEffect(() => {
    localStorage.setItem('maternaLogs', JSON.stringify(logs));
  }, [logs]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!weight.trim()) {
      alert("Please enter a valid weight!");
      return;
    }
    const newEntry = { 
      id: Date.now(), 
      date: new Date().toLocaleDateString(), 
      weight: `${weight}kg`, 
      bp: '120/80' 
    };
    setLogs([newEntry, ...logs]);
    setWeight('');
  };

  return (
    <div style={{ padding: theme.spacing.padding }}>
      <h3>Clinical Health Log</h3>
      <form onSubmit={handleSave} style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Weight (kg)" 
          value={weight} 
          onChange={(e) => setWeight(e.target.value)} 
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" style={{ backgroundColor: theme.colors.primary, border: 'none', padding: '8px 16px', color: 'white', cursor: 'pointer' }}>
          Log Data
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: `2px solid ${theme.colors.border}` }}>
            <th>Date</th><th>Weight</th><th>BP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
              <td>{log.date}</td><td>{log.weight}</td><td>{log.bp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tracker;