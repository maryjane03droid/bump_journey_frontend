import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; 
import { authAPI } from '../services/api';
import { theme } from '../styles';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extract redirection parameters passed from guard checkpoints or the Welcome page
  const fromPath = location.state?.from;
  const interceptMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await authAPI.login(username, password);
      const accessToken = data.access || data.access_token || data.token;
      
      if (!accessToken) {
        throw new Error('Login failed. Please check your username and password.');
      }

      const userRole = data.role || 'PATIENT'; 
      localStorage.setItem('user_role', userRole);
      localStorage.setItem('username', data.username || username);

      // Trigger global authentication state updates across top-level components
      onLogin();
      
      // DEEP-LINKING ROUTING ENGINE: Priority goes to intercepted historical paths, 
      // fallback routes are handled based on clinical user authorization roles.
      if (fromPath) {
        navigate(fromPath);
      } else if (userRole === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (['DOCTOR', 'NURSE', 'MIDWIFE', 'STAFF'].includes(userRole)) {
        navigate('/staff-dashboard');
      } else {
        navigate('/dashboard'); 
      }
      
    } catch (err) {
      setError(err.message || 'Unable to log in. Please try again.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw', 
      margin: 0, 
      padding: 0, 
      backgroundColor: 'var(--bg-color, #f8faf8)', 
      color: 'var(--text-color, #333)', 
      flexWrap: 'wrap' // Stacks column structure elegantly on narrow responsive viewport breaks
    }}>
      
      {/* LEFT PANEL: Secure Auth Entry */}
      <div style={{ 
        flex: '1 1 500px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '40px',
        boxSizing: 'border-box'
      }}>
        
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          {/* Dynamic Intercept Banner Prompt */}
          {interceptMessage && !error && (
            <div style={{ color: theme.colors.secondary, backgroundColor: 'rgba(46, 125, 50, 0.08)', border: `1px solid ${theme.colors.secondary}`, padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
              ℹ️ {interceptMessage}
            </div>
          )}

          <h2 style={{ fontSize: '2.5rem', color: theme.colors.primary, textAlign: 'left', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted, #666)', marginBottom: '30px', fontSize: '1rem' }}>
            Please enter your credentials to securely sign in.
          </p>
          
          {error && (
            <div style={{ color: '#e53e3e', backgroundColor: '#fff5f5', border: '1px solid #feb2b2', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong>⚠️</strong> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Username Entry */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Username</label>
              <input 
                type="text" 
                placeholder="Enter your username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color, #ccc)', backgroundColor: 'var(--input-bg, #fff)', color: 'var(--text-color, #333)', boxSizing: 'border-box', outline: 'none' }} 
                required 
              />
            </div>

            {/* Password Entry with Visibility Toggle */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color, #ccc)', backgroundColor: 'var(--input-bg, #fff)', color: 'var(--text-color, #333)', boxSizing: 'border-box', outline: 'none' }} 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '38px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted, #666)', fontSize: '14px', fontWeight: 'bold' }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" style={{ width: '100%', padding: '15px', borderRadius: '30px', backgroundColor: theme.colors.primary, color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)' }}>
              Log In
            </button>
          </form>

          <p style={{ marginTop: '30px', fontSize: '14px', textAlign: 'center' }}>
            Don't have an account? <Link to="/signup" style={{ color: theme.colors.primary, fontWeight: 'bold', textDecoration: 'none' }}>Sign Up</Link>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Splash Banner Graphic Art Component */}
      <div style={{ 
        flex: '1 1 500px', 
        position: 'relative',
        minHeight: '400px' // Guarantees layout presence across medium tablet screen layouts
      }}>
        <img 
          src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2000&auto=format&fit=crop" 
          alt="Doctor checking pregnant patient" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.15)' }}></div>
      </div>

    </div>
  );
}

export default Login;