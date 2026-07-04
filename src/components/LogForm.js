import React, { useState } from 'react';
import { theme } from '../styles';

function LogForm({ onAddLog }) {
  const [weight, setWeight] = useState('');
  const [bp, setBp] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Quick regex validation: matches 2-3 digits, a forward slash, and 2-3 digits (e.g., 120/80)
    const bpRegex = /^\d{2,3}\/\d{2,3}$/;
    if (!bpRegex.test(bp.trim())) {
      setValidationError('Please enter a valid Blood Pressure format (e.g., 120/80).');
      return;
    }

    // Ensure weight is a positive number
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setValidationError('Please enter a valid weight.');
      return;
    }

    // Pass validated data upstream
    onAddLog({
      weight: weightNum,
      bp: bp.trim(),
      date: new Date().toLocaleDateString()
    });

    // Reset input fields cleanly
    setWeight('');
    setBp('');
  };

  const inputStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid var(--border-color, #ccc)',
    backgroundColor: 'var(--input-bg, #fff)',
    color: 'var(--text-color, #333)',
    fontSize: '14px',
    outline: 'none',
    flex: '1 1 200px'
  };

  return (
    <div style={{ margin: '25px 0', padding: '20px', backgroundColor: 'var(--card-bg, #fff)', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      <h4 style={{ color: theme.colors.primary, marginTop: 0, marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
        🩺 Log Today's Vitals
      </h4>

      {validationError && (
        <div style={{ color: '#e53e3e', backgroundColor: '#fff5f5', border: '1px solid #feb2b2', padding: '10px 12px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>
          ⚠️ {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="number" 
          step="0.1"
          placeholder="Weight (kg)" 
          value={weight} 
          onChange={(e) => setWeight(e.target.value)} 
          style={inputStyle}
          required 
        />
        
        <input 
          type="text" 
          placeholder="BP (e.g. 120/80)" 
          value={bp} 
          onChange={(e) => setBp(e.target.value)} 
          style={inputStyle}
          required 
        />
        
        <button 
          type="submit" 
          style={{ 
            ...theme.loginButton, 
            width: 'auto', 
            padding: '12px 24px', 
            margin: 0, 
            fontSize: '14px',
            backgroundColor: theme.colors.secondary 
          }}
        >
          Submit Log
        </button>
      </form>
    </div>
  );
}

export default LogForm;