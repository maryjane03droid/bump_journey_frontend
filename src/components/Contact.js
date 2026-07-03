import React, { useState } from 'react';
import { theme } from '../styles';

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '80vh', padding: '40px 20px', fontFamily: 'Georgia, serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(27,67,50,0.08)', border: `1px solid ${theme.colors.border}` }}>
        
        <h2 style={{ color: theme.colors.primary, textAlign: 'center', marginBottom: '10px' }}>Contact Our Care Team</h2>
        <p style={{ textAlign: 'center', color: '#4a5568', marginBottom: '30px', fontSize: '15px' }}>
          Have questions about your digital portal or need non-emergency clinical assistance? Send us a direct message.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', color: theme.colors.primary }}>
            <h3>✨ Message Sent Successfully!</h3>
            <p>Our maternal health coordinators will review your transmission and reply within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: theme.colors.primary }}>Your Full Name</label>
            <input type="text" placeholder="Maryjane Doe" style={theme.input} required />

            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: theme.colors.primary }}>Email Address</label>
            <input type="email" placeholder="maryjane@example.com" style={theme.input} required />

            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: theme.colors.primary }}>Message / Inquiry</label>
            <textarea 
              placeholder="How can our clinical team support you today?" 
              rows="5" 
              style={{ ...theme.input, fontFamily: 'sans-serif', resize: 'none' }} 
              required 
            />

            <button type="submit" style={theme.loginButton}>
              Send Secure Message
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default Contact;