import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //  useNavigate
import Footer from '../components/Footer'; //  Footer
import { supabase } from '../supabaseClient';

const ForgetPasswordPage = () => {
  const navigate = useNavigate(); //  useNavigate
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleContinueClick = async () => {
    try {
      // Dynamically construct the base URL
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/reset-password`,
      });
      if (error) throw error;
      setMessage('Password reset email sent. Please check your inbox.');
      // Optionally navigate to a confirmation page
      // navigate('/reset-password-confirmation');
    } catch (error) {
      setError(error.message);
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
        {message && <p style={styles.message}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <input 
          type="email" 
          placeholder="Enter email address" 
          className="input-placeholder" 
          style={styles.input} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button 
          type="button" 
          style={styles.button} 
          onClick={handleContinueClick}
        >
          Continue
        </button>
      </div>
      <Footer /> {/* 在页面中使用 Footer 组件 */}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    background: 'linear-gradient(90deg, #142924 10%, rgba(101, 125, 131, 0.9) 90%)',  // 更加缓慢的渐变
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '60px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: '60px', // 增大距离下方框的间距
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginTop: '-100px',  // 将位置上移
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
    fontSize: '30px',  // 增大字体大小
    color: '#FFFFFF',
    marginBottom: '50px',  // 增大与输入框的间距
  },
  input: {
    width: '60%',  // 调整宽度
    padding: '15px',  // 增大内边距
    marginBottom: '30px',  // 增大与按钮的间距
    fontSize: '16px',
    borderRadius: '20px',  // 调整圆角大小
    border: '1px solid #FFFFFF',
    backgroundColor: 'transparent',
    color: '#FFFFFF',  // 输入文字颜色为白色
    textAlign: 'center',
    outline: 'none',
  },
  button: {
    width: '40%',  // 调整宽度
    padding: '15px',  // 增大内边距
    fontSize: '18px',
    borderRadius: '20px',  // 调整圆角大小
    border: 'none',
    backgroundColor: '#5A5E63',
    color: '#FFFFFF',
    cursor: 'pointer',
  },
};

export default ForgetPasswordPage;
