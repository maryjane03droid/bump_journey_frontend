import React, { useState, useEffect, useCallback } from 'react';
import { theme } from '../styles';
import api, { clinicalAPI, trackerAPI } from '../services/api';

function StaffDashboard() {
  const username = localStorage.getItem('username') || 'Clinician';
  const token = localStorage.getItem('access_token');

  const [appointments, setAppointments] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [staffNotes, setStaffNotes] = useState([]);
  
  // Track selected patient identity reference instead of raw stale data copies
  const [activePatient, setActivePatient] = useState(null); // { id, username }
  const [newClinicalNote, setNewClinicalNote] = useState('');

  const loadDashboardData = useCallback(async () => {
    try {
      const [aptData, logsData, notesRes] = await Promise.all([
        clinicalAPI.getAppointments(),
        trackerAPI.getHealthLogs(),
        api.get('staff/notes/')
      ]);
      
      setAppointments(aptData);
      setHealthLogs(logsData);
      setStaffNotes(notesRes.data);
    } catch (err) {
      console.error('Clinical portal data sync error:', err);
    }
  }, []);

  useEffect(() => {
    if (token) loadDashboardData();
  }, [token, loadDashboardData]);

  // Derived State Engine: recalculates automatically on array changes
  const activePatientLogs = activePatient 
    ? healthLogs.filter(log => log.patient === activePatient.id) 
    : [];
  const activePatientNotes = activePatient 
    ? staffNotes.filter(note => note.patient === activePatient.id) 
    : [];

  const handleApproveAndSchedule = async (appointmentId) => {
    const scheduledDate = prompt(`Enter Scheduled Date (YYYY-MM-DD):`);
    const scheduledTime = prompt(`Enter Scheduled Time (HH:MM):`);

    if (!scheduledDate || !scheduledTime) return;

    try {
      const response = await api.patch(`staff/appointments/${appointmentId}/`, { 
        date: scheduledDate, 
        time: scheduledTime, 
        status: 'SCHEDULED' 
      });

      if (response.status === 200 || response.status === 204) {
        alert('Appointment successfully scheduled and assigned.');
        loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to schedule appointment:', err);
      alert('Error scheduling appointment.');
    }
  };

  const handleAddNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newClinicalNote.trim() || !activePatient) return;

    try {
      await clinicalAPI.createNote({ 
        patient: activePatient.id, 
        notes: newClinicalNote 
      });

      alert('Clinical note signed and saved to chart.');
      setNewClinicalNote('');
      loadDashboardData(); 
    } catch (err) {
      console.error('Failed to save chart note:', err);
    }
  };

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '85vh', padding: '40px 20px', fontFamily: 'sans-serif', color: 'var(--text-color)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Layout */}
        <div style={{ borderBottom: `2px solid var(--border-color)`, paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ color: theme.colors.primary, margin: 0, fontFamily: 'Georgia, serif' }}>
            🩺 Clinical Portal: Welcome, {username}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          {/* Triage Queue Left Panel */}
          <div style={{ flex: '1 1 450px' }}>
            <h3 style={{ color: theme.colors.primary }}>📂 Triage & Appointment Roster</h3>
            {appointments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No active cases in queue.</p>
            ) : appointments.map(apt => (
              <div key={apt.id} style={{ backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '8px', borderLeft: `6px solid ${apt.status === 'REQUESTED' ? '#e53e3e' : 'var(--secondary-color)'}`, marginBottom: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '18px' }}>{apt.patient_username}</strong>
                  <span style={{ backgroundColor: apt.status === 'REQUESTED' ? 'rgba(229, 62, 62, 0.1)' : 'rgba(47, 133, 90, 0.1)', color: apt.status === 'REQUESTED' ? '#e53e3e' : '#2f855a', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                    {apt.status}
                  </span>
                </div>
                <p style={{ margin: '8px 0', fontSize: '14px' }}>📋 <strong>Reason:</strong> {apt.reason || 'Not specified'}</p>
                {apt.doctor_username && <p style={{ margin: '4px 0', fontSize: '14px', color: 'var(--text-muted)' }}>👨‍⚕️ <strong>Assigned to:</strong> {apt.doctor_username}</p>}
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button onClick={() => setActivePatient({ id: apt.patient, username: apt.patient_username })} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: theme.colors.primary, border: `1px solid ${theme.colors.primary}`, borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
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

          {/* Chart Workspace Right Panel */}
          <div style={{ flex: '2 1 600px' }}>
            {activePatient ? (
              <div style={{ backgroundColor: 'var(--card-bg)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
                  <h2 style={{ color: theme.colors.primary, margin: 0 }}>📋 Chart: {activePatient.username}</h2>
                  <button onClick={() => setActivePatient(null)} style={{ border: 'none', backgroundColor: 'var(--border-color)', color: 'var(--text-color)', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>Close Chart</button>
                </div>

                {/* Form Notes Signature Entry */}
                <form onSubmit={handleAddNoteSubmit} style={{ marginBottom: '25px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', fontSize: '14px' }}>Add Clinical Note (Attending Signature)</label>
                  <textarea value={newClinicalNote} onChange={(e) => setNewClinicalNote(e.target.value)} style={{ ...theme.input, height: '80px', marginBottom: '10px' }} required />
                  <button type="submit" style={{ ...theme.loginButton, width: 'auto', padding: '8px 20px' }}>Sign & Save Note</button>
                </form>

                {/* Historical Metrics Table */}
                <h4 style={{ color: theme.colors.primary, marginBottom: '10px' }}>📉 Vitals Logs (from Tracker App)</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--input-bg)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                        <th style={{ padding: '8px' }}>Date</th>
                        <th style={{ padding: '8px' }}>Weight</th>
                        <th style={{ padding: '8px' }}>BP</th>
                        <th style={{ padding: '8px' }}>Kicks</th>
                        <th style={{ padding: '8px' }}>Symptoms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePatientLogs.length > 0 ? activePatientLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '8px' }}>{new Date(log.recorded_at || log.created_at).toLocaleDateString()}</td>
                          <td style={{ padding: '8px' }}>{log.weight_kg || log.weight} kg</td>
                          <td style={{ padding: '8px' }}>{log.blood_pressure}</td>
                          <td style={{ padding: '8px' }}>{log.fetal_kick_count || log.kick_count || '-'}</td>
                          <td style={{ padding: '8px', color: log.urgent_attention_requested ? '#e53e3e' : 'inherit' }}>{log.symptoms}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" style={{ padding: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>No metrics logged yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Historical Attending Notes */}
                <h4 style={{ color: theme.colors.primary, marginBottom: '10px' }}>📝 Attending Notes History</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activePatientNotes.length > 0 ? activePatientNotes.map((note) => (
                    <div key={note.id} style={{ backgroundColor: 'var(--input-bg)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><em>"{note.notes}"</em></p>
                      <small style={{ color: 'var(--text-muted)' }}>Signed: <strong>{note.author_username}</strong> on {new Date(note.created_at).toLocaleDateString()}</small>
                    </div>
                  )) : (
                    <p style={{ color: 'var(--text-muted)' }}>No historical profile annotations exist.</p>
                  )}
                </div>

              </div>
            ) : (
              <div style={{ border: '2px dashed var(--border-color)', padding: '40px', textAlign: 'center', borderRadius: '12px', color: 'var(--text-muted)', marginTop: '45px' }}>
                Select a patient file to review complete metrics history.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;