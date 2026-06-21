import React, { useState } from 'react';

const LogForm = ({ onAddLog }) => {
  const [weight, setWeight] = useState('');
  const [bp, setBp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddLog({ weight, bp, date: new Date().toLocaleDateString() });
    setWeight(''); setBp('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
      <input placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
      <input placeholder="BP (e.g. 120/80)" value={bp} onChange={(e) => setBp(e.target.value)} required />
      <button type="submit">Submit Log</button>
    </form>
  );
};

export default LogForm;