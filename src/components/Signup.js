import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../styles';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'PATIENT' 
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed. Please check your details.');
      }

      // UX LOGIC: Different routing and messaging based on role
      if (formData.role === 'PATIENT') {
        setSuccessMessage('Account registered successfully! Redirecting to your profile...');
        setTimeout(() => navigate('/profile'), 2500);
      } else {
        setSuccessMessage('Registration received. Please wait for a System Administrator to approve your professional account before logging in.');
        setTimeout(() => navigate('/login'), 4500);
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8faf8' }}>
        <div style={{ ...theme.loginContainer, width: '100%', maxWidth: '450px', boxShadow: 'none', backgroundColor: 'transparent' }}>
          <h2 style={{ ...theme.loginTitle, fontSize: '2.5rem', color: '#2e7d32', textAlign: 'left', marginBottom: '30px' }}>
            Create an Account
          </h2>
          
          {error && <p style={{ color: '#e53e3e', backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px' }}>{error}</p>}
          
          {successMessage && (
            <div style={{ backgroundColor: '#f1f6f0', color: '#3b5334', border: '1px solid #c2d6bd', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', fontWeight: '500', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} style={{...theme.input, padding: '15px'}} required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} style={{...theme.input, padding: '15px'}} required />
            <input type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleChange} style={{...theme.input, padding: '15px'}} required />
            
            <label style={{ display: 'block', textAlign: 'left', fontWeight: 'bold', marginBottom: '5px', color: theme.colors.primary, fontSize: '14px' }}>
              Account Classification
            </label>
            <select name="role" value={formData.role} onChange={handleChange} style={{ ...theme.input, backgroundColor: '#fff', padding: '15px' }}>
              <option value="PATIENT">🤰 Expectant Mother (Patient)</option>
              <option value="DOCTOR">🩺 Medical Doctor (Staff)</option>
              <option value="MIDWIFE">🤱 Certified Midwife (Staff)</option>
              <option value="NURSE">⚕️ Registered Nurse (Staff)</option>
            </select>

            <button type="submit" style={{ ...theme.loginButton, width: '100%', padding: '15px', borderRadius: '30px', fontSize: '1.1rem', marginTop: '10px' }}>
              Create Account
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'left' }}>
            Already registered? <Link to="/login" style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>Log In</Link>
          </p>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <img src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=2000&auto=format&fit=crop" alt="Happy pregnant mother smiling" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
}

export default Signup;