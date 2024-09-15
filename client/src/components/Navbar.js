import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Navbar = () => {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>AASYP.ORG</div>
      <div style={styles.navItems}>
        <Link to="/" style={styles.navLink}>HOME</Link>
        <Link to="/project" style={styles.navLink}>PROJECT</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.navLink}>DASHBOARD</Link>
            <Link to="/profile" style={styles.navLink}>PROFILE</Link>
            <button onClick={handleLogout} style={styles.logoutButton}>LOGOUT</button>
          </>
        ) : (
          <Link to="/login" style={styles.navLink}>LOGIN</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#2E4A29',
    color: '#FFFFFF',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navItems: {
    display: 'flex',
    alignItems: 'center',
  },
  navLink: {
    color: '#FFFFFF',
    textDecoration: 'none',
    marginLeft: '20px',
    fontSize: '16px',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '20px',
  },
};

export default Navbar;
