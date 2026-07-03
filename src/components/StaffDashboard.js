import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

const StaffDashboard = () => {
    const [pendingAppointments, setPendingAppointments] = useState([]);
    const [urgentLogs, setUrgentLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Ensure your Axios interceptors are attaching the auth token
                const appointmentsRes = await axios.get('http://localhost:8000/api/appointments/'); 
                const logsRes = await axios.get('http://localhost:8000/api/healthlogs/');
                
                // Filter for action items
                const pending = appointmentsRes.data.filter(app => app.status === 'REQUESTED');
                const urgent = logsRes.data.filter(log => log.urgent_attention_requested === true);

                setPendingAppointments(pending);
                setUrgentLogs(urgent);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load clinical data:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading clinical data...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'serif' }}>
            <h1 style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '1rem', color: '#2c3e50' }}>
                Clinical Triage Dashboard
            </h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                
                {/* Column 1: Pending Appointment Requests */}
                <section>
                    <h2 style={{ color: '#34495e' }}>Pending Requests</h2>
                    {pendingAppointments.length === 0 ? (
                        <p style={{ color: '#7f8c8d' }}>No pending appointment requests.</p>
                    ) : (
                        pendingAppointments.map(app => (
                            <div key={app.id} style={{ padding: '1.5rem', border: '1px solid #e0e0e0', marginBottom: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <p><strong>Patient:</strong> {app.patient_username}</p>
                                <p><strong>Reason:</strong> {app.reason || 'Not specified'}</p>
                                <p><strong>Requested On:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                                
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                    <button style={{ padding: '0.5rem 1rem', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Schedule
                                    </button>
                                    <button style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#2c3e50', border: '1px solid #2c3e50', borderRadius: '4px', cursor: 'pointer' }}>
                                        Review & Note
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </section>

                {/* Column 2: Urgent Health Logs */}
                <section>
                    <h2 style={{ color: '#c0392b' }}>Urgent Patient Monitors</h2>
                    {urgentLogs.length === 0 ? (
                        <p style={{ color: '#7f8c8d' }}>All patient vitals are stable.</p>
                    ) : (
                        urgentLogs.map(log => (
                            <div key={log.id} style={{ padding: '1.5rem', border: '1px solid #e74c3c', borderLeft: '6px solid #e74c3c', marginBottom: '1rem', borderRadius: '8px', backgroundColor: '#fdf3f2' }}>
                                <p><strong>Patient:</strong> {log.patient_username}</p>
                                <p><strong>Vitals:</strong> BP {log.blood_pressure} | Weight: {log.weight_kg}kg</p>
                                <p><strong>Symptoms:</strong> {log.symptoms}</p>
                                <p><strong>Logged On:</strong> {new Date(log.recorded_at).toLocaleDateString()}</p>
                                
                                <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Intervene (Schedule Appointment)
                                </button>
                            </div>
                        ))
                    )}
                </section>

            </div>
        </div>
    );
};

export default StaffDashboard;