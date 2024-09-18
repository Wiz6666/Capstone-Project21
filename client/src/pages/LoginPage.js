import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Login successful
      alert('Login successful!');
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { user, error } = await supabase.auth.signIn({ provider: 'google' });
      if (error) throw error;
      // Google login successful, navigate to home page or dashboard
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
          <h2 style={styles.signIn}>SIGN IN</h2>
          {error && <p style={styles.error}>{error}</p>}
          <form style={styles.form} onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Your email"
              style={styles.input}
              className="input-placeholder"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Your password"
              style={styles.input}
              className="input-placeholder"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" style={styles.button} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <button 
              type="button" 
              style={styles.forgotPasswordButton} 
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </button>
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
  signIn: {
    fontSize: '40px',  
    fontWeight: 'bold',
    textAlign: 'center',  
    marginBottom: '30px',  
    marginLeft: '-60px',
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
    marginLeft: '-60px',
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
  forgotPasswordButton: {
    padding: '10px 10px',  
    fontSize: '16px',  
    color: '#FFFFFF',
    backgroundColor: 'transparent',  
    border: '1px solid #FFFFFF',  
    borderRadius: '20px',  
    cursor: 'pointer',
    width: '45%',  
    marginLeft: '-60px',
    marginTop: '10px',  
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
    marginTop: '10px',  
  },
  error: {
    color: 'red',
    marginBottom: '20px',
    marginLeft: '85px'
  },
};

export default LoginPage;
