// src/components/EncouragementCards.js
import React, { useState, useEffect } from 'react';

// A larger list of facts to pick from
const allQuotes = [
  { title: 'LOVED ALREADY!', text: 'Your body knows exactly what to do. You are doing great!' },
  { title: 'BUMP GROWS!', text: 'Tiny kicks are signs of big adventures. Cherish every flutter.' },
  { title: 'SOON IN ARMS!', text: 'You are creating a miracle. We are celebrating with you!' },
  { title: 'STAY POSITIVE!', text: 'Every day brings you closer to meeting your little joy.' },
  { title: 'YOU ARE STRONG!', text: 'Every breath you take is building a new life.' },
  { title: 'NURTURE!', text: 'Remember to drink water and rest. Your health is the priority.' },
  { title: 'AMAZING!', text: 'Your resilience is inspiring. Keep going, Mom-to-be.' }
];

function EncouragementCards() {
  const [displayedCards, setDisplayedCards] = useState([]);

  useEffect(() => {
    // Shuffle the array and pick the first 4 items
    const shuffled = [...allQuotes].sort(() => 0.5 - Math.random());
    setDisplayedCards(shuffled.slice(0, 4));
  }, []); // Empty dependency array means this runs once on mount

  const cardStyle = {
    backgroundColor: '#D8F3DC',
    padding: '20px',
    borderRadius: '15px',
    textAlign: 'center',
    border: '1px solid #B7E4C7',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '20px 0' }}>
      {displayedCards.map((card, index) => (
        <div key={index} style={cardStyle}>
          <h4 style={{ color: '#2D6A4F', marginBottom: '10px' }}>{card.title}</h4>
          <p style={{ color: '#1B4332', fontSize: '0.9rem' }}>{card.text}</p>
        </div>
      ))}
    </div>
  );
}

export default EncouragementCards;