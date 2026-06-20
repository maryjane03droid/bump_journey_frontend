import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function Dashboard({ onLogout }) {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div>
      <Navbar setCurrentPage={setCurrentPage} />

      <main style={{ padding: '20px', minHeight: '60vh' }}>
        {currentPage === 'home' && <h1>Welcome to MaternaCare</h1>}
        {currentPage === 'about' && <h2>About Us: Improving Maternal Health</h2>}
        {currentPage === 'tracker' && <h2>Pregnancy Tracker Module</h2>}
        {currentPage === 'contact' && <h2>Contact Our Support Team</h2>}
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;