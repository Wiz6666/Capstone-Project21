import React, { useState } from 'react';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  return (
    <header style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img src="path/to/logo.png" alt="Logo" style={styles.logoImage} />
        <span style={styles.logoText}>AASYP.ORG</span>
      </div>
      <nav>
        <ul style={styles.navLinks}>
          <li><a href="/" style={styles.navLink}>HOME</a></li>
          <li><a href="/project" style={styles.navLink}>PROJECT</a></li>
          <li><a href="/dashboard" style={styles.navLink}>DASHBOARD</a></li>
          <li><a href="/profile" style={styles.navLink}>PROFILE</a></li>
          <li><a href="/login" style={styles.navLink}>LOGIN</a></li>
        </ul>
      </nav>
      {isLoggedIn && (
        <div style={styles.userAvatar}>
          <img src="path/to/user-avatar.png" alt="User Avatar" style={styles.avatarImage} />
        </div>
      )}
    </header>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2E4A29',
    padding: '10px 20px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logoImage: {
    height: '30px',
    marginRight: '10px',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  navLink: {
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: '16px',
  },
  userAvatar: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarImage: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
  },
};

export default NavBar;
