import React, { useState, useEffect } from 'react';
import { theme } from '../styles';

const ALL_QUOTES = [
  { id: 'q1', title: 'LOVED ALREADY!', text: 'Your body knows exactly what to do. You are doing great!' },
  { id: 'q2', title: 'BUMP GROWS!', text: 'Tiny kicks are signs of big adventures. Cherish every flutter.' },
  { id: 'q3', title: 'SOON IN ARMS!', text: 'You are creating a miracle. We are celebrating with you!' },
  { id: 'q4', title: 'STAY POSITIVE!', text: 'Every day brings you closer to meeting your little joy.' },
  { id: 'q5', title: 'YOU ARE STRONG!', text: 'Every breath you take is building a new life.' },
  { id: 'q6', title: 'NURTURE!', text: 'Remember to drink water and rest. Your health is the priority.' },
  { id: 'q7', title: 'AMAZING!', text: 'Your resilience is inspiring. Keep going, Mom-to-be.' }
];

function EncouragementCards() {
  const [displayedCards, setDisplayedCards] = useState([]);

  useEffect(() => {
    // Fisher-Yates Shuffle Algorithm for uniform distribution selection
    const pool = [...ALL_QUOTES];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    
    setDisplayedCards(pool.slice(0, 4));
  }, []);

  const cardStyle = {
    backgroundColor: 'var(--input-bg, #f7fafc)', // Adapts perfectly to dark/light systemic shifts
    padding: '20px',
    borderRadius: '15px',
    textAlign: 'center',
    border: `1px solid var(--border-color, #edf2f7)`,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
      gap: '20px', 
      margin: '25px 0' 
    }}>
      {displayedCards.map((card) => (
        <div 
          key={card.id} 
          style={cardStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
          }}
        >
          <h4 style={{ color: theme.colors.primary, marginBottom: '10px', fontSize: '1.1rem', letterSpacing: '0.5px', fontFamily: 'Georgia, serif' }}>
            {card.title}
          </h4>
          <p style={{ color: 'var(--text-color, #333)', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>
            {card.text}
          </p>
        </div>
      ))}
    </div>
  );
}

export default EncouragementCards;