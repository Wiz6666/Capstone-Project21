import React from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import Footer from '../components/Footer'; // 导入 Footer 组件

const HomePage = () => {
  const navigate = useNavigate(); // 使用 useNavigate 进行导航

  const handleSignInClick = () => {
    navigate('/login'); // 跳转到 LoginPage 页面
  };

  const handleSignUpClick = () => {
    navigate('/register'); // 跳转到 RegisterPage 页面
  };

  return (
    <div style={styles.container}>
      <video autoPlay loop muted style={styles.video}>
        <source src="/24 uwa capstone Group20 webpage background video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={styles.overlay}>
        <div style={styles.textContainer}>
          <h1 style={styles.title}>PROJECT MANAGEMENT SYSTEM</h1>
          <div style={styles.buttonsContainer}>
            <button style={styles.button} onClick={handleSignInClick}>Sign in</button>
            <button style={styles.button} onClick={handleSignUpClick}>Sign up</button>
          </div>
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
    overflow: 'hidden', // 确保视频不超出容器
  },
  video: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'translate(-50%, -50%)', // 确保视频居中覆盖整个背景
    zIndex: '-1', // 将视频放在最底层
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 可选: 添加背景叠加层使背景图变暗
  },
  textContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '18px',
    color: '#FFFFFF',
    backgroundColor: '#2E4A29',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default HomePage;
