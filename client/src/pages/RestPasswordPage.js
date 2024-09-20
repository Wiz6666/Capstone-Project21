import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  
  // Declare state variables for managing new password, confirm password, messages, and loading state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle password reset logic when user submits the form
  const handleResetPassword = async (e) => {
    e.preventDefault();  // Prevent default form submission
    
    // Check if the passwords match before proceeding
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true); // Set loading state to true
    setError('');       // Clear previous errors
    setMessage('');     // Clear previous messages

    try {
      // Update user's password via Supabase
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      // Handle any error during the password update process
      if (error) throw error;
      
      // If successful, display message and redirect to login page after a delay
      setMessage('Password updated successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      // If there's an error, display it
      setError(error.message);
    } finally {
      // End loading state
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <span>RESET</span><br />
        <span>PASSWORD</span>
      </h1>
      <div style={styles.overlay}>
        <h2 style={styles.subtitle}>ENTER YOUR NEW PASSWORD</h2>

        {/* Display success or error messages */}
        {message && <p style={styles.message}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        {/* Form for resetting password */}
        <form onSubmit={handleResetPassword}>
          {/* Input for new password */}
          <input 
            type="password" 
            placeholder="New Password" 
            className="input-placeholder" 
            style={styles.input} 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {/* Input for confirming the new password */}
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            className="input-placeholder" 
            style={styles.input} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {/* Button to submit form and reset password */}
          <button 
            type="submit" 
            style={styles.button} 
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        
        {/* Link to navigate back to the login page */}
        <Link to="/login" style={styles.backLink}>Back to Login</Link>
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
    background: 'linear-gradient(90deg, #142924 10%, rgba(101, 125, 131, 0.9) 90%)', // Gradient background
    display: 'flex',
    flexDirection: 'column', // Column layout for content
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  title: {
    fontSize: '60px',
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for contrast
    marginBottom: '60px',
    textAlign: 'center',
    textTransform: 'uppercase', // All caps text
    letterSpacing: '2px', // Extra spacing between letters
    marginTop: '-100px', // Moves title upwards for better positioning
  },
  overlay: {
    backgroundColor: '#142924', // Dark green background for the form container
    padding: '40px',
    borderRadius: '20px', // Rounded corners for smoother design
    textAlign: 'center',
    maxWidth: '500px', // Limit the width of the container
    width: '100%',
    boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.25)', // Adds a subtle shadow effect for depth
  },
  subtitle: {
    fontSize: '30px',
    color: '#FFFFFF', // White text for visibility
    marginBottom: '50px', // Adds space below the subtitle
  },
  input: {
    display: 'block', 
    width: '80%', // Input takes up 80% of the container's width
    padding: '15px',
    margin: '0 auto 20px auto', // Centers the input and adds space below
    fontSize: '16px',
    borderRadius: '20px', // Rounded corners for input fields
    border: '1px solid #FFFFFF', // White border for visibility
    backgroundColor: 'transparent', // Transparent background to match theme
    color: '#FFFFFF', // White input text
    textAlign: 'center',
    outline: 'none', // Removes default browser outline on focus
  },
  button: {
    display: 'block',
    width: '80%', 
    padding: '15px',
    fontSize: '18px',
    borderRadius: '20px', // Rounded button corners
    border: 'none', // No border
    backgroundColor: '#5A5E63', // Button background color
    color: '#FFFFFF', // White button text
    cursor: 'pointer', // Changes cursor to pointer on hover
    margin: '0 auto', // Centers the button
  },
  message: {
    color: '#4CAF50',  // Green color to indicate a success message
    marginBottom: '20px',
  },
  error: {
    color: '#F44336',  // Red color to indicate an error message
    marginBottom: '20px',
  },
  backLink: {
    color: '#FFFFFF', // White text for the link
    textDecoration: 'none', // Removes the default underline from the link
    marginTop: '20px',
    display: 'inline-block', // Allows the link to behave like a block element while keeping inline formatting
  },
};

export default ResetPasswordPage;
