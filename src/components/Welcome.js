import React from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../styles';

function Welcome() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      
      {/* LEFT SIDE: Information & Call to Action */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '0 8%', 
        backgroundColor: '#f8faf8' // Very soft green/white tint
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          color: '#2e7d32', // Deep olive/forest green
          marginBottom: '20px',
          fontWeight: '800',
          lineHeight: '1.2'
        }}>
          Welcome to <br />Bump Journey.
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#555', 
          lineHeight: '1.6', 
          marginBottom: '40px',
          maxWidth: '500px'
        }}>
          Your complete digital companion for a healthy and joyful pregnancy. 
          Track your milestones, seamlessly connect with your healthcare professionals, 
          and prepare for your little one's arrival—all in one secure place.
        </p>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Primary Button */}
          <Link to="/signup" style={{
            backgroundColor: '#2e7d32',
            color: 'white',
            padding: '14px 28px',
            borderRadius: '30px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)',
            transition: 'transform 0.2s'
          }}>
            Create an Account
          </Link>
          
          {/* Secondary Button */}
          <Link to="/login" style={{
            backgroundColor: 'transparent',
            color: '#2e7d32',
            padding: '14px 28px',
            borderRadius: '30px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            textAlign: 'center',
            border: '2px solid #2e7d32',
            transition: 'background-color 0.2s'
          }}>
            Log In
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE: Full Height Image */}
      <div style={{ flex: 1, position: 'relative' }}>
        <img 
          src="https://images.unsplash.com/photo-1581007871115-f14bc016e0a4?q=80&w=2000&auto=format&fit=crop" 
          alt="Happy pregnant family" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', // Ensures the image fills the space beautifully without stretching
            objectPosition: 'center'
          }}
        />
      </div>

    </div>
  );
}

export default Welcome;