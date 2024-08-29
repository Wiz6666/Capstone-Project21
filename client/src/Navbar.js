import React from 'react';

const NavBar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <img src="/path/to/logo.png" alt="Logo" style={styles.logoImage} />
        <span style={styles.logoText}>AASYP.ORG</span>
      </div>
      <div style={styles.navLinks}>
        <a href="/" style={styles.navLink}>HOME</a>
        <a href="/project" style={styles.navLink}>PROJECT</a>
        <a href="/dashboard" style={styles.navLink}>DASHBOARD</a>
        <a href="/profile" style={styles.navLink}>PROFILE</a>
        <a href="/login" style={styles.navLink}>LOGIN</a>
      </div>
      <div style={styles.search}>
        <input type="text" placeholder="Search..." style={styles.searchInput} />
      </div>
    </nav>
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
  logo: {
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
    gap: '20px',
  },
  navLink: {
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: '16px',
  },
  search: {
    position: 'relative',
  },
  searchInput: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
  },
};

export default NavBar;
