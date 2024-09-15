import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'; // 导入 Footer 组件
import { FaGoogle } from 'react-icons/fa'; // 导入谷歌图标
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

            <button type="button" style={styles.googleButton} onClick={handleGoogleLogin}>
              <FaGoogle style={styles.googleIcon} /> Google
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
      <Footer /> {/* 在页面中使用 Footer 组件 */}
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
    top: '45%',  // 向下移动
    left: '15%',  // 向左移动
    transform: 'translate(-50%, -50%)',
    textAlign: 'left',  // 左对齐文字
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
    fontSize: '25px',  // 增大字体大小
    marginBottom: '30px',  // 增加与SIGN IN之间的间距
    lineHeight: '1.4',  // 使文字的行间距更大
    maxWidth: '400px',
    textAlign: 'left',
  },
  signIn: {
    fontSize: '40px',  // 增大SIGN IN的字体大小
    fontWeight: 'bold',
    textAlign: 'center',  // 居中对齐
    marginBottom: '30px',  // 增加与输入框之间的间距
    marginLeft: '-60px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // 确保输入框和按钮在垂直方向上居中
    gap: '20px',  // 增大输入框之间的间距
  },
  input: {
    padding: '15px',
    fontSize: '16px',
    color: '#FFFFFF',  // 输入文本的颜色
    backgroundColor: '#2E4A29',
    border: 'none',
    borderRadius: '20px',
    textAlign: 'center',
    width: '50%',
    marginLeft: '-60px',
  },
  'input::placeholder': {
    color: '#FFFFFF',  // placeholder的颜色
  },
  button: {
    padding: '15px 20px',  // 增大按钮的内边距
    fontSize: '18px',
    color: '#FFFFFF',
    backgroundColor: '#2E4A29',  // 与Google按钮背景一致
    border: 'none',
    borderRadius: '20px',  // 变成圆角
    cursor: 'pointer',
    width: '45%',  // 调整宽度到与输入框一致
    marginLeft: '-60px',
  },
  googleButton: {
    padding: '15px 20px',
    fontSize: '18px',
    color: '#FFFFFF',
    backgroundColor: '#2E4A29',  // 绿色背景，与Sign in相同
    border: 'none',
    borderRadius: '20px',  // 变成圆角
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
    padding: '10px 10px',  // 调整按钮的内边距，使按钮更小
    fontSize: '16px',  // 调整字体大小
    color: '#FFFFFF',
    backgroundColor: 'transparent',  // 使用透明背景
    border: '1px solid #FFFFFF',  // 增加白色边框
    borderRadius: '20px',  // 变成圆角
    cursor: 'pointer',
    width: '45%',  // 调整按钮的宽度，使其小于输入框和其他按钮
    marginLeft: '-60px',
    marginTop: '10px',  // 增加与上方按钮的间距
  },
  noAccountButton: {
    padding: '10px 10px',  // 调整按钮的内边距，使按钮更小
    fontSize: '16px',  // 调整字体大小
    color: '#FFFFFF',
    backgroundColor: 'transparent',  // 使用透明背景
    border: '1px solid #FFFFFF',  // 增加白色边框
    borderRadius: '20px',  // 变成圆角
    cursor: 'pointer',
    width: '45%',  // 调整按钮的宽度，使其小于输入框和其他按钮
    marginLeft: '-60px',
    marginTop: '10px',  // 增加与上方按钮的间距
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default LoginPage;
