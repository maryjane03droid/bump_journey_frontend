import React from 'react';
import { theme } from '../styles';

const ImageFrame = ({ label, height = '200px' }) => (
  <div style={{ 
    height: height, 
    width: '100%', 
    backgroundColor: '#f4f6f2', 
    border: `2px dashed ${theme.colors.primary}`, 
    borderRadius: '8px', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    color: '#a0aec0',
    fontStyle: 'italic',
    margin: '10px 0'
  }}>
    <span style={{ fontSize: '40px' }}>🖼️</span>
    <strong style={{ fontFamily: 'sans-serif', color: theme.colors.secondary }}>{label}</strong>
    <span style={{ fontSize: '12px' }}>[Placeholder Image Asset]</span>
  </div>
);

export default ImageFrame;