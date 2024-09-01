import React from 'react';

const CombinedPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.page}>
        <div className="homepage" style={styles.fullHeightSection}>
          <video autoPlay loop muted className="video-background" style={styles.video}>
            <source src={`${process.env.PUBLIC_URL}/24 uwa capstone Group20 webpage background video.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div style={styles.overlay}>
            <div style={styles.textContainer}>
              <h1 style={styles.title}>PROJECT MANAGEMENT SYSTEM</h1>
              <div style={styles.buttonsContainer}>
                <button style={styles.button}>Sign in</button>
                <button style={styles.button}>Sign up</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.page}>
        <div className="homepage" style={{ ...styles.fullHeightSection, ...styles.gradientBackground }}>
          <div style={styles.infoSection}>
            <h1 style={styles.title}>WHAT IS AASYP PMS?</h1>
            <p style={styles.description}>
              Our mission is to empower teams and individuals to achieve their goals efficiently through a user-friendly project management platform. We strive to provide a seamless collaboration experience, enabling users to streamline workflows, track progress, and deliver projects on time.
            </p>
          </div>
          <div style={styles.videoContainer}>
            <video autoPlay loop muted style={styles.videoSmall}>
              <source src={`${process.env.PUBLIC_URL}/PMS.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      <div style={styles.page}>
        <video autoPlay loop muted className="video-background" style={styles.video}>
          <source src={`${process.env.PUBLIC_URL}/24 uwa capstone Group20 webpage background video.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div style={styles.overlay}>
          <div style={styles.content}>
            <h1 style={styles.title}>CONTACT US</h1>
            <div style={styles.info}>
              <p style={styles.label}>PHONE</p>
              <p style={styles.value}>(123) 456-7890</p>
              <p style={styles.label}>EMAIL</p>
              <p style={styles.value}>team@aasyp.org</p>
              <p style={styles.label}>SOCIAL</p>
              <div style={styles.socialIcons}>
                <a href="#" style={styles.icon}><i className="fab fa-tumblr"></i></a>
                <a href="#" style={styles.icon}><i className="fab fa-facebook-f"></i></a>
                <a href="#" style={styles.icon}><i className="fab fa-youtube"></i></a>
                <a href="#" style={styles.icon}><i className="fab fa-instagram"></i></a>
                <a href="#" style={styles.icon}><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '300vh', // Each page will take up full viewport height, so total height is 3x viewport height
  },
  page: {
    position: 'relative',
    height: '100vh', // Each page takes up full viewport height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullHeightSection: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  gradientBackground: {
    background: 'linear-gradient(90deg, rgba(20,41,36,0.1) 0%, #657d83 100%)',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: '36px',
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
  infoSection: {
    flex: 1,
    padding: '20px',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  description: {
    fontSize: '18px',
    lineHeight: '1.5',
  },
  videoContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '20px',
  },
  videoSmall: {
    width: '40%', // Adjusted to half the original size
    borderRadius: '10px',
  },
  content: {
    color: '#FFFFFF',
    textAlign: 'left',
    maxWidth: '600px',
  },
  info: {
    fontSize: '18px',
    lineHeight: '1.5',
  },
  label: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '20px',
  },
  value: {
    marginBottom: '20px',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'left',
    marginTop: '10px',
  },
  icon: {
    fontSize: '24px',
    color: '#FFFFFF',
    marginRight: '20px',
    textDecoration: 'none',
  },
};

export default CombinedPage;
