import React, { useState } from 'react';
import './Navbar.css'; 
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/path-to-logo.png" alt="Logo" />
      </div>
      <ul className="navbar-menu">
        <li><a href="/home">HOME</a></li>
        <li><a href="/project">PROJECT</a></li>
        <li><a href="/dashboard">DASHBOARD</a></li>
        <li><a href="/profile">PROFILE</a></li>
        {isLoggedIn && (
          <li className="navbar-avatar">
            <img src="/path-to-avatar.png" alt="User Avatar" />
          </li>
        )}
      </ul>
      {!isLoggedIn && (
        <div className="navbar-login">
          <a href="/login">LOGIN</a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
