import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa'; // 导入谷歌图标

const LoginPage = () => {
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
          <h2 style={styles.signIn}>SIGN IN</h2>
          <form style={styles.form}>
            <input type="email" placeholder="Your email" style={styles.input} className="input-placeholder" />
            <input type="password" placeholder="Your password" style={styles.input} className="input-placeholder" />
            <button type="submit" style={styles.button}>Sign in</button>

            {/* Google Sign In 按钮，颜色与Sign in按钮一致 */}
            <button type="button" style={styles.googleButton}>
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
};

export default LoginPage;
