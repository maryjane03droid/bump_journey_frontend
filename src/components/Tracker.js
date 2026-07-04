import React, { useState, useEffect } from 'react';
import { theme } from '../styles';
import { trackerAPI } from '../services/api';

function Tracker() {
  // Form State
  const [weight, setWeight] = useState('');
  const [bp, setBp] = useState('');
  const [kicks, setKicks] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [agenda, setAgenda] = useState('Routine Prenatal Checkup');

  // CRUD State
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null); // Tracks if we are Updating instead of Creating

  // READ: Fetch logs when the component mounts
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await trackerAPI.getHealthLogs();
      setLogs(data);
      setError('');
    } catch (err) {
      setError('Failed to load health history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // CREATE & UPDATE: Handle the form submission
  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const logData = {
      weight: parseFloat(weight),
      blood_pressure: bp,
      kick_count: parseInt(kicks) || 0,
      symptoms: symptoms
    };

    try {
      if (editingId) {
        // UPDATE existing log
        await trackerAPI.updateHealthLog(editingId, logData);
        setEditingId(null);
      } else {
        // CREATE new log
        await trackerAPI.createHealthLog(logData);
      }
      
      // Clear form and refresh data
      setWeight('');
      setBp('');
      setKicks('');
      setSymptoms('');
      fetchLogs(); 
    } catch (err) {
      setError('Failed to save the health log. Check your connection.');
    }
  };

  // Populate form for UPDATE
  const handleEdit = (log) => {
    setEditingId(log.id);
    setWeight(log.weight);
    setBp(log.blood_pressure);
    setKicks(log.kick_count);
    setSymptoms(log.symptoms);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to the form
  };

  // DELETE: Remove a log
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await trackerAPI.deleteHealthLog(id);
        fetchLogs(); // Refresh the list
      } catch (err) {
        setError('Failed to delete the log.');
      }
    }
  };

  // Mock appointment submit (You can wire this to clinicalAPI later)
  const handleAptSubmit = (e) => {
    e.preventDefault();
    alert(`Appointment for ${agenda} Requested!`);
  };

  return (
    <div style={{ backgroundColor: theme.colors.background, padding: '40px 20px', minHeight: '80vh', color: 'var(--text-color)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          {/* Form Section (Create / Update) */}
          <div style={{ flex: '1 1 400px', backgroundColor: theme.colors.white, padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: theme.colors.primary, marginTop: 0 }}>
              {editingId ? '✏️ Edit Health Log' : '📝 Daily Health Log'}
            </h2>
            <form onSubmit={handleLogSubmit}>
              <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} style={theme.input} required />
              <input type="text" placeholder="Blood Pressure (e.g., 120/80)" value={bp} onChange={e => setBp(e.target.value)} style={theme.input} required />
              <input type="number" placeholder="Fetal Kick Count" value={kicks} onChange={e => setKicks(e.target.value)} style={theme.input} />
              <textarea placeholder="Any symptoms today?" value={symptoms} onChange={e => setSymptoms(e.target.value)} style={{ ...theme.input, height: '80px' }} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ ...theme.loginButton, flex: 1 }}>
                  {editingId ? 'Update Log' : 'Save Log'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => setEditingId(null)} style={{ ...theme.loginButton, backgroundColor: '#6c757d', flex: 1 }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Appointment Request Form */}
          <div style={{ flex: '1 1 400px', backgroundColor: theme.colors.white, padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: theme.colors.primary, marginTop: 0 }}>📅 Request Visit</h2>
            <form onSubmit={handleAptSubmit}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px', color: 'var(--text-color)' }}>Clinical Agenda</label>
              <select value={agenda} onChange={e => setAgenda(e.target.value)} style={theme.input}>
                <option value="Dating Ultrasound">Dating Ultrasound (Weeks 8-12)</option>
                <option value="Anatomy Scan">Anatomy Scan (Weeks 18-22)</option>
                <option value="Routine Prenatal Checkup">Routine Prenatal Checkup</option>
                <option value="Glucose Screening">Glucose Screening</option>
              </select>
              <button type="submit" style={{ ...theme.loginButton, backgroundColor: theme.colors.secondary }}>Request Appointment</button>
            </form>
          </div>
        </div>

        {/* History Section (Read / Delete / Trigger Edit) */}
        <div style={{ backgroundColor: theme.colors.white, padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: theme.colors.primary, marginTop: 0 }}>📊 Your Health History</h2>
          
          {loading ? (
            <p>Loading your logs...</p>
          ) : logs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No health logs recorded yet. Start by adding one above!</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${theme.colors.border}`, color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px' }}>Date</th>
                    <th style={{ padding: '10px' }}>Weight (kg)</th>
                    <th style={{ padding: '10px' }}>BP</th>
                    <th style={{ padding: '10px' }}>Kicks</th>
                    <th style={{ padding: '10px' }}>Symptoms</th>
                    <th style={{ padding: '10px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} style={{ borderBottom: `1px solid var(--border-color)` }}>
                      {/* Assuming your backend returns a 'created_at' or 'date' field */}
                      <td style={{ padding: '10px' }}>{new Date(log.created_at || log.date).toLocaleDateString()}</td>
                      <td style={{ padding: '10px' }}>{log.weight}</td>
                      <td style={{ padding: '10px' }}>{log.blood_pressure}</td>
                      <td style={{ padding: '10px' }}>{log.kick_count}</td>
                      <td style={{ padding: '10px' }}>{log.symptoms || 'None'}</td>
                      <td style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleEdit(log)} style={{ background: 'transparent', border: 'none', color: theme.colors.secondary, cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
                        <button onClick={() => handleDelete(log.id)} style={{ background: 'transparent', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Tracker;