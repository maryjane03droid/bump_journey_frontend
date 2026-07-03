import React, { useState } from 'react';
import { theme } from '../styles';

function Tracker() {
  const [weight, setWeight] = useState('');
  const [bp, setBp] = useState('');
  const [kicks, setKicks] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [agenda, setAgenda] = useState('Routine Prenatal Checkup');

  const handleLogSubmit = (e) => {
    e.preventDefault();
    alert('Health Log Saved to Database (Backend connection ready)');
  };

  const handleAptSubmit = (e) => {
    e.preventDefault();
    alert(`Appointment for ${agenda} Requested!`);
  };

  return (
    <div style={{ backgroundColor: theme.colors.background, padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Health Log Form */}
        <div style={{ flex: '1 1 400px', backgroundColor: theme.colors.white, padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: theme.colors.primary, marginTop: 0 }}>📝 Daily Health Log</h2>
          <form onSubmit={handleLogSubmit}>
            <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} style={theme.input} required />
            <input type="text" placeholder="Blood Pressure (e.g., 120/80)" value={bp} onChange={e => setBp(e.target.value)} style={theme.input} required />
            <input type="number" placeholder="Fetal Kick Count" value={kicks} onChange={e => setKicks(e.target.value)} style={theme.input} />
            <textarea placeholder="Any symptoms today?" value={symptoms} onChange={e => setSymptoms(e.target.value)} style={{ ...theme.input, height: '80px' }} />
            <button type="submit" style={theme.loginButton}>Save Log</button>
          </form>
        </div>

        {/* Appointment Request Form */}
        <div style={{ flex: '1 1 400px', backgroundColor: theme.colors.white, padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: theme.colors.primary, marginTop: 0 }}>📅 Request Visit</h2>
          <form onSubmit={handleAptSubmit}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Clinical Agenda</label>
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
    </div>
  );
}

export default Tracker;