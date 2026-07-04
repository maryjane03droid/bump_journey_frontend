import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { theme } from '../styles';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic frontend validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      // Assuming your authAPI has a register/signup endpoint
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // On successful registration, redirect to login with a success message
      navigate('/login', { 
        state: { message: 'Account created successfully! Please log in.' } 
      });
      
    } catch (err) {
      // Extract backend error messages if available
      setError(err.response?.data?.detail || err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable input styling matching the screenshot's light-blue/gray tint
  const inputStyle = {
    width: '100%', 
    padding: '15px', 
    borderRadius: '8px', 
    border: '1px solid var(--border-color, #ccc)', 
    backgroundColor: '#eff4fa', // Matches the slight blue tint from your screenshot
    color: 'var(--text-color, #333)', 
    boxSizing: 'border-box', 
    outline: 'none', 
    transition: 'border-color 0.2s',
    fontSize: '15px'
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw', 
      margin: 0, 
      padding: 0, 
      backgroundColor: 'var(--bg-color, #fdfdf9)', // Warmer off-white matching screenshots
      color: 'var(--text-color, #333)', 
      flexWrap: 'wrap' 
    }}>
      
      {/* LEFT PANEL: Registration Form */}
      <div style={{ 
        flex: '1 1 500px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '40px',
        boxSizing: 'border-box'
      }}>
        
        <div style={{ width: '100%', maxWidth: '420px' }}>
          
          <h2 style={{ fontSize: '2.5rem', color: theme.colors.primary, textAlign: 'left', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>
            Join BumpJourney
          </h2>
          <p style={{ color: 'var(--text-muted, #666)', marginBottom: '30px', fontSize: '1rem' }}>
            Create your secure clinical workspace to track your maternal health.
          </p>
          
          {/* Error Banner matching Screenshot #3 */}
          {error && (
            <div style={{ 
              color: '#c53030', 
              backgroundColor: '#fff5f5', 
              padding: '12px', 
              borderRadius: '4px', 
              marginBottom: '20px', 
              fontSize: '15px', 
              textAlign: 'center',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <input 
                type="text" 
                name="username"
                placeholder="Choose a username" 
                value={formData.username} 
                onChange={handleChange} 
                style={inputStyle} 
                required 
              />
            </div>

            <div>
              <input 
                type="email" 
                name="email"
                placeholder="Email address (e.g. mastertee@gmail.com)" 
                value={formData.email} 
                onChange={handleChange} 
                style={inputStyle} 
                required 
              />
            </div>

            <div>
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange} 
                style={inputStyle} 
                required 
                minLength="8"
              />
            </div>

            <div>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm Password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                style={inputStyle} 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '15px', 
                borderRadius: '8px', // Match the squarer corners of your login button
                backgroundColor: theme.colors.primary, 
                color: 'white', 
                border: 'none', 
                fontSize: '1.1rem', 
                fontWeight: 'bold', 
                cursor: isLoading ? 'not-allowed' : 'pointer', 
                marginTop: '10px', 
                opacity: isLoading ? 0.7 : 1,
                transition: 'opacity 0.2s'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p style={{ marginTop: '30px', fontSize: '15px', textAlign: 'center' }}>
            Already have an account? <Link to="/login" style={{ color: theme.colors.primary, fontWeight: 'bold', textDecoration: 'none' }}>Log In</Link>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Splash Graphic */}
      <div style={{ 
        flex: '1 1 500px', 
        position: 'relative',
        minHeight: '400px',
        backgroundColor: '#e8f5e9' // Soft green fallback
      }}>
        <img 
          src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2000&auto=format&fit=crop" 
          alt="Happy pregnant woman looking at ultrasound" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(27, 67, 50, 0.3)' }}></div>
      </div>

    </div>
  );
}

export default Signup;