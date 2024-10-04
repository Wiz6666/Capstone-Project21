import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';  // Importing CSS for navbar styling
import { createClient } from '@supabase/supabase-js';  // Import Supabase

// Initialize Supabase client
const supabaseUrl = 'https://efypgmafkfwlilebbbcf.supabase.co';  // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeXBnbWFma2Z3bGlsZWJiYmNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ4Mjk1MDIsImV4cCI6MjA0MDQwNTUwMn0.eeGyZ6SxQIdmDnf_VLl-BnYVS87rbm00-jPW5aMSy1w';  // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Navbar = ({ session }) => {
  const navigate = useNavigate();  // Hook for programmatic navigation
  const [loggedIn, setLoggedIn] = useState(false);  // State to manage user login status

  // Effect hook to check if session exists and update login status
  useEffect(() => {
    if (session) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [session]);  // Dependency on the session prop

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();  // Call Supabase sign out function
      if (error) throw error;
      setLoggedIn(false);  // Set login state to false after logging out
      navigate('/login');  // Redirect user to the login page
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
              <button onClick={handleLogout} className="logout-button">LOGOUT</button>
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
