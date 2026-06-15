// src/components/AuthForm.jsx
import React, { useState } from 'react';
import { authAPI } from '../api';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            if (isLogin) {
                await authAPI.login(username, password);
                setMessage('🎉 Login successful! JWT Access token stored in LocalStorage.');
            } else {
                await authAPI.register(username, email, password);
                setMessage('🚀 Account registered successfully! Switching to login...');
                setIsLogin(true); // Auto switch to login view
            }
        } catch (err) {
            // Read specific error messages returned from Django views
            setError(err.response?.data?.detail || 'Authentication failed. Please check your inputs.');
        }
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.heading}>{isLogin ? 'Welcome back' : 'Create an Account'}</h2>
            <p style={styles.subheading}>Bump Journey Management System</p>
            
            <form onSubmit={handleSubmit} style={styles.form}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    style={styles.input}
                />
                
                {!isLogin && (
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={styles.input}
                    />
                )}
                
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={styles.input}
                />
                
                <button type="submit" style={styles.button}>
                    {isLogin ? 'Sign In' : 'Register'}
                </button>
            </form>

            {message && <p style={styles.success}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}

            <p style={styles.toggleText}>
                {isLogin ? "New to the platform? " : "Already have an account? "}
                <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
                    {isLogin ? 'Create one here' : 'Sign in here'}
                </span>
            </p>
        </div>
    );
};

const styles = {
    card: { maxWidth: '400px', margin: '80px auto', padding: '40px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center', fontFamily: 'system-ui, sans-serif' },
    heading: { margin: '0 0 5px 0', color: '#1a1a1a', fontWeight: '600', letterSpacing: '-0.5px' },
    subheading: { margin: '0 0 30px 0', color: '#86868b', fontSize: '14px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    input: { padding: '14px', borderRadius: '8px', border: '1px solid #d2d2d7', fontSize: '16px', backgroundColor: '#fbfbfd', outline: 'none' },
    button: { padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '16px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' },
    success: { color: '#1d1d1f', backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '6px', fontSize: '14px', marginTop: '15px' },
    error: { color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '6px', fontSize: '14px', marginTop: '15px' },
    toggleText: { marginTop: '25px', fontSize: '14px', color: '#86868b' },
    link: { color: '#0066cc', cursor: 'pointer', fontWeight: '500', textDecoration: 'none' }
};

export default AuthForm;