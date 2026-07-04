import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles';
import { clinicalAPI, trackerAPI } from '../services/api';
import EncouragementCards from './EncouragementCards'; // Linked directly on login mount sequence

function PatientDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const token = localStorage.getItem('access_token');

  const [appointments, setAppointments] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPatientData = useCallback(async () => {
    try {
      setLoading(true);
      const [aptData, logsData] = await Promise.all([
        clinicalAPI.getAppointments(),
        trackerAPI.getHealthLogs()
      ]);
      setAppointments(aptData || []);
      setHealthLogs(logsData || []);
    } catch (err) {
      console.error('Error fetching personal timeline metrics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Rigid Authentication Safeguard Check
    if (!token) {
      navigate('/login', { 
        state: { from: '/dashboard', message: 'Please sign in to access your secure patient portal.' } 
      });
      return;
    }
    loadPatientData();
  }, [token, loadPatientData, navigate]);

  // COMBINE AND CHRONOLOGICALLY SORT DATA FOR A TRUE UNIFIED TIMELINE
  const getUnifiedTimeline = () => {
    const serializedEvents = [
      ...appointments.map(apt => ({
        ...apt,
        timelineType: 'APPOINTMENT',
        // Fallback chain ensuring valid ISO timestamp comparisons
        sortDate: new Date(apt.date || Date.now())
      })),
      ...healthLogs.map(log => ({
        ...log,
        timelineType: 'VITALS',
        sortDate: new Date(log.recorded_at || log.created_at || Date.now())
      }))
    ];

    // Newest entries at the top of the stream
    return serializedEvents.sort((a, b) => b.sortDate - a.sortDate);
  };

  const timelineEvents = getUnifiedTimeline();

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '85vh', padding: '40px 20px', fontFamily: 'sans-serif', color: 'var(--text-color)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Dynamic Patient Portal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid var(--border-color)`, paddingBottom: '20px', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ color: theme.colors.primary, margin: 0, fontFamily: 'Georgia, serif', fontSize: '2.2rem' }}>
              🤰 My Pregnancy Journey, {username}
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: '5px 0 0 0', fontSize: '14px' }}>Secured Patient Portal Health Workspace</p>
          </div>
          <button onClick={() => navigate('/tracker')} style={{ ...theme.loginButton, width: 'auto', padding: '12px 24px', backgroundColor: theme.colors.secondary, margin: 0 }}>
            ➕ Log Vitals & Request Appointment
          </button>
        </div>

        {/* ENCOURAGEMENT CARDS WIDGET (Instantly rendered on login entry verification) */}
        <div style={{ marginBottom: '40px' }}>
          <EncouragementCards />
        </div>

        {/* Unified Metrics Interactive Timeline Container */}
        <div style={{ backgroundColor: 'var(--card-bg, #fff)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: theme.colors.primary, marginTop: 0, fontFamily: 'Georgia, serif', fontSize: '1.5rem' }}>
            📖 My Pregnancy Timeline
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '25px' }}>
            Your logged symptoms, structured metrics, and upcoming provider checkups mapped into a singular clinical narrative.
          </p>
          
          <div style={{ borderLeft: `3px solid var(--border-color, #e2e8f0)`, marginLeft: '10px', paddingLeft: '25px', position: 'relative' }}>
            
            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic' }}>Loading clinical records stream...</p>
            ) : timelineEvents.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>You haven't logged any vitals metrics or historical appointments yet.</p>
            ) : (
              timelineEvents.map((event) => {
                const uniqueKey = `${event.timelineType}-${event.id}`;
                
                if (event.timelineType === 'APPOINTMENT') {
                  return (
                    <div key={uniqueKey} style={{ marginBottom: '35px', position: 'relative' }}>
                      {/* Left Dot Indicator Point */}
                      <div style={{ position: 'absolute', width: '11px', height: '11px', borderRadius: '50%', backgroundColor: theme.colors.secondary, left: '-32px', top: '4px', border: '2px solid var(--card-bg, #fff)' }} />
                      
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: theme.colors.secondary, letterSpacing: '0.5px' }}>
                        📅 APPOINTMENT &bull; {event.status?.toUpperCase() || 'SCHEDULED'}
                      </span>
                      <div style={{ backgroundColor: 'var(--input-bg, #f8faf8)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                        <strong>Reason:</strong> {event.reason} 
                        {event.date && <div style={{ marginTop: '5px', fontSize: '13px', color: 'var(--text-color)' }}>🗓️ Scheduled: <strong>{event.date}</strong> at <strong>{event.time || 'TBD'}</strong></div>} 
                        {event.doctor_username && <div style={{ marginTop: '3px', fontSize: '13px', color: 'var(--text-muted)' }}>🩺 Staff Clinician: {event.doctor_username}</div>}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={uniqueKey} style={{ marginBottom: '35px', position: 'relative' }}>
                      {/* Left Dot Indicator Point */}
                      <div style={{ position: 'absolute', width: '11px', height: '11px', borderRadius: '50%', backgroundColor: 'var(--text-muted, #718096)', left: '-32px', top: '4px', border: '2px solid var(--card-bg, #fff)' }} />
                      
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                        ❤️ VITALS RECORDED &bull; {event.sortDate.toLocaleDateString()}
                      </span>
                      <div style={{ backgroundColor: 'var(--input-bg, #f8faf8)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '8px', fontSize: '14px' }}>
                          <span>⚖️ Weight: <strong>{event.weight_kg || event.weight || '—'} kg</strong></span>
                          <span>🩸 BP: <strong style={{ fontFamily: 'monospace' }}>{event.blood_pressure || event.bp || '—'}</strong></span>
                          <span>👣 Fetal Kicks: <strong>{event.fetal_kick_count || event.kick_count || 'N/A'}</strong></span>
                        </div>
                        <div style={{ fontSize: '13px', borderTop: '1px dashed var(--border-color)', paddingTop: '6px' }}>
                          <strong>Symptoms:</strong> <span style={{ color: event.symptoms ? 'var(--text-color)' : 'var(--text-muted)' }}>{event.symptoms || 'None reported'}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default PatientDashboard;  