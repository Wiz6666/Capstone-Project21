import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  // Declare state variables for user input and error handling
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Registration started');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true); // Set loading state
    setError(null);     // Clear any previous error messages

    try {
      console.log('Attempting to sign up with Supabase');

      // Call Supabase to register the user with email and password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;  // Handle any authentication errors
      console.log('Supabase sign up successful', authData);

      // If user is successfully created, insert user info into the database
      if (authData.user && authData.user.id) {
        console.log('Inserting user data into Users table');
        const { data, error } = await supabase
            .from('Users')
            .insert([
              {
                user_id: authData.user.id,
                username: fullName,
                email: email,
                phone_number: null,
                role: 'User'
              }
            ]);

        if (error) {
          console.error('Error inserting user data:', error);
          throw error;
        }

        console.log('User data inserted successfully');
      } else {
        throw new Error('User ID not available after signup');
      }

      // Notify user of successful registration and redirect to login page
      console.log('Showing alert');
      alert('Registration successful! Please check your email to confirm your account.');
      console.log('Navigating to login page');
      navigate('/login');
    } catch (error) {
      // Catch and display any registration errors
      console.error('Error during registration:', error);
      setError(error.message);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  // Function to handle Google sign-up
  const handleGoogleSignUp = async () => {
    try {
      const { user, error } = await supabase.auth.signIn({ provider: 'google' });
      if (error) throw error;
      // On success, navigate to the homepage or dashboard
      navigate('/');
    } catch (error) {
      // Catch and display Google sign-up errors
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
            <h2 style={styles.signUp}>SIGN UP</h2>
            {error && <p style={styles.error}>{error}</p>}

            {/* Form for user registration */}
            <form style={styles.form} onSubmit={handleRegister}>
              {/* Input for full name */}
              <input
                  type="text"
                  placeholder="Full Name"
                  style={styles.input}
                  className="input-placeholder"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
              />
              {/* Input for email */}
              <input
                  type="email"
                  placeholder="Type Email"
                  style={styles.input}
                  className="input-placeholder"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              {/* Input for password */}
              <input
                  type="password"
                  placeholder="Password"
                  style={styles.input}
                  className="input-placeholder"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              {/* Input for confirming password */}
              <input
                  type="password"
                  placeholder="Re-type Password"
                  style={styles.input}
                  className="input-placeholder"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {/* Sign-up button */}
              <button type="submit" style={styles.button} disabled={isLoading}>
                {isLoading ? 'Signing up...' : 'Sign up'}
              </button>

              {/* Button to navigate to login page */}
              <button
                  type="button"
                  style={styles.link}
                  onClick={() => navigate('/login')}
              >
                Already have an account?
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

// Styling for the components
const styles = {
  container: {
    position: 'relative',
    height: '100vh', // Ensures the container takes up the full viewport height
    width: '100%',
    overflow: 'hidden',
  },
  video: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ensures the video fills the entire container without distortion
    transform: 'translate(-50%, -50%)', // Centers the video both horizontally and vertically
    zIndex: '-1', // Places the video behind other content
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay to make the text more readable
  },
  textContainer: {
    position: 'absolute',
    top: '45%',
    left: '15%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'left',
    color: '#FFFFFF', // White text for better visibility
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold', // Emphasizes the title text
    marginBottom: '20px',
    fontFamily: 'Futura, Impact, Arial, sans-serif',
    letterSpacing: '1px', // Adds spacing between letters
    textTransform: 'uppercase', // Converts title text to uppercase
  },
  subtitle: {
    fontSize: '25px',
    marginBottom: '30px',
    lineHeight: '1.4',  // Increases line height for readability
    maxWidth: '400px',
    textAlign: 'left',
  },
  signUp: {
    fontSize: '40px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
    marginLeft: '-60px' // Shifts the sign-up section to the left
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px', // Adds space between form elements
  },
  input: {
    padding: '15px',
    fontSize: '16px',
    color: '#FFFFFF',
    backgroundColor: '#2E4A29', // Dark background for the input fields
    border: 'none',
    borderRadius: '20px', // Rounded corners for inputs
    textAlign: 'center',
    width: '50%',
    marginLeft: '-60px',
  },
  button: {
    padding: '15px 20px',
    fontSize: '18px',
    color: '#FFFFFF',
    backgroundColor: '#2E4A29', // Dark green button to match the theme
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    width: '45%',
    marginLeft: '-60px'
  },
  link: {
    padding: '14px 10px',
    fontSize: '13px',
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    border: '1px solid #FFFFFF',
    borderRadius: '20px',
    cursor: 'pointer',
    width: '45%',
    marginLeft: '-60px',
    marginTop: '10px',
    textAlign: 'center',
  },
  error: {
    color: 'red', // Red color for error messages
    marginBottom: '20px',
    marginLeft: '50px'
  },
};


export default RegisterPage;
