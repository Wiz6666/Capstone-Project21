import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';  // Importing CSS for navbar styling

const Navbar = ({ session }) => {
  const navigate = useNavigate();  // Hook for programmatic navigation
  const [loggedIn, setLoggedIn] = useState(false);  // State to manage user login status

  // Effect hook to check if session exists and update login status
  useEffect(() => {
    // If session is provided as a prop, user is logged in
    if (session) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);  // No session means user is logged out
    }
  }, [session]);  // Dependency on the session prop

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();  // Call Supabase sign out function
      if (error) throw error;  // If there's an error, throw it
      setLoggedIn(false);  // Set login state to false after logging out
      navigate('/login');  // Redirect user to the login page
    } catch (error) {
      console.error('Error logging out:', error.message);  // Log any errors
    }
  };

  return (
    <nav className="navbar">  {/* Navbar container */}
      <div className="navbar-logo">  {/* Logo section */}
        <img src="/AASYP-Logo-FC-Transparent.png" alt="Logo" />  {/* Company or site logo */}
      </div>

      <ul className="navbar-menu">  {/* Navigation menu */}
        <li><Link to="/">HOME</Link></li>  {/* Link to homepage */}
        
        {/* Conditional rendering based on login status */}
        {loggedIn ? (  // If user is logged in
          <>
            <li><Link to="/project">PROJECT</Link></li>  {/* Link to project page */}
            <li><Link to="/dashboard">DASHBOARD</Link></li>  {/* Link to dashboard page */}
            <li><Link to="/profile">PROFILE</Link></li>  {/* Link to user profile */}
            <li>
              <button onClick={handleLogout} className="logout-button">LOGOUT</button>  {/* Logout button */}
            </li>
          </>
        ) : (  // If user is not logged in
          <li><Link to="/login">LOGIN</Link></li>  
        )}
      </ul>
    </nav>
  );
};

export default Navbar;  // Export the Navbar component
