import React, { useState } from 'react';
import { authAPI } from '../api';

function Login({ onLoginSuccess }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            if (isSignUp) {
                await authAPI.register(username, email, password);
                setSuccessMessage('Account created successfully! You can now log in.');
                setIsSignUp(false);
                setPassword('');
            } else {
                await authAPI.login(username, password);
                onLoginSuccess();
            }
        } catch (err) {
            console.error("Auth Error details:", err.response || err);
            
            // This reads the exact error message coming back from your Django server
            if (err.response && err.response.data) {
                const serverError = JSON.stringify(err.response.data);
                setError(`Server Says: ${serverError}`);
            } else {
                setError('Cannot reach the backend server. Make sure Django is running!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
            <h2 style={{ textAlign: 'center', color: '#2d3748', margin: '0 0 5px 0' }}>🤰 Bump Journey</h2>
            <p style={{ textAlign: 'center', color: '#718096', marginBottom: '25px', fontSize: '14px' }}>
                {isSignUp ? 'Create your maternity tracking account' : 'Sign in to your maternity tracker'}
            </p>
            
            {error && (
                <div style={{ backgroundColor: '#fff5f5', color: '#c53030', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', border: '1px solid #fed7d7', wordBreak: 'break-all' }}>
                    {error}
                </div>
            )}
            {successMessage && <p style={{ color: '#2f855a', textAlign: 'center', fontSize: '14px' }}>{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                    />
                </div>

                {isSignUp && (
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>Email Address:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                        />
                    </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                    />
                </div>

                {/* 🟢 BABY GREEN BUTTON */}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#8FBC8F', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'background 0.2s' }}>
                    {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #edf2f7', paddingTop: '15px' }}>
                {/* 🟢 BABY GREEN TOGGLE LINK */}
                <button 
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                        setSuccessMessage('');
                    }}
                    style={{ background: 'none', border: 'none', color: '#6B8E23', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline', fontWeight: '500' }}
                >
                    {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
}

export default Login;