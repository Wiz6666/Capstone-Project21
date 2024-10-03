import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const LoginPage = () => {
  const navigate = useNavigate();

  // Declare state variables for email, password, error message, and loading state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Set loading state
    setError(null);     // Clear any previous error messages

    try {
      // Attempt to sign in with email and password using Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If there's an error, throw it
      if (error) throw error;

      // If login is successful, notify user and navigate to the dashboard
      alert('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      // Set error message if login fails
      setError(error.message);
    } finally {
      // End loading state
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      // Attempt to sign in with Google using Supabase
      const { user, error } = await supabase.auth.signIn({ provider: 'google' });
      if (error) throw error;

      // If successful, navigate to the home page or dashboard
      navigate('/');
    } catch (error) {
      // Set error message if Google login fails
      setError(error.message);
    }
  };

  return (
      <div style={styles.container}>
        <video autoPlay loop muted style={styles.video}>
          <source src="/24 uwa capstone Group20 webpage background video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div style={styles.overlay}>
          <div style={styles.textContainer}>
            <h1 style={styles.title}>HELLO THERE WELCOME...</h1>
            <p style={styles.subtitle}>
              Please fill the form and open your account and enjoy your journey.
            </p>
            <h2 style={styles.signIn}>SIGN IN</h2>
            {error && <p style={styles.error}>{error}</p>}

            {/* Login form */}
            <form style={styles.form} onSubmit={handleLogin}>
              {/* Input for email */}
              <input
                  type="email"
                  placeholder="Your email"
                  style={styles.input}
                  className="input-placeholder"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              {/* Input for password */}
              <input
                  type="password"
                  placeholder="Your password"
                  style={styles.input}
                  className="input-placeholder"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              {/* Sign-in button */}
              <button type="submit" style={styles.button} disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>

              {/* Forgot password button */}
              <button
                  type="button"
                  style={styles.forgotPasswordButton}
                  onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </button>

              {/* No account button, redirects to registration page */}
              <button
                  type="button"
                  style={styles.noAccountButton}
                  onClick={() => navigate('/register')}
              >
                No account?
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

// CSS styles for the page
const styles = {
  container: {
    position: 'relative',
    height: '100vh',    // Full viewport height
    width: '100%',
    overflow: 'hidden', // Ensures no content spills outside the container
  },
  video: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ensures the video covers the entire area without distortion
    transform: 'translate(-50%, -50%)', // Centers the video within the container
    zIndex: '-1', // Places the video behind other elements
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay to improve text readability on top of the video
  },
  textContainer: {
    position: 'absolute',
    top: '45%',
    left: '15%',
    transform: 'translate(-50%, -50%)', // Centers the text container within the page
    textAlign: 'left',
    color: '#FFFFFF', // White text for contrast against the dark overlay
    width: '100%',
    maxWidth: '400px', // Limits the width of the text container to improve readability
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    fontFamily: 'Futura, Impact, Arial, sans-serif',
    letterSpacing: '1px', // Adds spacing between letters for a stylized look
    textTransform: 'uppercase', // Ensures the title is in uppercase letters
  },
  subtitle: {
    fontSize: '25px',
    marginBottom: '30px',
    lineHeight: '1.4',  // Increases line spacing for better readability
    maxWidth: '400px',
    textAlign: 'left',
  },
  signIn: {
    fontSize: '40px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
    marginLeft: '-60px', // Shifts the sign-in button to the left for alignment
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',  // Adds consistent spacing between form elements
  },
  input: {
    padding: '15px',
    fontSize: '16px',
    color: '#FFFFFF', // Ensures the input text is visible on dark background
    backgroundColor: '#2E4A29', // Dark background for input fields
    border: 'none',
    borderRadius: '20px', // Adds rounded corners to the input fields
    textAlign: 'center',
    width: '50%',
    marginLeft: '-60px', // Aligns the input fields to the left for layout balance
  },
  'input::placeholder': {
    color: '#FFFFFF',  // White placeholder text for visibility in the dark input background
  },
  button: {
    padding: '15px 20px',
    fontSize: '18px',
    color: '#FFFFFF',
    backgroundColor: '#2E4A29',  // Button background color matches input fields
    border: 'none',
    borderRadius: '20px', // Rounded corners for the button
    cursor: 'pointer',
    width: '45%',
    marginLeft: '-60px', // Aligns the button with the input fields
  },
  forgotPasswordButton: {
    padding: '10px 10px',
    fontSize: '16px',
    color: '#FFFFFF',
    backgroundColor: 'transparent',  // Transparent background to distinguish from other buttons
    border: '1px solid #FFFFFF',  // White border for visibility
    borderRadius: '20px',
    cursor: 'pointer',
    width: '45%',
    marginLeft: '-60px',
    marginTop: '10px',  // Adds spacing above the button
  },
  noAccountButton: {
    padding: '10px 10px',
    fontSize: '16px',
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    border: '1px solid #FFFFFF',
    borderRadius: '20px',
    cursor: 'pointer',
    width: '45%',
    marginLeft: '-60px',
    marginTop: '10px',  // Adds space between buttons
  },
  error: {
    color: 'red', // Red text for error messages
    marginBottom: '20px',
    marginLeft: '85px' // Aligns error messages with other elements
  },
};

export default LoginPage;
