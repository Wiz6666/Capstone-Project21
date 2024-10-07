import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://efypgmafkfwlilebbbcf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeXBnbWFma2Z3bGlsZWJiYmNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ4Mjk1MDIsImV4cCI6MjA0MDQwNTUwMn0.eeGyZ6SxQIdmDnf_VLl-BnYVS87rbm00-jPW5aMSy1w';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Navbar = ({ session }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (session) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [session]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/AASYP-Logo-FC-Transparent.png" alt="Logo" />
      </div>
      <ul className="navbar-menu">
        {loggedIn ? (
          <>
            <li><Link to="/project">PROJECT</Link></li>
            <li><Link to="/dashboard">DASHBOARD</Link></li>
            <li><Link to="/profile">PROFILE</Link></li>
            <li>
              <Link to="/login" onClick={handleLogout}>LOGOUT</Link>
            </li>
          </>
        ) : (
          <li><Link to="/login">LOGIN</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
