import React from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate

const ForgetPasswordPage = () => {
  const navigate = useNavigate(); // 使用 useNavigate 进行导航

  const handleContinueClick = () => {
    navigate('/reset-password'); // 跳转到 ResetPasswordPage 页面
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <span>FORGOT</span><br />
        <span>PASSWORD</span>
      </h1>
      <div style={styles.overlay}>
        <h2 style={styles.subtitle}>ENTER YOUR EMAIL ADDRESS</h2>
        <input type="email" placeholder="Enter email address" className="input-placeholder" style={styles.input} />
        <button 
          type="button" 
          style={styles.button} 
          onClick={handleContinueClick} // 绑定点击事件
        >
          Continue
        </button>
      </div>
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
    marginBottom: '30px',  // 增大与输入框的间距
  },
  input: {
    width: '80%',  // 增大宽度，使输入框占据更大空间
    padding: '15px',  // 增大内边距
    marginBottom: '20px',  // 增大与按钮的间距
    fontSize: '16px',
    borderRadius: '20px',  // 调整圆角大小
    border: '1px solid #FFFFFF',
    backgroundColor: 'transparent',
    color: '#FFFFFF',  // 输入文字颜色为白色
    textAlign: 'center',
    outline: 'none',
  },
  button: {
    width: '60%',  // 调整宽度，使按钮居中
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
