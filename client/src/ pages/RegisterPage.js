import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'; // 导入 Footer 组件
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();

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
          <form style={styles.form}>
            <input type="text" placeholder="Full Name" style={styles.input} className="input-placeholder" />
            <input type="email" placeholder="Type Email" style={styles.input} className="input-placeholder" />
            <input type="password" placeholder="Password" style={styles.input} className="input-placeholder" />
            <input type="password" placeholder="Re-type Password" style={styles.input} className="input-placeholder" />
            <button type="submit" style={styles.button}>Sign up</button>
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
    marginBottom: '30px',  // 增加与SIGN UP之间的间距
    lineHeight: '1.4',  // 使文字的行间距更大
    maxWidth: '400px',
    textAlign: 'left',
  },
  signUp: {
    fontSize: '40px',  // 增大SIGN UP的字体大小
    fontWeight: 'bold',
    textAlign: 'center',  // 居中对齐
    marginBottom: '30px',  // 增加与输入框之间的间距
    marginLeft: '-60px'
    
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
    backgroundColor: '#2E4A29',
    border: 'none',
    borderRadius: '20px',  // 变成圆角
    cursor: 'pointer',
    width: '45%',  // 调整宽度到与输入框一致
    marginLeft: '-60px'
  },
  link: {
    padding: '14px 10px',  // 调整按钮的内边距
    fontSize: '13px',
    color: '#FFFFFF',
    backgroundColor: 'transparent',  // 使用透明背景
    border: '1px solid #FFFFFF',  // 增加白色边框
    borderRadius: '20px',  // 变成圆角
    cursor: 'pointer',
    width: '45%',  // 调整按钮的宽度
    marginLeft: '-60px',
    marginTop: '10px',  // 增加与上方按钮的间距
    textAlign: 'center',  // 居中对齐
  },
};

export default RegisterPage;
