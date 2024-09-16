import React, { useState } from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/AASYP-Logo-FC-Transparent.png" alt="Logo" />
      </div>
      <ul className="navbar-menu">
        <li><a href="/">HOME</a></li>
        <li><a href="/project">PROJECT</a></li>
        <li><a href="/dashboard">DASHBOARD</a></li>
        <li><a href="/profile">PROFILE</a></li>
        {isLoggedIn && (
<li className="navbar-avatar">
            <img src="Capstone-Project21/client/public/logout avatar copy.png" alt="User Avatar" />
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