import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { theme } from '../styles';

function Profile() {
  const [profileData, setProfileData] = useState({
    full_name: '',
    due_date: '',
    bio: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch the user's profile on load
  useEffect(() => {
    api.get('accounts/profile/')
      .then((res) => {
        setProfileData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // If a 404 is returned, it means they don't have a profile yet. 
        // We leave the form blank so they can create one.
        console.warn("No profile found, ready to create one.");
        setIsEditing(true); // Automatically open the form to create a profile
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      // Use PUT to update an existing profile, or POST if creating for the first time
      await api.put('accounts/profile/', profileData);
      setMessage('Profile saved successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save profile. Please try again.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', color: theme.colors.primary }}>Loading profile...</div>;
  }

  return (
    <div style={{
      minHeight: '80vh',
      backgroundColor: theme.colors.background,
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{
        backgroundColor: theme.colors.white,
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        border: `1px solid ${theme.colors.border}`,
        width: '100%',
        maxWidth: '500px'
      }}>
        <h2 style={{ color: theme.colors.primary, marginBottom: '20px', fontFamily: 'Georgia, serif' }}>
          My Maternity Profile
        </h2>

        {message && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '20px', 
            backgroundColor: message.includes('success') ? '#E8F5E9' : '#FFEBEE',
            color: message.includes('success') ? '#2E7D32' : '#C62828',
            borderRadius: '6px'
          }}>
            {message}
          </div>
        )}

        {!isEditing ? (
          // View Mode
          <div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Full Name:</strong> <span style={{ marginLeft: '10px' }}>{profileData.full_name || 'Not provided'}</span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Expected Due Date:</strong> <span style={{ marginLeft: '10px' }}>{profileData.due_date || 'Not provided'}</span>
            </div>
            <div style={{ marginBottom: '25px' }}>
              <strong>Bio/Notes:</strong> 
              <p style={{ marginTop: '5px', color: '#555' }}>{profileData.bio || 'No notes added yet.'}</p>
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              style={{
                ...theme.loginButton,
                backgroundColor: theme.colors.secondary
              }}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          // Edit / Create Mode
          <form onSubmit={handleSave}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: theme.colors.primary }}>Full Name</label>
            <input 
              type="text" 
              name="full_name" 
              value={profileData.full_name} 
              onChange={handleChange} 
              style={{ ...theme.input, marginBottom: '20px' }} 
              placeholder="e.g., Maryjane Wakuthii"
            />

            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: theme.colors.primary }}>Expected Due Date</label>
            <input 
              type="date" 
              name="due_date" 
              value={profileData.due_date} 
              onChange={handleChange} 
              style={{ ...theme.input, marginBottom: '20px' }} 
            />

            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: theme.colors.primary }}>Pregnancy Notes / Bio</label>
            <textarea 
              name="bio" 
              value={profileData.bio} 
              onChange={handleChange} 
              style={{ ...theme.input, minHeight: '100px', resize: 'vertical', marginBottom: '20px' }} 
              placeholder="How are you feeling about your journey?"
            />

            <button type="submit" style={theme.loginButton}>
              Save Profile
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsEditing(false);
                setMessage('');
              }}
              style={{
                ...theme.loginButton,
                backgroundColor: 'transparent',
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}`,
                marginTop: '10px'
              }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;