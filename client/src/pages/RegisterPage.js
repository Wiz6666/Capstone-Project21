import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Registration started');

    
    // Check if email is a company email
    if (!email.endsWith('@aasyp.org')) {
      setError("Please use a company email address ending with @aasyp.org");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log('Attempting to sign up with Supabase');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;
      console.log('Supabase sign up successful', authData);

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

      console.log('Showing alert');
      alert('Registration successful! Please check your email to confirm your account.');
      console.log('Navigating to login page');
      navigate('/login');
    } catch (error) {
      console.error('Error during registration:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { user, error } = await supabase.auth.signIn({ provider: 'google' });
      if (error) throw error;
      // Google sign up successful, navigate to home page or dashboard
      navigate('/');
    } catch (error) {
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
          <form style={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              style={styles.input}
              className="input-placeholder"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Type Email"
              style={styles.input}
              className="input-placeholder"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              className="input-placeholder"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Re-type Password"
              style={styles.input}
              className="input-placeholder"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" style={styles.button} disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </button>


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

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
  },
  video: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'translate(-50%, -50%)',
    zIndex: '-1',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  textContainer: {
    position: 'absolute',
    top: '45%',  
    left: '15%',  
    transform: 'translate(-50%, -50%)',
    textAlign: 'left',  
    color: '#FFFFFF',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    fontFamily: 'Futura, Impact, Arial, sans-serif',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: '25px',  
    marginBottom: '30px',  
    lineHeight: '1.4',  
    maxWidth: '400px',
    textAlign: 'left',
  },
  signUp: {
    fontSize: '40px',  
    fontWeight: 'bold',
    textAlign: 'center',  
    marginBottom: '30px',  
    marginLeft: '-60px'
    
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', 
    gap: '20px',  
  },
  input: {
    padding: '15px',
    fontSize: '16px',
    color: '#FFFFFF', 
    backgroundColor: '#2E4A29',
    border: 'none',
    borderRadius: '20px',
    textAlign: 'center',
    width: '50%',
    marginLeft: '-60px',
  },
  'input::placeholder': {
    color: '#FFFFFF',  
  },

  button: {
    padding: '15px 20px',  
    fontSize: '18px',
    color: '#FFFFFF',
    backgroundColor: '#2E4A29',
    border: 'none',
    borderRadius: '20px', 
    cursor: 'pointer',
    width: '45%',  
    marginLeft: '-60px'
  },
  googleButton: {
    padding: '15px 20px',
    fontSize: '18px',
    color: '#FFFFFF',
    backgroundColor: '#2E4A29',  
    border: 'none',
    borderRadius: '20px',  
    cursor: 'pointer',
    width: '45%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '-60px',
  },
  googleIcon: {
    marginRight: '10px',
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
    color: 'red',
    marginBottom: '20px',
    marginLeft: '50px'
  },
};

export default RegisterPage;
