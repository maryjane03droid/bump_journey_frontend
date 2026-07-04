export const theme = {
  colors: {
    primary: 'var(--primary-color, #1B4332)',      
    secondary: 'var(--secondary-color, #2D6A4F)',    
    background: 'var(--bg-color, #fdfcf0)',   
    white: 'var(--card-bg, #ffffff)', // Mapped to card-bg so it turns dark in Dark Mode
    border: 'var(--border-color, #B7E4C7)',
  },
  loginContainer: {
    maxWidth: '400px',
    margin: '60px auto',
    padding: '40px',
    backgroundColor: 'var(--card-bg, #fdfcf0)',
    border: '1px solid var(--border-color, #d8e2dc)',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontFamily: 'Georgia, serif',
    transition: 'background-color 0.3s ease, border-color 0.3s ease', // Smooth theme transition
  },
  loginTitle: {
    color: 'var(--primary-color, #1B4332)',
    fontFamily: 'Georgia, serif',
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid var(--border-color, #B7E4C7)',
    backgroundColor: 'var(--input-bg, #ffffff)',
    color: 'var(--text-color, #333333)',
    borderRadius: '6px',
    boxSizing: 'border-box',
    transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
  },
  loginButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'var(--primary-color, #1B4332)',
    color: '#ffffff', // Button text usually stays white for contrast
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: 'var(--secondary-color, #40916C)',
    cursor: 'pointer',
    marginTop: '20px',
    textDecoration: 'underline',
  }
};