import React, { useState } from 'react';

function Dashboard({ onLogout, user }) {
  // Navigation & Role Configuration States
  const [currentUserRole, setCurrentUserRole] = useState('PATIENT'); // Switch between PATIENT and STAFF/DOCTOR
  const [activeTab, setActiveTab] = useState('healthLogs');

  // 1. Mock Data representing 'PregnancyProfile' Model
  const [profile, setProfile] = useState({
    last_menstrual_period_date: '2026-01-15',
    estimated_due_date: '2026-10-22',
    blood_group: 'O-Positive',
    medical_history_notes: 'No historical chronic conditions. Patient reports occasional early morning nausea.'
  });

  // 2. Mock Data Array representing 'HealthLog' Model
  const [healthLogs, setHealthLogs] = useState([
    { id: 1, recorded_at: '2026-06-20 08:30', weight_kg: 69.2, blood_pressure: '120/80', fetal_kick_count: 14, symptoms: 'Feeling energetic, baby highly active' },
    { id: 2, recorded_at: '2026-06-19 09:15', weight_kg: 68.8, blood_pressure: '118/79', fetal_kick_count: 12, symptoms: 'Slight headache in afternoon, well hydrated' },
    { id: 3, recorded_at: '2026-06-18 07:45', weight_kg: 68.5, blood_pressure: '122/81', fetal_kick_count: 10, symptoms: 'Mild lower back stiffness' }
  ]);

  // 3. Mock Data Array representing 'Appointment' Model
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: 'Dr. Sarah Jenkins (OB-GYY)', appointment_date: '2026-06-25 10:00 AM', status: 'CONFIRMED', reason_for_visit: 'Routine Second Trimester Ultrasound and Anatomy Scan' }
  ]);

  // 4. Mock Data Array representing 'ClinicalNote' Model
  const [clinicalNotes, setClinicalNotes] = useState([
    { id: 1, date: '2026-05-20', doctor: 'Dr. Sarah Jenkins', notes: 'Fetal heart rate stable at 145 bpm. Fundal height tracking correctly matching gestational age.', prescriptions: 'Prenatal Multivitamins (1x daily), Iron Supplements (200mg daily)' }
  ]);

  // Patient Input Form State
  const [newWeight, setNewWeight] = useState('');
  const [newBP, setNewBP] = useState('');
  const [newKicks, setNewKicks] = useState('');
  const [newSymptoms, setNewSymptoms] = useState('');

  // Doctor/Staff Interface Input Form State
  const [doctorAssessment, setDoctorAssessment] = useState('');
  const [doctorRx, setDoctorRx] = useState('');

  const handleAddLog = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      recorded_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      weight_kg: parseFloat(newWeight) || 0,
      blood_pressure: newBP || 'N/A',
      fetal_kick_count: parseInt(newKicks) || 0,
      symptoms: newSymptoms || 'None reported'
    };
    setHealthLogs([newEntry, ...healthLogs]);
    setNewWeight('');
    setNewBP('');
    setNewKicks('');
    setNewSymptoms('');
  };

  const handleAddClinicalNote = (e) => {
    e.preventDefault();
    const newNote = {
      id: Date.now(),
      date: new Date().toISOString().substring(0, 10),
      doctor: 'Dr. Sarah Jenkins (You)',
      notes: doctorAssessment,
      prescriptions: doctorRx || 'No prescriptions issued.'
    };
    setClinicalNotes([newNote, ...clinicalNotes]);
    setDoctorAssessment('');
    setDoctorRx('');
    setActiveTab('clinicalNotes'); // Automatically redirect to notes viewport
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* App Header Container */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '25px' }}>
        <div>
          <h1 style={{ color: '#2d3748', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🤰</span> Maternity Management System
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>
            User Entity: <strong style={{ color: '#2d3748' }}>{user?.username || 'maryjane'}</strong> | Current Active Identity Mode: <span style={{ backgroundColor: currentUserRole === 'PATIENT' ? '#ebf8ff' : '#feebc8', color: currentUserRole === 'PATIENT' ? '#2b6cb0' : '#c05621', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>{currentUserRole}</span>
          </p>
        </div>
        
        {/* Presentation Dynamic Demonstration Switcher Panel */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#f7fafc', padding: '6px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', gap: '5px' }}>
            <button onClick={() => { setCurrentUserRole('PATIENT'); setActiveTab('healthLogs'); }} style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', backgroundColor: currentUserRole === 'PATIENT' ? '#8FBC8F' : 'transparent', color: currentUserRole === 'PATIENT' ? 'white' : '#718096' }}>Patient View</button>
            <button onClick={() => { setCurrentUserRole('STAFF'); setActiveTab('doctorConsole'); }} style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', backgroundColor: currentUserRole === 'STAFF' ? '#4a5568' : 'transparent', color: currentUserRole === 'STAFF' ? 'white' : '#718096' }}>Doctor Console</button>
          </div>
          <button onClick={onLogout} style={{ padding: '10px 16px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            Exit
          </button>
        </div>
      </header>

      {/* Dynamic Tab Navigation Menu */}
      <nav style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #edf2f7', paddingBottom: '10px' }}>
        {currentUserRole === 'PATIENT' ? (
          <>
            {['profile', 'healthLogs', 'appointments', 'clinicalNotes'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 24px', backgroundColor: activeTab === tab ? '#8FBC8F' : 'transparent', color: activeTab === tab ? 'white' : '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                {tab === 'profile' ? '📋 Gestational Profile' : tab === 'healthLogs' ? '📈 Daily Health Logs' : tab === 'appointments' ? '📅 Appointments' : '🩺 Clinical Notes'}
              </button>
            ))}
          </>
        ) : (
          <>
            {['doctorConsole', 'healthLogs', 'clinicalNotes'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 24px', backgroundColor: activeTab === tab ? '#4a5568' : 'transparent', color: activeTab === tab ? 'white' : '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                {tab === 'doctorConsole' ? '🩺 Patient Clinical Action' : tab === 'healthLogs' ? '🔍 Inspect Patient Vitals' : '🗂️ View Past Care Plans'}
              </button>
            ))}
          </>
        )}
      </nav>

      {/* Main Panel View Layout */}
      <section style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        
        {/* DOCTOR EXCLUSIVE INTERFACE: CLINICAL NOTE CREATOR MODEL */}
        {activeTab === 'doctorConsole' && currentUserRole === 'STAFF' && (
          <div>
            <h2 style={{ color: '#2d3748', marginTop: 0, borderBottom: '1px solid #edf2f7', paddingBottom: '10px' }}>Clinical Consultation Desk</h2>
            <p style={{ fontSize: '14px', color: '#4a5568', margin: '10px 0 20px 0' }}>Reviewing active records for patient: <strong>Maryjane Wakuthii</strong>. Fill out the clinical observations and prescription records below to save a new care plan row.</p>
            
            <form onSubmit={handleAddClinicalNote} style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #edf2f7' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#2d3748' }}>Physician Clinical Assessment Notes:</label>
                <textarea required value={doctorAssessment} onChange={(e) => setDoctorAssessment(e.target.value)} rows="4" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontFamily: 'sans-serif', fontSize: '14px' }} placeholder="Enter heart rate tracking, fundal growth metrics, and physical development diagnostics..."></textarea>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#2d3748' }}>Prescriptions & Recommended Treatment Care Plan (Rx):</label>
                <input type="text" value={doctorRx} onChange={(e) => setDoctorRx(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '14px' }} placeholder="e.g. Calcium carbonate 500mg, rest schedule changes" />
              </div>
              <button type="submit" style={{ padding: '12px', backgroundColor: '#4a5568', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                Authorize and Save Medical Note Rows
              </button>
            </form>
          </div>
        )}

        {/* TAB: PREGNANCY PROFILE VIEW */}
        {activeTab === 'profile' && (
          <div>
            <h2 style={{ color: '#2d3748', marginTop: 0, borderBottom: '1px solid #edf2f7', paddingBottom: '10px' }}>Maternity Onboarding & Gestational Metrics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div style={{ padding: '15px', backgroundColor: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #8FBC8F' }}>
                <strong style={{ color: '#4a5568', display: 'block', fontSize: '13px', textTransform: 'uppercase' }}>Last Menstrual Period (LMP)</strong>
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748' }}>{profile.last_menstrual_period_date}</span>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #48bb78' }}>
                <strong style={{ color: '#4a5568', display: 'block', fontSize: '13px', textTransform: 'uppercase' }}>Calculated Due Date (EDD)</strong>
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#22543d' }}>{profile.estimated_due_date} 🌟</span>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #8FBC8F' }}>
                <strong style={{ color: '#4a5568', display: 'block', fontSize: '13px', textTransform: 'uppercase' }}>Blood Group Classification</strong>
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748' }}>{profile.blood_group}</span>
              </div>
            </div>
            <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
              <strong style={{ color: '#4a5568', display: 'block', marginBottom: '8px' }}>Baseline Medical History & Clinical Notes:</strong>
              <p style={{ margin: 0, color: '#4a5568', lineHeight: '1.6' }}>{profile.medical_history_notes}</p>
            </div>
          </div>
        )}

        {/* TAB: HEALTH METRICS TRACKING LOGS */}
        {activeTab === 'healthLogs' && (
          <div>
            <h2 style={{ color: '#2d3748', marginTop: 0, marginBottom: '20px' }}>Vitals and Daily Symptoms Entry Tracker</h2>
            
            {/* 📈 VISUAL METRICS CARD ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                <div style={{ fontSize: '40px' }}>👶</div>
                <div>
                  <strong style={{ color: '#718096', display: 'block', fontSize: '12px', textTransform: 'uppercase' }}>Fetal Kick Count (Latest)</strong>
                  <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d3748' }}>{healthLogs[0]?.fetal_kick_count || 0}</span>
                  <span style={{ fontSize: '12px', color: '#48bb78', marginLeft: '8px', fontWeight: '600' }}>Active movement</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                <div style={{ fontSize: '40px' }}>❤️</div>
                <div>
                  <strong style={{ color: '#718096', display: 'block', fontSize: '12px', textTransform: 'uppercase' }}>Blood Pressure Vitals</strong>
                  <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d3748' }}>{healthLogs[0]?.blood_pressure || 'N/A'}</span>
                  <span style={{ fontSize: '12px', color: '#3182ce', marginLeft: '8px', fontWeight: '600' }}>Normal range</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                <strong style={{ color: '#718096', display: 'block', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Weight Progress Curve</strong>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '45px', gap: '15px', paddingLeft: '10px', paddingTop: '5px', borderBottom: '2px solid #edf2f7' }}>
                  {[...healthLogs].slice(0, 5).reverse().map((log) => (
                    <div key={log.id} title={`${log.weight_kg} kg`} style={{ height: `${Math.min(Math.max((log.weight_kg - 60) * 8, 15), 45)}px`, width: '25px', backgroundColor: currentUserRole === 'PATIENT' ? '#8FBC8F' : '#4a5568', borderRadius: '4px 4px 0 0' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a0aec0', marginTop: '4px' }}>
                  <span>Earlier</span>
                  <span>Latest ({healthLogs[0]?.weight_kg} kg)</span>
                </div>
              </div>
            </div>

            {/* Input Submission Form - Only rendered when logged as PATIENT */}
            {currentUserRole === 'PATIENT' && (
              <form onSubmit={handleAddLog} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', backgroundColor: '#f7fafc', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #edf2f7' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>Weight (kg):</label>
                  <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} placeholder="e.g. 69.5" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>Blood Pressure:</label>
                  <input type="text" value={newBP} onChange={(e) => setNewBP(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} placeholder="e.g. 120/80" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>Fetal Kick Count:</label>
                  <input type="number" value={newKicks} onChange={(e) => setNewKicks(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} placeholder="e.g. 12" />
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>Daily Symptoms / General Notes:</label>
                  <textarea value={newSymptoms} onChange={(e) => setNewSymptoms(e.target.value)} rows="2" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontFamily: 'sans-serif' }} placeholder="Describe symptoms metrics..."></textarea>
                </div>
                <button type="submit" style={{ gridColumn: 'span 3', padding: '12px', backgroundColor: '#8FBC8F', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                  Commit Daily Entry to Log
                </button>
              </form>
            )}

            {/* Relational Records Data Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#edf2f7', borderBottom: '2px solid #cbd5e0' }}>
                    <th style={{ padding: '12px', color: '#4a5568' }}>Recorded Timestamp</th>
                    <th style={{ padding: '12px', color: '#4a5568' }}>Weight</th>
                    <th style={{ padding: '12px', color: '#4a5568' }}>Blood Pressure</th>
                    <th style={{ padding: '12px', color: '#4a5568' }}>Fetal Kicks</th>
                    <th style={{ padding: '12px', color: '#4a5568' }}>Symptom Manifestations</th>
                  </tr>
                </thead>
                <tbody>
                  {healthLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontWeight: '600', fontSize: '14px' }}>{log.recorded_at}</td>
                      <td style={{ padding: '12px' }}>{log.weight_kg} kg</td>
                      <td style={{ padding: '12px' }}><span style={{ backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace' }}>{log.blood_pressure}</span></td>
                      <td style={{ padding: '12px' }}>{log.fetal_kick_count} kicks</td>
                      <td style={{ padding: '12px', color: '#4a5568', fontSize: '14px' }}>{log.symptoms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: APPOINTMENT SCHEDULING INTERFACE */}
        {activeTab === 'appointments' && (
          <div>
            <h2 style={{ color: '#2d3748', marginTop: 0, borderBottom: '1px solid #edf2f7', paddingBottom: '10px' }}>Scheduled Clinical Appointments</h2>
            {appointments.map((appt) => (
              <div key={appt.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginTop: '15px', position: 'relative', backgroundColor: '#fcfdfc' }}>
                <span style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: '#c6f6d5', color: '#22543d', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                  {appt.status}
                </span>
                <h4 style={{ margin: '0 0 10px 0', color: '#2d3748', fontSize: '16px' }}>{appt.doctor}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4a5568' }}><strong>🗓️ Date/Time:</strong> {appt.appointment_date}</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#718096' }}><strong>Purpose of Visit:</strong> {appt.reason_for_visit}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB: CLINICAL NOTES & PRESCRIPTIONS ARCHIVE */}
        {activeTab === 'clinicalNotes' && (
          <div>
            <h2 style={{ color: '#2d3748', marginTop: 0, borderBottom: '1px solid #edf2f7', paddingBottom: '10px' }}>Physician Case Notes & Care Plans</h2>
            {clinicalNotes.map((note) => (
              <div key={note.id} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', marginTop: '15px', backgroundColor: '#fffaf0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong style={{ color: '#2c5282' }}>Authorized by: {note.doctor}</strong>
                  <span style={{ color: '#718096', fontSize: '13px' }}>{note.date}</span>
                </div>
                <p style={{ margin: '0 0 15px 0', color: '#4a5568', fontSize: '14px', lineHeight: '1.5' }}><strong>Clinical Assessment:</strong> {note.notes}</p>
                <div style={{ borderTop: '1px dashed #cbd5e0', paddingTop: '12px', marginTop: '12px' }}>
                  <strong style={{ color: '#b7791f', display: 'block', fontSize: '13px', textTransform: 'uppercase', marginBottom: '5px' }}>Active Rx Prescriptions:</strong>
                  <code style={{ display: 'block', backgroundColor: '#fefcbf', padding: '10px', borderRadius: '4px', color: '#744210', fontFamily: 'monospace', fontSize: '13px' }}>{note.prescriptions}</code>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>
    </div>
  );
}

export default Dashboard;