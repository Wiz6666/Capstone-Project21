import React, { useState } from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
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
        <li><a href="/login">LOGIN</a></li>
      </ul>

      <div className="navbar-right">
        <div className="navbar-avatar">
          <img src="/logoutavatar.png" alt="User Avatar" />
        </div>
        <div className="navbar-login">
         
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
