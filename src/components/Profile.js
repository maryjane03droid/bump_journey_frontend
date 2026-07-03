import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { theme } from '../styles';

function Profile() {
  const userRole = localStorage.getItem('user_role') || 'PATIENT';
  const isPatient = userRole === 'PATIENT';

  // Shared state for both profile types
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    // Patient Fields
    estimated_due_date: '',
    current_week: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    // Professional Fields
    specialization: '',
    clinic_name: '',
    contact_number: '',
    bio: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mapProfileData = (data) => {
    return {
      username: data.username || '',
      email: data.email || '',
      estimated_due_date: data.estimated_due_date || '',
      current_week: data.current_week || '',
      emergency_contact_name: data.emergency_contact_name || '',
      emergency_contact_phone: data.emergency_contact_phone || '',
      specialization: data.specialization || '',
      clinic_name: data.clinic_name || '',
      contact_number: data.contact_number || '',
      bio: data.bio || ''
    };
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await authAPI.getProfile();
        setProfile(mapProfileData(data));
      } catch (err) {
        setError('Failed to fetch profile details. Please check authorization token.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const updatedData = await authAPI.updateProfile(profile);
      setSuccess('Profile updated successfully!');
      setProfile(mapProfileData(updatedData));
    } catch (err) {
      setError('Failed to update profile. Please check validation rules.');
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: theme.colors.primary }}>Loading Profile Data...</div>;
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', padding: '40px 20px', backgroundColor: theme.colors.background }}>
      <div style={{ ...theme.loginContainer, maxWidth: '600px', width: '100%' }}>
        
        <h2 style={{ ...theme.loginTitle, color: '#2e7d32' }}>
          {isPatient ? 'My Pregnancy Profile' : 'Professional Dashboard Profile'}
        </h2>
        
        {error && <p style={{ color: '#e53e3e', backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px' }}>{error}</p>}
        {success && <p style={{ color: '#3b5334', backgroundColor: '#f1f6f0', border: '1px solid #c2d6bd', padding: '10px', borderRadius: '4px' }}>✓ {success}</p>}

        <form onSubmit={handleSubmit}>
          {/* SHARED FIELDS (Everyone sees these) */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Username</label>
              <input type="text" value={profile.username} disabled style={{ ...theme.input, backgroundColor: '#e9ecef', cursor: 'not-allowed' }} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Email Address</label>
              <input type="email" value={profile.email} disabled style={{ ...theme.input, backgroundColor: '#e9ecef', cursor: 'not-allowed' }} />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />

          {/* CONDITIONAL RENDERING: Patient vs Professional */}
          {isPatient ? (
            <>
              {/* PATIENT ONLY FIELDS */}
              <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Current Week of Pregnancy</label>
                <input type="number" name="current_week" value={profile.current_week} onChange={handleChange} style={theme.input} placeholder="e.g., 12" />
              </div>
              <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Estimated Due Date (EDD)</label>
                <input type="date" name="estimated_due_date" value={profile.estimated_due_date} onChange={handleChange} style={theme.input} />
              </div>
              <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Emergency Contact Name</label>
                <input type="text" name="emergency_contact_name" value={profile.emergency_contact_name} onChange={handleChange} style={theme.input} placeholder="e.g., John Doe" />
              </div>
              <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Emergency Contact Phone</label>
                <input type="text" name="emergency_contact_phone" value={profile.emergency_contact_phone} onChange={handleChange} style={theme.input} placeholder="e.g., 555-123-4567" />
              </div>
            </>
          ) : (
            <>
              {/* PROFESSIONAL ONLY FIELDS */}
              <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Role / Classification</label>
                <input type="text" value={userRole} disabled style={{ ...theme.input, backgroundColor: '#e9ecef', cursor: 'not-allowed' }} />
              </div>
              <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Medical Specialization</label>
                <input type="text" name="specialization" value={profile.specialization} onChange={handleChange} style={theme.input} placeholder="e.g., Obstetrics, Midwifery" />
              </div>
              <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Clinic or Hospital Affiliation</label>
                <input type="text" name="clinic_name" value={profile.clinic_name} onChange={handleChange} style={theme.input} placeholder="e.g., City General Hospital" />
              </div>
              <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Professional Contact Number</label>
                <input type="text" name="contact_number" value={profile.contact_number} onChange={handleChange} style={theme.input} placeholder="e.g., 555-987-6543" />
              </div>
              <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Short Professional Bio</label>
                <textarea name="bio" value={profile.bio} onChange={handleChange} style={{ ...theme.input, minHeight: '80px', resize: 'vertical' }} placeholder="Brief overview of your practice and experience..."></textarea>
              </div>
            </>
          )}

          <button type="submit" style={{ ...theme.loginButton, marginTop: '20px', width: '100%', borderRadius: '30px' }}>
            Save Updates
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;