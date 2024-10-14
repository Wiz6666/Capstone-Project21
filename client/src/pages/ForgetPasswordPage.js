import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ForgetPasswordPage = () => {
  const navigate = useNavigate();

  // Declare state variables for email input, success message, and error handling
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle the 'Continue' button click to initiate the password reset process
  const handleContinueClick = async () => {
    try {
      // Get the base URL for the current environment
      const baseUrl = `${window.location.protocol}//${window.location.host}`;

      // Send a password reset email using Supabase, specifying a redirect URL after reset
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/reset-password`,
      });

      // Handle any errors during the password reset process
      if (error) throw error;

      // Set success message if the email is sent successfully
      setMessage('Password reset email sent. Please check your inbox.');
      setError(''); // Clear error message
    } catch (error) {
      // If there's an error, display it and clear the success message
      setError(error.message);
      setMessage('');
    }
  };

  return (
      <div style={styles.container}>
        <h1 style={styles.title}>
          <span>FORGOT</span><br />
          <span>PASSWORD</span>
        </h1>
        <div style={styles.overlay}>
          <h2 style={styles.subtitle}>ENTER YOUR EMAIL ADDRESS</h2>

          {/* Display success or error message */}
          {message && <p style={styles.message}>{message}</p>}
          {error && <p style={styles.error}>{error}</p>}

          {/* Input for email address */}
          <input
              type="email"
              placeholder="Enter email address"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />

          {/* Continue button to trigger password reset */}
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

// Styling for the page elements
const styles = {
  container: {
    position: 'relative',
    height: '100vh', // Full viewport height
    width: '100%',
    background: 'linear-gradient(to bottom, #a0c7c9, #f6d68b)', // Updated gradient background
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
  },
  title: {
    fontSize: '60px',
    fontWeight: 'bold',
    color: '#048492', // White text for contrast
    marginBottom: '60px',
    textAlign: 'center',
    textTransform: 'uppercase', // Ensures the title text is in uppercase letters
    letterSpacing: '2px', // Adds spacing between letters for a bold look
    marginTop: '-100px', // Adjusts the title position for better layout
  },
  overlay: {
    backgroundColor: '#F7AB3B', // Updated to orange color
    padding: '40px',
    borderRadius: '20px', // Rounded corners for smoother design
    textAlign: 'center',
    maxWidth: '500px', // Limits the width of the overlay to maintain readability
    boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.25)', // Adds shadow for depth
  },
  subtitle: {
    fontSize: '30px',
    color: '#FFFFFF', // White text for visibility
    marginBottom: '30px', // Adds space below the subtitle
  },
  input: {
    width: '80%',
    padding: '15px',
    marginBottom: '20px', // Adds space between input fields
    fontWeight: 'bold',
    borderRadius: '20px', // Rounded corners for input fields
    border: '2px solid #FFFFFF', // White border for contrast
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    textAlign: 'center',
    outline: 'none', // Removes default input outline
  },
  button: {
    width: '60%',
    padding: '15px',
    fontSize: '18px',
    borderRadius: '20px', // Consistent rounded corners for buttons
    border: 'none',
    fontWeight: 'bold',
    backgroundColor: '#048492', // Button background color
    color: '#FFFFFF', // White text on the button for contrast
    cursor: 'pointer', // Changes the cursor to pointer on hover
  },
  message: {
    color: '#4CAF50',  // Green color to indicate success
    marginBottom: '20px',
    fontSize: '18px',
  },
  error: {
    color: '#F44336',  // Red color to indicate an error
    marginBottom: '20px',
    fontSize: '18px',
  },
};

// Additional global styles for the placeholder
const globalStyles = `
  input::placeholder {
    color: #FFFFFF; /* Placeholder text color set to white */
    opacity: 1; /* Ensures the placeholder is fully visible */
  }
`;

// Append global styles to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

export default ForgetPasswordPage;
