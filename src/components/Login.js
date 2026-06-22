import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { theme } from '../styles'; // Assuming your styles.js exports 'theme'

function Login({ onLogin }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authAPI.login(username, password);
            onLogin({ username });
        } catch (err) {
            console.error("Login failed");
        }
    };

    return (
        <div style={theme.loginContainer}>
            <h2 style={theme.loginTitle}>Bump Journey</h2>
            <form onSubmit={handleSubmit} style={theme.loginForm}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={theme.input} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={theme.input} required />
                <button type="submit" style={theme.loginButton}>{isSignUp ? 'Sign Up' : 'Login'}</button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)} style={theme.toggleButton}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </button>
        </div>
    );
}

export default Login;