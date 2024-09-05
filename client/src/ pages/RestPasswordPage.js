import React from 'react';
import Footer from '../components/Footer'; // 导入 Footer 组件

const ResetPasswordPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <span>NEW</span><br />
        <span>PASSWORD</span>
      </h1>
      <div style={styles.overlay}>
        <h2 style={styles.subtitle}>PLEASE CREATE A NEW PASSWORD THAT YOU DON'T USE ON ANY OTHER SITE.</h2>
        <input type="password" placeholder="Create new password" className="input-placeholder" style={styles.input} />
        <input type="password" placeholder="Confirm your password" className="input-placeholder" style={styles.input} />
        <button type="button" style={styles.button}>Change</button>
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
    fontSize: '20px',  // 增大字体大小
    color: '#FFFFFF',
    marginBottom: '50px',  // 增大与输入框的间距
  },
  input: {
    width: '60%',  // 调整宽度
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

export default ResetPasswordPage;
