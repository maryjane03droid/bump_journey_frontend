import React, { useState } from 'react';
import { authAPI } from '../services/api'; // Or use your core api instance if needed
import { theme } from '../styles';

function Login({ onLogin }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                // If you have a registration method in your authAPI:
                if (authAPI.register) {
                    await authAPI.register(username, password);
                }
                // Automatically log them in or switch view after signup
                await authAPI.login(username, password);
            } else {
                // Standard login flow
                await authAPI.login(username, password);
            }
            
            setLoading(false);
            onLogin({ username });
        } catch (err) {
            setLoading(false);
            console.error("Authentication failed:", err);
            
            // Provide exact visual feedback on why it failed
            if (err.response && err.response.status === 401) {
                setError('Invalid username or password.');
            } else {
                setError('Connection failed. Check your API or database.');
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100vw',
            // Fullscreen mother and baby background image, blended with your deep forest green theme
            backgroundImage: `linear-gradient(rgba(27, 67, 50, 0.45), rgba(27, 67, 50, 0.45)), url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1600&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxSizing: 'border-box'
        }}>
            {/* Blends your explicit theme container styles and centers it perfectly */}
            <div style={{ ...theme.loginContainer, margin: '0 20px', width: '100%', maxWidth: '400px' }}>
                <h2 style={theme.loginTitle}>Bump Journey</h2>
                
                {error && (
                    <div style={{
                        backgroundColor: '#FFF2F2',
                        color: '#D90429',
                        padding: '10px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        marginBottom: '15px',
                        border: '1px solid #F7D4D4',
                        fontFamily: theme.loginContainer.fontFamily
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        style={theme.input} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={theme.input} 
                        required 
                    />
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            ...theme.loginButton,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
                    </button>
                </form>

                <button 
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                    }} 
                    style={theme.toggleButton}
                >
                    {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
}

export default Login;