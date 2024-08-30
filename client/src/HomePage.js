import React from 'react';

const HomePage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.textContainer}>
          <h1 style={styles.title}>PROJECT MANAGEMENT SYSTEM</h1>
          <div style={styles.buttonsContainer}>
            <button style={styles.button}>Sign in</button>
            <button style={styles.button}>Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    backgroundImage: 'url(/path/to/background-image.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  textContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '18px',
    color: '#FFFFFF',
    backgroundColor: '#2E4A29',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default HomePage;
