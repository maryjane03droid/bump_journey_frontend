import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- Make sure Link is imported
import { authAPI } from '../services/api';
import { theme } from '../styles';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await authAPI.login(username, password);

      const accessToken = data.access || data.access_token || data.token;
      if (!accessToken) {
        throw new Error('Login failed. Please check your username and password.');
      }

      // FIXED: Directly saving the authenticated role and username explicitly sent by Django!
      localStorage.setItem('user_role', data.role);
      localStorage.setItem('username', data.username);

      onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to log in. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      
      {/* LEFT SIDE: Login Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8faf8' }}>
        
        <div style={{ ...theme.loginContainer, width: '100%', maxWidth: '400px', boxShadow: 'none', backgroundColor: 'transparent' }}>
          <h2 style={{ ...theme.loginTitle, fontSize: '2.5rem', color: '#2e7d32', textAlign: 'left', marginBottom: '30px' }}>
            Welcome Back
          </h2>
          
          {error && <p style={{ color: '#e53e3e', backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px' }}>{error}</p>}
          
          <form onSubmit={handleSubmit}>
            {/* Note: Ensure the username typed here perfectly matches the case used when signing up */}
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{...theme.input, padding: '15px'}} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{...theme.input, padding: '15px'}} required />
            <button type="submit" style={{ ...theme.loginButton, width: '100%', padding: '15px', borderRadius: '30px', fontSize: '1.1rem', marginTop: '10px' }}>
              Log In
            </button>
          </form>

          {/* Added quick link to Signup for better UX */}
          <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'left' }}>
            Don't have an account? <Link to="/signup" style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>Sign Up</Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Related Image */}
      <div style={{ flex: 1, position: 'relative' }}>
        <img 
          src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2000&auto=format&fit=crop" 
          alt="Doctor checking pregnant patient" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

    </div>
  );
}

export default Login;