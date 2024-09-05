import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2023 ASEAN-Australia Strategic Youth Partnership Ltd</p>
      <p style={styles.centeredText}>ACN 631 871 184</p>
    </footer>
  );
};

const styles = {
  footer: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    textAlign: 'right',  // 整个footer的文字右对齐
    backgroundColor: 'transparent', // 如果需要背景色，可以设置
  },
  text: {
    color: '#FFFFFF', // 白色字体，与你的截图风格一致
    fontSize: '14px',
    margin: '0', // 去除默认的段落间距
  },
  centeredText: {
    color: '#FFFFFF', // 保持文字颜色一致
    fontSize: '14px',
    margin: '0', // 去除默认的段落间距
    textAlign: 'center',  // 将第二行文字在水平上相对于第一行居中
  },
};

export default Footer;
