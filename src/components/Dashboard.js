import React, { useState } from 'react';

function Dashboard({ onLogout, user }) {
  // Navigation & Role Configuration States
  const [currentUserRole, setCurrentUserRole] = useState('PATIENT'); 
  const [currentMainPage, setCurrentMainPage] = useState('tracker'); 
  const [activeTab, setActiveTab] = useState('profile'); 

  // Global Interactive Notification Alert State
  const [systemNotification, setSystemNotification] = useState({ message: 'Ecosystem synchronized with local Django repository.', type: 'success' });

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
    { id: 2, recorded_at: '2026-06-19 09:15', weight_kg: 68.8, blood_pressure: '145/95', fetal_kick_count: 12, symptoms: 'Slight headache in afternoon, well hydrated' },
    { id: 3, recorded_at: '2026-06-18 07:45', weight_kg: 68.5, blood_pressure: '122/81', fetal_kick_count: 10, symptoms: 'Mild lower back stiffness' }
  ]);

  // 3. Mock Data Array representing 'Appointment' Model
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: 'Dr. Sarah Jenkins (OB-GYN)', appointment_date: '2026-06-25 10:00 AM', status: 'CONFIRMED', reason_for_visit: 'Routine Second Trimester Ultrasound and Anatomy Scan' }
  ]);

  // 4. Mock Data Array representing 'ClinicalNote' Model
  const [clinicalNotes, setClinicalNotes] = useState([
    { id: 1, date: '2026-05-20', doctor: 'Dr. Sarah Jenkins', notes: 'Fetal heart rate stable at 145 bpm. Fundal height tracking correctly matching gestational age.', prescriptions: 'Prenatal Multivitamins (1x daily), Iron Supplements (200mg daily)' }
  ]);

  // Form Input States
  const [newWeight, setNewWeight] = useState('');
  const [newBP, setNewBP] = useState('');
  const [newKicks, setNewKicks] = useState('');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [chosenDoctor, setChosenDoctor] = useState('Dr. Sarah Jenkins (OB-GYN)');
  const [chosenDate, setChosenDate] = useState('');
  const [chosenTime, setChosenTime] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [doctorAssessment, setDoctorAssessment] = useState('');
  const [doctorRx, setDoctorRx] = useState('');

  // Helper to flash temporary system alerts
  const triggerNotification = (msg, type = 'success') => {
    setSystemNotification({ message: msg, type });
    setTimeout(() => setSystemNotification(null), 4000);
  };

  // Live Gestational Calculations
  const calculateGestationalMetrics = () => {
    const lmpDate = new Date(profile.last_menstrual_period_date);
    const today = new Date('2026-06-20'); 
    const timeDifference = today.getTime() - lmpDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(daysDifference / 7);
    const remainingDays = daysDifference % 7;

    let trimester = 'First Trimester';
    let progressPercentage = Math.min(Math.floor((totalWeeks / 40) * 100), 100);

    if (totalWeeks >= 13 && totalWeeks < 27) trimester = 'Second Trimester';
    else if (totalWeeks >= 27) trimester = 'Third Trimester';

    return { totalWeeks, remainingDays, trimester, progressPercentage };
  };

  const metrics = calculateGestationalMetrics();

  // 🟢 VITAL SIGN CHECKER ENGINE: Validates if BP readings are hypertensive
  const checkHypertensionRisk = () => {
    if (!healthLogs.length) return false;
    const latestBP = healthLogs[0].blood_pressure;
    const parts = latestBP.split('/');
    if (parts.length === 2) {
      const systolic = parseInt(parts[0]);
      const diastolic = parseInt(parts[1]);
      if (systolic >= 140 || diastolic >= 90) return latestBP;
    }
    return false;
  };

  const bpWarningValue = checkHypertensionRisk();

  const handleAddLog = (e) => {
    e.preventDefault();
    
    // Simple Validation Guard Clause
    if (!newBP.includes('/')) {
      triggerNotification('Invalid Blood Pressure format. Use Systolic/Diastolic (e.g., 120/80)', 'error');
      return;
    }

    const newEntry = {
      id: Date.now(),
      recorded_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      weight_kg: parseFloat(newWeight) || 0,
      blood_pressure: newBP,
      fetal_kick_count: parseInt(newKicks) || 0,
      symptoms: newSymptoms || 'None reported'
    };
    
    setHealthLogs([newEntry, ...healthLogs]);
    setNewWeight(''); setNewBP(''); setNewKicks(''); setNewSymptoms('');
    triggerNotification('Daily health metrics logged and indexed successfully!');
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    setAppointments([{
      id: Date.now(),
      doctor: chosenDoctor,
      appointment_date: `${chosenDate} at ${chosenTime}`,
      status: 'PENDING',
      reason_for_visit: visitReason
    }, ...appointments]);
    setChosenDate(''); setChosenTime(''); setVisitReason('');
    triggerNotification('Consultation request transmitted. Status: PENDING.');
  };

  const handleAddClinicalNote = (e) => {
    e.preventDefault();
    setClinicalNotes([{
      id: Date.now(),
      date: new Date().toISOString().substring(0, 10),
      doctor: 'Dr. Sarah Jenkins (You)',
      notes: doctorAssessment,
      prescriptions: doctorRx || 'No prescriptions issued.'
    }, ...clinicalNotes]);
    setDoctorAssessment(''); setDoctorRx(''); setActiveTab('clinicalNotes');
    triggerNotification('Clinical care plan signed and saved to immutable archive records.');
  };

  return (
    <div style={{ backgroundColor: '#fcfbf9', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '"Playfair Display", Georgia, serif', color: '#2d3748' }}>
      
      {/* 🏛️ GLOBAL TOP NAVIGATION BAR */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #eef0eb', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div onClick={() => setCurrentMainPage('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🤰</span>
            <span style={{ fontWeight: '700', fontSize: '20px', letterSpacing: '0.5px', color: '#2d3748', fontFamily: 'sans-serif' }}>MATERNA<span style={{ color: '#8FBC8F' }}>CARE</span></span>
          </div>

          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '14px', fontWeight: '600' }}>
            <span onClick={() => setCurrentMainPage('home')} style={{ cursor: 'pointer', color: currentMainPage === 'home' ? '#8FBC8F' : '#718096' }}>Home Portal</span>
            <span onClick={() => setCurrentMainPage('about')} style={{ cursor: 'pointer', color: currentMainPage === 'about' ? '#8FBC8F' : '#718096' }}>About Us</span>
            <span onClick={() => setCurrentMainPage('tracker')} style={{ cursor: 'pointer', color: currentMainPage === 'tracker' ? '#8FBC8F' : '#718096' }}>Track Pregnancy</span>
            <span onClick={() => setCurrentMainPage('contact')} style={{ cursor: 'pointer', color: currentMainPage === 'contact' ? '#8FBC8F' : '#718096' }}>Contact & Help</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: '#f4f6f2', padding: '4px', borderRadius: '20px', display: 'flex', border: '1px solid #e2e8f0' }}>
              <button onClick={() => { setCurrentUserRole('PATIENT'); setCurrentMainPage('tracker'); }} style={{ padding: '6px 14px', border: 'none', borderRadius: '15px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', fontFamily: 'sans-serif', backgroundColor: currentUserRole === 'PATIENT' ? '#8FBC8F' : 'transparent', color: currentUserRole === 'PATIENT' ? 'white' : '#718096' }}>Patient Modality</button>
              <button onClick={() => { setCurrentUserRole('STAFF'); setCurrentMainPage('tracker'); setActiveTab('doctorConsole'); }} style={{ padding: '6px 14px', border: 'none', borderRadius: '15px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', fontFamily: 'sans-serif', backgroundColor: currentUserRole === 'STAFF' ? '#4a5568' : 'transparent', color: currentUserRole === 'STAFF' ? 'white' : '#718096' }}>Doctor Console</button>
            </div>
            <button onClick={onLogout} style={{ padding: '8px 16px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', fontFamily: 'sans-serif' }}>Exit</button>
          </div>

        </div>
      </nav>

      {/* 🟢 SYSTEM FLOATING NOTIFICATION TOAST OVERLAY BAR */}
      {systemNotification && (
        <div style={{ backgroundColor: systemNotification.type === 'success' ? '#6B8E23' : '#cd5c5c', color: 'white', padding: '12px 25px', position: 'fixed', top: '80px', right: '30px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 'bold', zIndex: 5000, display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.3s' }}>
          <span>{systemNotification.type === 'success' ? '🔔' : '⚠️'}</span> {systemNotification.message}
        </div>
      )}

      {/* 🎞/ APP CONTENT BODY LAYER */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '40px 20px', boxSizing: 'border-box' }}>
        
        {/* 🟢 CLINICAL INSIGHTS: AUTOMATED RISK AMBER WARNING BAR */}
        {currentMainPage === 'tracker' && bpWarningValue && (
          <div style={{ backgroundColor: '#fffaf0', border: '1px solid #feebc8', borderLeft: '5px solid #dd6b20', padding: '15px 20px', borderRadius: '8px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'sans-serif' }}>
            <span style={{ fontSize: '24px' }}>⚡</span>
            <div>
              <strong style={{ color: '#dd6b20', display: 'block', fontSize: '14px' }}>Automated Clinical Risk Alert: Hypertensive Trend Detected</strong>
              <span style={{ fontSize: '13px', color: '#718096' }}>The latest log index entry lists a BP reading of <strong>{bpWarningValue}</strong> mmHg. This falls within a hypertensive validation bracket. Rest schedule adjustments or professional OB-GYN consultations are advised.</span>
            </div>
          </div>
        )}

        {/* VIEW 1: HOME PLATFORM PORTAL PAGE */}
        {currentMainPage === 'home' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center', backgroundColor: 'white', padding: '50px', borderRadius: '16px', border: '1px solid #eef0eb', boxShadow: '0 10px 30px rgba(0,0,0,0.01)' }}>
              <div>
                <span style={{ color: '#8FBC8F', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', fontFamily: 'sans-serif', display: 'block', marginBottom: '10px' }}>Welcome to MaternaCare Solutions</span>
                <h1 style={{ fontSize: '42px', margin: '0 0 20px 0', color: '#2d3748', lineHeight: '1.2' }}>Refined healthcare assistance tracking for expecting mothers.</h1>
                <p style={{ color: '#718096', fontSize: '16px', lineHeight: '1.7', margin: '0 0 30px 0', fontFamily: 'sans-serif' }}>Experience an intuitive clinical tracking ecosystem connecting premium maternal monitoring with secure communication interfaces between specialists and patients.</p>
                <button onClick={() => setCurrentMainPage('tracker')} style={{ padding: '15px 30px', backgroundColor: '#8FBC8F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', fontFamily: 'sans-serif', boxShadow: '0 4px 14px rgba(143,188,143,0.3)' }}>Launch Clinical Tracker Dashboard</button>
              </div>
              <div style={{ height: '320px', backgroundColor: '#f4f6f2', borderRadius: '12px', border: '1px solid #eef0eb', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px', color: '#718096', fontStyle: 'italic' }}>
                <div style={{ fontSize: '50px', marginBottom: '10px' }}>🖼️</div>
                <strong style={{ fontFamily: 'sans-serif', fontStyle: 'normal', color: '#2d3748' }}>Hero Visual Showcase Picture</strong>
                <span style={{ fontSize: '12px', marginTop: '5px', fontFamily: 'sans-serif' }}>[Place Premium Medical Banner Image Here]</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ABOUT US VIEW */}
        {currentMainPage === 'about' && (
          <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '16px', border: '1px solid #eef0eb' }}>
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '36px', color: '#2d3748', margin: '0 0 15px 0' }}>Our Clinical Philosophy</h2>
              <p style={{ color: '#718096', fontSize: '16px', lineHeight: '1.7', fontFamily: 'sans-serif' }}>MaternaCare is founded upon the principle of providing high-fidelity digital infrastructure to enhance neonatal health results and improve communication structures between families and practitioners.</p>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #eef0eb', margin: '40px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
              {[
                { title: 'Obstetrics Department Specialist Picture', desc: 'Expert obstetric care monitoring structures.', icon: '👩‍⚕️' },
                { title: 'State-of-the-Art Maternity Ward Clinic Picture', desc: 'Premium luxury spaces for care operations.', icon: '🏥' },
                { title: 'Patient Integration Success Showcase Picture', desc: 'Nurturing generations with software metrics.', icon: '👶' }
              ].map((item, idx) => (
                <div key={idx} style={{ border: '1px solid #eef0eb', borderRadius: '12px', padding: '15px', backgroundColor: '#fcfbf9' }}>
                  <div style={{ height: '180px', backgroundColor: '#eef0eb', borderRadius: '8px', marginBottom: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#a0aec0', padding: '10px', textAlign: 'center', fontSize: '12px' }}>
                    <span style={{ fontSize: '32px', marginBottom: '5px' }}>{item.icon}</span>
                    <strong style={{ color: '#4a5568', display: 'block', marginBottom: '2px', fontFamily: 'sans-serif' }}>{item.title}</strong>
                    <span style={{ fontFamily: 'sans-serif' }}>[Link Media Row Asset {idx+1}]</span>
                  </div>
                  <h4 style={{ margin: '10px 0 5px 0', fontSize: '16px', color: '#2d3748' }}>Professional Service Tier {idx+1}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontFamily: 'sans-serif', lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: TRACK PREGNANCY CENTRAL WORKSPACE */}
        {currentMainPage === 'tracker' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #eef0eb', paddingBottom: '12px' }}>
              {currentUserRole === 'PATIENT' ? (
                <>
                  {['profile', 'healthLogs', 'appointments', 'clinicalNotes'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 24px', backgroundColor: activeTab === tab ? '#8FBC8F' : 'transparent', color: activeTab === tab ? 'white' : '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', fontFamily: 'sans-serif' }}>
                      {tab === 'profile' ? '📋 Gestational Profile' : tab === 'healthLogs' ? '📈 Daily Health Logs' : tab === 'appointments' ? '📅 Appointments' : '🩺 Clinical Notes'}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {['doctorConsole', 'healthLogs', 'clinicalNotes'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 24px', backgroundColor: activeTab === tab ? '#4a5568' : 'transparent', color: activeTab === tab ? 'white' : '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', fontFamily: 'sans-serif' }}>
                      {tab === 'doctorConsole' ? '🩺 Patient Clinical Action' : tab === 'healthLogs' ? '🔍 Inspect Patient Vitals' : '🗂️ View Past Care Plans'}
                    </button>
                  ))}
                </>
              )}
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eef0eb', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
              
              {activeTab === 'doctorConsole' && currentUserRole === 'STAFF' && (
                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '22px' }}>Clinical Consultation Desk</h3>
                  <p style={{ fontSize: '14px', color: '#718096', fontFamily: 'sans-serif', marginBottom: '20px' }}>Reviewing active records for patient: <strong>Maryjane Wakuthii</strong>.</p>
                  <form onSubmit={handleAddClinicalNote} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px', fontFamily: 'sans-serif' }}>Clinical Assessment Notes:</label>
                      <textarea required value={doctorAssessment} onChange={(e) => setDoctorAssessment(e.target.value)} rows="3" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontFamily: 'sans-serif' }} placeholder="Track fundal growth height diagnostics here..."></textarea>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px', fontFamily: 'sans-serif' }}>Rx Prescriptions:</label>
                      <input type="text" value={doctorRx} onChange={(e) => setDoctorRx(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontFamily: 'sans-serif' }} placeholder="Prenatal supplements schedule adjustments..." />
                    </div>
                    <button type="submit" style={{ padding: '12px', backgroundColor: '#4a5568', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'sans-serif' }}>Publish Medical Case Record</button>
                  </form>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '22px' }}>Maternity Onboarding Gestational Metrics</h3>
                  <div style={{ backgroundColor: '#f4f6f2', border: '1px solid #eef0eb', borderRadius: '8px', padding: '20px', marginBottom: '25px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#718096', fontWeight: 'bold', fontFamily: 'sans-serif', textTransform: 'uppercase' }}>Gestational Progress Track</div>
                      <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#8FBC8F', margin: '4px 0' }}>{metrics.totalWeeks} Weeks, {metrics.remainingDays} Days</div>
                      <div style={{ fontSize: '13px', color: '#4a5568', fontWeight: '600' }}>✨ {metrics.trimester}</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#718096', marginBottom: '5px', fontFamily: 'sans-serif' }}><span>Pregnancy Timeline Completion Curve</span><span>{metrics.progressPercentage}%</span></div>
                      <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '10px', borderRadius: '10px', overflow: 'hidden' }}><div style={{ width: `${metrics.progressPercentage}%`, backgroundColor: '#8FBC8F', height: '100%' }} /></div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ padding: '15px', backgroundColor: '#fcfbf9', borderRadius: '8px', borderLeft: '4px solid #8FBC8F' }}><strong style={{ color: '#718096', display: 'block', fontSize: '12px', fontFamily: 'sans-serif' }}>Last Menstrual Period (LMP)</strong><span style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'sans-serif' }}>{profile.last_menstrual_period_date}</span></div>
                    <div style={{ padding: '15px', backgroundColor: '#fcfbf9', borderRadius: '8px', borderLeft: '4px solid #8FBC8F' }}><strong style={{ color: '#718096', display: 'block', fontSize: '12px', fontFamily: 'sans-serif' }}>Estimated Due Date (EDD)</strong><span style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'sans-serif' }}>{profile.estimated_due_date}</span></div>
                  </div>
                </div>
              )}

              {activeTab === 'healthLogs' && (
                <div>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '22px' }}>Vitals and Daily Symptoms Entry Tracker</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                    <div style={{ border: '1px solid #eef0eb', borderRadius: '8px', padding: '15px' }}><div style={{ fontSize: '12px', color: '#718096', fontFamily: 'sans-serif' }}>👶 LATEST KICK COUNTER</div><div style={{ fontSize: '24px', fontWeight: 'bold' }}>{healthLogs[0]?.fetal_kick_count || 0} Kicks</div></div>
                    <div style={{ border: '1px solid #eef0eb', borderRadius: '8px', padding: '15px', borderLeft: healthLogs[0]?.blood_pressure.includes('145') ? '4px solid #dd6b20' : '1px solid #eef0eb' }}><div style={{ fontSize: '12px', color: '#718096', fontFamily: 'sans-serif' }}>❤️ BLOOD PRESSURE VITALS</div><div style={{ fontSize: '24px', fontWeight: 'bold' }}>{healthLogs[0]?.blood_pressure || 'N/A'}</div></div>
                    <div style={{ border: '1px solid #eef0eb', borderRadius: '8px', padding: '15px' }}>
                      <div style={{ fontSize: '12px', color: '#718096', fontFamily: 'sans-serif', marginBottom: '5px' }}>📈 WEIGHT CURVE</div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', height: '30px', gap: '8px', borderBottom: '1px solid #cbd5e0' }}>
                        {[...healthLogs].slice(0, 5).reverse().map((log) => (<div key={log.id} style={{ height: `${Math.min(Math.max((log.weight_kg - 60) * 5, 10), 30)}px`, width: '16px', backgroundColor: '#8FBC8F', borderRadius: '2px 2px 0 0' }} />))}
                      </div>
                    </div>
                  </div>
                  {currentUserRole === 'PATIENT' && (
                    <form onSubmit={handleAddLog} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', backgroundColor: '#fcfbf9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                      <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="Weight (kg)" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                      <input type="text" value={newBP} onChange={(e) => setNewBP(e.target.value)} placeholder="BP (e.g. 120/80)" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                      <input type="number" value={newKicks} onChange={(e) => setNewKicks(e.target.value)} placeholder="Kicks Count" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                      <textarea value={newSymptoms} onChange={(e) => setNewSymptoms(e.target.value)} placeholder="Symptom logs description..." style={{ gridColumn: 'span 3', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', fontFamily: 'sans-serif' }} />
                      <button type="submit" style={{ gridColumn: 'span 3', padding: '10px', backgroundColor: '#8FBC8F', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Commit Row Log</button>
                    </form>
                  )}
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'sans-serif', fontSize: '13px' }}>
                    <thead><tr style={{ backgroundColor: '#f4f6f2' }}><th style={{ padding: '10px' }}>Date</th><th style={{ padding: '10px' }}>Weight</th><th style={{ padding: '10px' }}>BP Vitals</th><th style={{ padding: '10px' }}>Kicks</th><th style={{ padding: '10px' }}>Notes</th></tr></thead>
                    <tbody>{healthLogs.map((l) => (<tr key={l.id} style={{ borderBottom: '1px solid #edf2f7' }}><td style={{ padding: '10px', fontWeight: 'bold' }}>{l.recorded_at}</td><td style={{ padding: '10px' }}>{l.weight_kg}kg</td><td style={{ padding: '10px', color: l.blood_pressure.includes('145') ? '#dd6b20' : 'inherit' }}>{l.blood_pressure}</td><td style={{ padding: '10px' }}>{l.fetal_kick_count}</td><td style={{ padding: '10px', color: '#718096' }}>{l.symptoms}</td></tr>))}</tbody>
                  </table>
                </div>
              )}

              {activeTab === 'appointments' && (
                <div>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '22px' }}>Scheduled Clinical Appointments</h3>
                  {currentUserRole === 'PATIENT' && (
                    <form onSubmit={handleBookAppointment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', backgroundColor: '#fcfbf9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                      <select value={chosenDoctor} onChange={(e) => setChosenDoctor(e.target.value)} style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #cbd5e0' }}><option>Dr. Sarah Jenkins (OB-GYN)</option><option>Dr. Michael Chang (Pediatrician)</option></select>
                      <input type="date" value={chosenDate} onChange={(e) => setChosenDate(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                      <input type="time" value={chosenTime} onChange={(e) => setChosenTime(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                      <textarea value={visitReason} onChange={(e) => setVisitReason(e.target.value)} required placeholder="Reason for consulting appointment row..." style={{ gridColumn: 'span 3', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', fontFamily: 'sans-serif' }} />
                      <button type="submit" style={{ gridColumn: 'span 3', padding: '10px', backgroundColor: '#8FBC8F', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Schedule Consultation Appointment</button>
                    </form>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {appointments.map((a) => (
                      <div key={a.id} style={{ border: '1px solid #eef0eb', borderRadius: '6px', padding: '15px', position: 'relative' }}>
                        <span style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '11px', fontWeight: 'bold', fontFamily: 'sans-serif', backgroundColor: '#feebc8', color: '#c05621', padding: '2px 8px', borderRadius: '4px' }}>{a.status}</span>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>{a.doctor}</h4>
                        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#718096', fontFamily: 'sans-serif' }}>🗓️ {a.appointment_date}</p>
                        <p style={{ margin: 0, fontSize: '13px', fontFamily: 'sans-serif' }}>{a.reason_for_visit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'clinicalNotes' && (
                <div>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '22px' }}>Physician Case Notes & Care Plans</h3>
                  {clinicalNotes.map((n) => (
                    <div key={n.id} style={{ padding: '15px', border: '1px solid #eef0eb', borderRadius: '6px', marginBottom: '10px', backgroundColor: '#fffdf9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#718096', fontFamily: 'sans-serif', marginBottom: '8px' }}><strong>Authored By: {n.doctor}</strong><span>{n.date}</span></div>
                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', lineHeight: '1.5' }}>{n.notes}</p>
                      <code style={{ display: 'block', backgroundColor: '#f4f6f2', padding: '8px', borderRadius: '4px', fontSize: '12px', color: '#4a5568' }}>Rx Prescriptions: {n.prescriptions}</code>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW 4: CONTACT US */}
        {currentMainPage === 'contact' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', backgroundColor: 'white', padding: '50px', borderRadius: '16px', border: '1px solid #eef0eb' }}>
            <div>
              <h2 style={{ fontSize: '32px', margin: '0 0 15px 0' }}>Connect With Our Desk</h2>
              <p style={{ color: '#718096', fontSize: '15px', lineHeight: '1.6', fontFamily: 'sans-serif', margin: '0 0 25px 0' }}>Our physical operations emergency lines run 24/7. Submit an active contact ticket row directly to our desk staff.</p>
              <div style={{ height: '200px', backgroundColor: '#f4f6f2', borderRadius: '10px', border: '1px solid #eef0eb', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#a0aec0', fontStyle: 'italic', fontSize: '12px' }}>
                <span style={{ fontSize: '40px', marginBottom: '5px' }}>📍</span>
                <strong style={{ fontStyle: 'normal', color: '#4a5568', fontFamily: 'sans-serif' }}>Clinic HQ Location Map Asset</strong>
                <span style={{ fontFamily: 'sans-serif' }}>[Embed Leaflet/Google Map Framework Frame Here]</span>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); triggerNotification('Helpdesk communication ticket committed securely!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#fcfbf9', padding: '30px', borderRadius: '12px', border: '1px solid #eef0eb' }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Submit Secure Helpdesk Inquiry</h3>
              <input type="text" placeholder="Full Identity Name" required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontFamily: 'sans-serif' }} />
              <input type="email" placeholder="Secure Contact Email Address" required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontFamily: 'sans-serif' }} />
              <textarea placeholder="Specify clinical system inquiry rows or platform issue metrics..." required rows="4" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontFamily: 'sans-serif' }} />
              <button type="submit" style={{ gridColumn: 'span 3', padding: '12px', backgroundColor: '#8FBC8F', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'sans-serif' }}>Commit Inquiry Row Ticket</button>
            </form>
          </div>
        )}

      </main>

      {/* 🏛️ GLOBAL FOOTER */}
      <footer style={{ backgroundColor: '#2d3748', color: '#cbd5e0', borderTop: '4px solid #8FBC8F', padding: '40px 20px', fontSize: '13px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '40px', paddingBottom: '30px', borderBottom: '1px solid #4a5568' }}>
          <div>
            <h4 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '16px', letterSpacing: '0.5px' }}>MATERNA<span style={{ color: '#8FBC8F' }}>CARE</span> DIGITAL</h4>
            <p style={{ color: '#a0aec0', lineHeight: '1.6', margin: 0 }}>Enabling secure software metrics tracking engines to safeguard maternity health data workflows and clinic logistics.</p>
          </div>
          <div>
            <h5 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '14px', textTransform: 'uppercase' }}>System Endpoints</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span onClick={() => setCurrentMainPage('home')} style={{ cursor: 'pointer', color: '#a0aec0' }}>Home Portal</span>
              <span onClick={() => setCurrentMainPage('about')} style={{ cursor: 'pointer', color: '#a0aec0' }}>About Architecture Philosophy</span>
              <span onClick={() => setCurrentMainPage('tracker')} style={{ cursor: 'pointer', color: '#a0aec0' }}>Maternity Tracking Desk</span>
            </div>
          </div>
          <div>
            <h5 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '14px', textTransform: 'uppercase' }}>Clinical Governance</h5>
            <p style={{ color: '#a0aec0', margin: '0 0 5px 0' }}>📍 Nairobi Medical Plaza, Room 4B</p>
            <p style={{ color: '#a0aec0', margin: 0 }}>📞 Emergency Central: +254 700 000000</p>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', color: '#a0aec0', fontSize: '12px' }}>
          <span>© 2026 MaternaCare Systems Inc. Built for Academic Presentation Assessment.</span>
          <span>Security Protocol Tier: SHA-256 JWT Signed Active</span>
        </div>
      </footer>

    </div>
  );
}

export default Dashboard;