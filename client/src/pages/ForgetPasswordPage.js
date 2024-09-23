import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Component for the Forget Password page
const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  // State variables for email input, success message, and error message
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  // Function to handle the "Continue" button click
  const handleContinueClick = async () => {
    try {
      // Get the base URL of the current page
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      // Call Supabase API to send password reset email



      // Set success message if email is sent successfully
      setMessage('Password reset email sent. Please check your inbox.');
      setError(''); 
    } catch (error) {
      // Set error message if there's an error

      setError(error.message);
      setMessage(''); 
    }
  };

  return (
    <div style={styles.container}>

      {/* Page title */}

      <h1 style={styles.title}>
        <span>FORGOT</span><br />
        <span>PASSWORD</span>
      </h1>
      <div style={styles.overlay}>

        {/* Subtitle */}
        <h2 style={styles.subtitle}>ENTER YOUR EMAIL ADDRESS</h2>
        {/* Display success message if exists */}
        {message && <p style={styles.message}>{message}</p>}
        {/* Display error message if exists */}
        {error && <p style={styles.error}>{error}</p>}
        {/* Email input field */}

        <input 
          type="email" 
          placeholder="Enter email address" 
          style={styles.input} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Continue button */}

        <button 
          type="button" 
          style={styles.button} 
          onClick={handleContinueClick}
        >
          Continue
        </button>
      </div>
    </div>
  );
};


// Styles object for the component

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    background: 'linear-gradient(90deg, #142924 10%, rgba(101, 125, 131, 0.9) 90%)',  
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '60px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: '60px', 
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginTop: '-100px', 
  },
  overlay: {
    backgroundColor: '#142924',
    padding: '40px',
    borderRadius: '20px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.25)',
  },
  subtitle: {
    fontSize: '30px',  
    color: '#FFFFFF',
    marginBottom: '30px',  
  },
  input: {
    width: '80%', 
    padding: '15px',  
    marginBottom: '20px', 
    fontSize: '16px',
    borderRadius: '20px',  
    border: '1px solid #FFFFFF',
    backgroundColor: 'transparent',
    color: '#FFFFFF', 
    textAlign: 'center',
    outline: 'none',
  },
  button: {
    width: '60%',  
    padding: '15px',  
    fontSize: '18px',
    borderRadius: '20px', 
    border: 'none',
    backgroundColor: '#5A5E63',
    color: '#FFFFFF',
    cursor: 'pointer',
  },

  message: {
    color: '#4CAF50', 
    marginBottom: '20px',
    fontSize: '18px',  
  },
  error: {
    color: '#F44336', 
    marginBottom: '20px',
    fontSize: '18px',  
  },
};

export default ForgetPasswordPage;
