import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import fetch from 'node-fetch';


const HomePage = () => {
  // Hook to navigate between pages
  const navigate = useNavigate();

  return (
      <div className="container">
        {/* First section with a full-page background video */}
        <div className="page">
          <div className="homepage fullHeightSection">
            <video autoPlay loop muted className="video-background">
              {/* Background video for the homepage */}
              <source src={`${process.env.PUBLIC_URL}/24 uwa capstone Group20 webpage background video.mp4`} type="video/mp4" />
              {/* Fallback text for unsupported browsers */}
              Your browser does not support the video tag.
            </video>
            <div className="overlay">
              <div className="textContainer">
                {/* Title and buttons for signing in or signing up */}
                <h1 className="title">PROJECT MANAGEMENT SYSTEM</h1>
                <div className="buttonsContainer">
                  {/* Button to navigate to the login page */}
                  <button className="button" onClick={() => navigate('/login')}>Sign in</button>
                  {/* Button to navigate to the register page */}
                  <button className="button" onClick={() => navigate('/register')}>Sign up</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second section with gradient background and text + small video */}
        <div className="page">
          <div className="homepage fullHeightSection gradientBackground">
            <div className="contentContainer">
              <div className="infoSection">
                {/* Section explaining the purpose of the project management system */}
                <h1 className="title">WHAT IS AASYP PMS?</h1>
                <p className="description">
                  Our mission is to empower teams and individuals to achieve their goals efficiently through a user-friendly project management platform. We strive to provide a seamless collaboration experience, enabling users to streamline workflows, track progress, and deliver projects on time.
                </p>
              </div>
              <div className="videoContainer">
                {/* Small video explaining the features of the project management system */}
                <video autoPlay loop muted className="videoSmall">
                  <source src={`${process.env.PUBLIC_URL}/PMS.mp4`} type="video/mp4" />
                  {/* Fallback text for unsupported browsers */}
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* Third section with contact information */}
        <div className="page">
          {/* Background video for the contact page */}
          <video autoPlay loop muted className="video-background">
            <source src={`${process.env.PUBLIC_URL}/24 uwa capstone Group20 webpage background video.mp4`} type="video/mp4" />
            {/* Fallback text for unsupported browsers */}
            Your browser does not support the video tag.
          </video>
          <div className="overlay">
            <div className="content">
              {/* Contact section with email and social media links */}
              <h1 className="title">CONTACT US</h1>
              <div className="info">
                {/* Email contact information */}
                <p className="label">EMAIL</p>
                <p className="value">team@aasyp.org</p>
                {/* Social media links */}
                <p className="label">SOCIAL</p>
                <div className="socialIcons">
                  {/* Links to external social media pages */}
                  <a href="https://twitter.com/ausaseanyouth" className="icon" target="_blank" rel="noopener noreferrer">
                    <img src="/twitter.png" alt="Twitter" className="social-icon-img" />
                  </a>
                  <a href="https://www.facebook.com/aasyp" className="icon" target="_blank" rel="noopener noreferrer">
                    <img src="/facebook.png" alt="Facebook" className="social-icon-img" />
                  </a>
                  <a href="https://www.instagram.com/aus_aseanyouth/" className="icon" target="_blank" rel="noopener noreferrer">
                    <img src="/ins.png" alt="Instagram" className="social-icon-img" />
                  </a>
                  <a href="https://www.linkedin.com/company/aasyp" className="icon" target="_blank" rel="noopener noreferrer">
                    <img src="/linkedin.png" alt="LinkedIn" className="social-icon-img" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default HomePage;
