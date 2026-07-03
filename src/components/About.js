import React from 'react';
import { theme } from '../styles';

function About() {
  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '90vh', fontFamily: 'Georgia, serif', color: '#2d3748' }}>
      
      {/* Hero Banner Banner Header */}
      <div style={{ backgroundColor: theme.colors.primary, color: '#ffffff', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '40px', marginBottom: '15px' }}>About BumpJourney</h1>
        <p style={{ fontSize: '18px', maxWidth: '700px', margin: '0 auto', color: '#B7E4C7' }}>
          Bridging the distance between maternal care environments and patient logging diagnostics.
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '50px 20px' }}>
        
        {/* Core Vision Column */}
        <div style={{ marginBottom: '50px', borderLeft: `5px solid ${theme.colors.secondary}`, paddingLeft: '20px' }}>
          <h2 style={{ color: theme.colors.primary, marginBottom: '15px' }}>Our Mission</h2>
          <p style={{ lineHeight: '1.7', fontSize: '16px' }}>
            BumpJourney provides maternal health systems with simple, direct paths for documentation. 
            By allowing tracking individuals to safely capture physiological indicators—such as fetal kick frequencies, 
            blood pressure ratios, and clinical warnings—we hand medical providers data assets necessary to offer tailored wellness assistance.
          </p>
        </div>

        {/* Feature Grid Panel Layout */}
        <h2 style={{ color: theme.colors.primary, textAlign: 'center', marginBottom: '30px' }}>System Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px', marginBottom: '40px' }}>
          
          <div style={{ padding: '25px', backgroundColor: '#ffffff', borderRadius: '8px', border: `1px solid ${theme.colors.border}`, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ color: theme.colors.secondary, marginTop: '0' }}>📝 Comprehensive Health Logs</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.5' }}>Record everyday indicators such as weight indices, physical symptoms, and arterial pressures directly from your remote environment.</p>
          </div>

          <div style={{ padding: '25px', backgroundColor: '#ffffff', borderRadius: '8px', border: `1px solid ${theme.colors.border}`, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ color: theme.colors.secondary, marginTop: '0' }}>👨‍⚕️ Clinical Oversight</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.5' }}>Approved practitioner channels observe records instantly and return diagnostic evaluations or modify calendar timelines seamlessly.</p>
          </div>

          <div style={{ padding: '25px', backgroundColor: '#ffffff', borderRadius: '8px', border: `1px solid ${theme.colors.border}`, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ color: theme.colors.secondary, marginTop: '0' }}>🚨 Direct Escalation Alerts</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.5' }}>Flag logs for immediate assistance requests to apprise care systems when standard indicators present anomalies.</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default About;