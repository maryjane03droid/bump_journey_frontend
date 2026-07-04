import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles';
// Importing specific, professional icons
import { FaChartPie, FaHeartbeat, FaUserMd } from 'react-icons/fa';

const FEATURE_CARDS = [
  {
    id: 'dashboard',
    icon: <FaChartPie size={30} color="#2e7d32" />, 
    title: 'Personal Dashboard',
    description: 'Access your personalized medical insights, upcoming appointments, and daily pregnancy tips.',
    path: '/dashboard'
  },
  {
    id: 'tracker',
    icon: <FaHeartbeat size={30} color="#2e7d32" />,
    title: 'Health Tracker',
    description: 'Log your weight, blood pressure, symptoms, and baby movements to share with your medical team.',
    path: '/tracker'
  },
  {
    id: 'profile',
    icon: <FaUserMd size={30} color="#2e7d32" />,
    title: 'My Profile',
    description: 'Update your emergency contacts, view your auto-calculated Due Date, and manage account details.',
    path: '/profile'
  }
];

function Welcome() {
  const navigate = useNavigate();
  
  const token = localStorage.getItem('access_token');
  const isLoggedIn = !!token;
  const userRole = localStorage.getItem('user_role') || 'PATIENT';
  const isStaff = ['DOCTOR', 'MIDWIFE', 'NURSE'].includes(userRole);

  const handleFeatureClick = (protectedPath) => {
    if (isLoggedIn) {
      navigate(protectedPath);
    } else {
      navigate('/login', { state: { from: protectedPath, message: 'Please sign in to access this feature.' } });
    }
  };

  return (
    // Main container: Flexbox handles the split screen
    <div style={{ display: 'flex', minHeight: '100vh', flexWrap: 'wrap', backgroundColor: '#f8faf8', fontFamily: 'sans-serif' }}>
      
      {/* LEFT SIDE: Image Container */}
      <div style={{ 
        flex: '1 1 40%', 
        minHeight: '400px',
        backgroundImage: 'url("https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=2000&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Optional soft green overlay to make the image match the theme perfectly */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(46, 125, 50, 0.2)' }}></div>
      </div>

      {/* RIGHT SIDE: Content Container */}
      <div style={{ 
        flex: '1 1 60%', 
        padding: '5% 8%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center' 
      }}>
        
        {/* Header Text */}
        <h1 style={{ fontSize: '3.5rem', marginBottom: '15px', color: '#1b4332', fontFamily: 'Georgia, serif' }}>
          Welcome to BumpJourney
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#4a5568', marginBottom: '40px', lineHeight: '1.6', maxWidth: '600px' }}>
          Your premium digital companion for a healthy, informed, and beautiful pregnancy. Connect with medical professionals and track your journey every step of the way.
        </p>
        
        {/* Call to Action Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '50px', flexWrap: 'wrap' }}>
          {!isLoggedIn ? (
            <>
              <button 
                onClick={() => navigate('/signup')} 
                style={{ ...theme.loginButton, padding: '15px 40px', fontSize: '1.1rem', borderRadius: '30px', backgroundColor: '#2e7d32', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                Get Started
              </button>
              <button 
                onClick={() => navigate('/login')} 
                style={{ ...theme.loginButton, padding: '15px 40px', fontSize: '1.1rem', borderRadius: '30px', backgroundColor: 'transparent', color: '#2e7d32', border: '2px solid #2e7d32', cursor: 'pointer', fontWeight: 'bold' }}>
                Log In
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/dashboard')} 
              style={{ ...theme.loginButton, padding: '15px 40px', fontSize: '1.1rem', borderRadius: '30px', backgroundColor: '#2e7d32', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              Go to My {isStaff ? 'Clinical Portal' : 'Dashboard'}
            </button>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {FEATURE_CARDS.map((card) => (
            <div 
              key={card.id}
              onClick={() => handleFeatureClick(card.path)}
              style={{ 
                backgroundColor: 'white', 
                padding: '25px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
                cursor: 'pointer',
                borderTop: '4px solid #2e7d32'
              }}
            >
              <div style={{ marginBottom: '15px' }}>{card.icon}</div>
              <h3 style={{ color: '#1b4332', marginBottom: '10px', fontSize: '1.3rem', fontFamily: 'Georgia, serif' }}>
                {card.title}
              </h3>
              <p style={{ color: '#718096', lineHeight: '1.5', fontSize: '14px', margin: 0 }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Welcome;