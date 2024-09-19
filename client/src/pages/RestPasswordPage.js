import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setMessage('Password updated successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
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
        {message && <p style={styles.message}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleResetPassword}>
          <input 
            type="password" 
            placeholder="New Password" 
            className="input-placeholder" 
            style={styles.input} 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            className="input-placeholder" 
            style={styles.input} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            style={styles.button} 
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <Link to="/login" style={styles.backLink}>Back to Login</Link>
      </div>
    </div>
  );
};

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
    marginBottom: '50px',
  },
  input: {
    display: 'block',
    width: '80%', 
    padding: '15px', 
    margin: '0 auto 20px auto', 
    fontSize: '16px',
    borderRadius: '20px',
    border: '1px solid #FFFFFF',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    textAlign: 'center',
    outline: 'none',
  },
  button: {
    display: 'block',
    width: '80%',  
    padding: '15px',
    fontSize: '18px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#5A5E63',
    color: '#FFFFFF',
    cursor: 'pointer',
    margin: '0 auto', 
  },
  message: {
    color: '#4CAF50',
    marginBottom: '20px',
  },
  error: {
    color: '#F44336',
    marginBottom: '20px',
  },
  backLink: {
    color: '#FFFFFF',
    textDecoration: 'none',
    marginTop: '20px',
    display: 'inline-block',
  },
};

export default ResetPasswordPage;
