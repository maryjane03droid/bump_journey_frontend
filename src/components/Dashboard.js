import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles';

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role') || 'PATIENT';
  const username = localStorage.getItem('username') || 'User';
  const isStaff = ['DOCTOR', 'MIDWIFE', 'NURSE'].includes(userRole);

  const [appointments, setAppointments] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [staffNotes, setStaffNotes] = useState([]);
  const [activePatientProfile, setActivePatientProfile] = useState(null);
  const [newClinicalNote, setNewClinicalNote] = useState('');

  const loadDashboardData = useCallback(async () => {
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      // 1. Fetch Appointments from Staff App
      const aptRes = await fetch('http://127.0.0.1:8000/api/staff/appointments/', { headers });
      if (aptRes.ok) setAppointments(await aptRes.json());

      // 2. Fetch Health Logs from Tracker App
      const logsRes = await fetch('http://127.0.0.1:8000/api/tracker/health-logs/', { headers });
      if (logsRes.ok) setHealthLogs(await logsRes.json());

      // 3. Fetch Staff Notes from Staff App
      if (isStaff) {
        const notesRes = await fetch('http://127.0.0.1:8000/api/staff/notes/', { headers });
        if (notesRes.ok) setStaffNotes(await notesRes.json());
      }
    } catch (err) {
      console.error('Data fetch error:', err);
    }
  }, [token, isStaff]);

  useEffect(() => {
    if (token) loadDashboardData();
  }, [token, loadDashboardData]);

  // Action: Clinician claims appointment and schedules it
  const handleApproveAndSchedule = async (appointmentId) => {
    const scheduledDate = prompt(`Enter Scheduled Date (YYYY-MM-DD):`);
    const scheduledTime = prompt(`Enter Scheduled Time (HH:MM):`);

    if (!scheduledDate || !scheduledTime) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/staff/appointments/${appointmentId}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: scheduledDate, time: scheduledTime, status: 'SCHEDULED' })
      });

      if (response.ok) {
        alert('Appointment successfully approved and claimed under your name.');
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Action: Pull detailed chart for a specific patient
  const handleViewPatientProfile = (patientId, patientName) => {
    setActivePatientProfile({
      id: patientId,
      username: patientName,
      logs: healthLogs.filter(log => log.patient === patientId),
      appointments: appointments.filter(apt => apt.patient === patientId),
      notes: staffNotes.filter(note => note.patient === patientId)
    });
  };

  // Action: Submit Attending Clinical Note
  const handleAddNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newClinicalNote.trim() || !activePatientProfile) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/staff/notes/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient: activePatientProfile.id, notes: newClinicalNote })
      });

      if (response.ok) {
        alert('Clinical note signed and saved.');
        setNewClinicalNote('');
        loadDashboardData();
        // Optimistically update the active profile view
        const savedNote = await response.json();
        setActivePatientProfile(prev => ({ ...prev, notes: [savedNote, ...prev.notes] }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '85vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${theme.colors.border}`, paddingBottom: '20px', marginBottom: '30px' }}>
          <div>
            <h1 style={{ color: theme.colors.primary, margin: 0, fontFamily: 'Georgia, serif' }}>
              {isStaff ? `🩺 Clinical Portal: Welcome, ${username}` : `🤰 My Pregnancy Journey: ${username}`}
            </h1>
          </div>
          {!isStaff && (
            <button onClick={() => navigate('/tracker')} style={{ ...theme.loginButton, width: 'auto', padding: '10px 20px', backgroundColor: theme.colors.secondary }}>
              ➕ Log Vitals & Request Appointment
            </button>
          )}
        </div>

        {/* STAFF VIEW */}
        {isStaff ? (
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            
            {/* Triage Queue Left Panel */}
            <div style={{ flex: '1 1 450px' }}>
              <h3 style={{ color: theme.colors.primary }}>📂 Triage & Appointment Roster</h3>
              {appointments.length === 0 ? <p style={{ color: '#718096' }}>No active cases.</p> : appointments.map(apt => (
                <div key={apt.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', borderLeft: `6px solid ${apt.status === 'REQUESTED' ? '#e53e3e' : theme.colors.secondary}`, marginBottom: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '18px' }}>{apt.patient_username}</strong>
                    <span style={{ backgroundColor: apt.status === 'REQUESTED' ? '#fff5f5' : '#f0fff4', color: apt.status === 'REQUESTED' ? '#c53030' : '#2f855a', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      {apt.status}
                    </span>
                  </div>
                  <p style={{ margin: '8px 0', fontSize: '14px' }}>📋 <strong>Reason:</strong> {apt.reason || 'Not specified'}</p>
                  {apt.doctor_username && <p style={{ margin: '4px 0', fontSize: '14px', color: '#4a5568' }}>👨‍⚕️ <strong>Assigned to:</strong> {apt.doctor_username}</p>}
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button onClick={() => handleViewPatientProfile(apt.patient, apt.patient_username)} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: theme.colors.primary, border: `1px solid ${theme.colors.primary}`, borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                      View Full Clinical Profile
                    </button>
                    {apt.status === 'REQUESTED' && (
                      <button onClick={() => handleApproveAndSchedule(apt.id)} style={{ padding: '6px 12px', backgroundColor: theme.colors.secondary, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                        Approve & Schedule
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Profile Chart Right Panel */}
            <div style={{ flex: '2 1 600px' }}>
              {activePatientProfile ? (
                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #edf2f7', paddingBottom: '15px', marginBottom: '20px' }}>
                    <h2 style={{ color: theme.colors.primary, margin: 0 }}>📋 Chart: {activePatientProfile.username}</h2>
                    <button onClick={() => setActivePatientProfile(null)} style={{ border: 'none', backgroundColor: '#e2e8f0', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>Close Chart</button>
                  </div>

                  {/* Submit Note Form */}
                  <form onSubmit={handleAddNoteSubmit} style={{ marginBottom: '25px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', fontSize: '14px' }}>Add Clinical Note (Attending Signature)</label>
                    <textarea value={newClinicalNote} onChange={(e) => setNewClinicalNote(e.target.value)} style={{ ...theme.input, height: '80px', marginBottom: '10px' }} required />
                    <button type="submit" style={{ ...theme.loginButton, width: 'auto', padding: '8px 20px' }}>Sign & Save Note</button>
                  </form>

                  {/* Historical Vitals Table */}
                  <h4 style={{ color: theme.colors.primary, marginBottom: '10px' }}>📉 Vitals Logs (from Tracker App)</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f7fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '8px' }}>Date</th>
                        <th style={{ padding: '8px' }}>Weight</th>
                        <th style={{ padding: '8px' }}>BP</th>
                        <th style={{ padding: '8px' }}>Kicks</th>
                        <th style={{ padding: '8px' }}>Symptoms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePatientProfile.logs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                          <td style={{ padding: '8px' }}>{new Date(log.recorded_at).toLocaleDateString()}</td>
                          <td style={{ padding: '8px' }}>{log.weight_kg} kg</td>
                          <td style={{ padding: '8px' }}>{log.blood_pressure}</td>
                          <td style={{ padding: '8px' }}>{log.fetal_kick_count || '-'}</td>
                          <td style={{ padding: '8px', color: log.urgent_attention_requested ? 'red' : 'inherit' }}>{log.symptoms}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Staff Notes History */}
                  <h4 style={{ color: theme.colors.primary, marginBottom: '10px' }}>📝 Attending Notes (from Staff App)</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activePatientProfile.notes.map((note) => (
                      <div key={note.id} style={{ backgroundColor: '#f7fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><em>"{note.notes}"</em></p>
                        <small style={{ color: '#718096' }}>Signed: <strong>{note.author_username}</strong> on {new Date(note.created_at).toLocaleDateString()}</small>
                      </div>
                    ))}
                  </div>

                </div>
              ) : (
                <div style={{ border: '2px dashed #cbd5e0', padding: '40px', textAlign: 'center', borderRadius: '12px', color: '#718096', marginTop: '45px' }}>
                  Select a patient to view their complete maternity history.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* PATIENT VIEW */
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: theme.colors.primary, marginTop: 0 }}>📖 My Pregnancy Timeline</h3>
            <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '20px' }}>Your logged symptoms and appointments, safe in one place.</p>
            
            <div style={{ borderLeft: `3px solid ${theme.colors.border}`, marginLeft: '15px', paddingLeft: '20px' }}>
              {appointments.map((apt) => (
                <div key={apt.id} style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: theme.colors.secondary }}>APPOINTMENT — {apt.status}</span>
                  <div style={{ backgroundColor: '#f7fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                    <strong>Reason:</strong> {apt.reason} {apt.date && `| Scheduled on ${apt.date} at ${apt.time}`} {apt.doctor_username && `(Assigned Doctor: ${apt.doctor_username})`}
                  </div>
                </div>
              ))}
              {healthLogs.map((log) => (
                <div key={log.id} style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096' }}>VITALS LOGGED — {new Date(log.recorded_at).toLocaleDateString()}</span>
                  <div style={{ backgroundColor: '#f7fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                    Weight: {log.weight_kg}kg | BP: {log.blood_pressure} | Kicks: {log.fetal_kick_count || 'N/A'} <br />
                    <strong>Symptoms:</strong> {log.symptoms || 'None'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;