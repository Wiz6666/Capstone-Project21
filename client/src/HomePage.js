// HomePage.js
import React from 'react';
import Footer from './Footer';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* 直接使用 <video> 标签设置背景视频 */}
      <video autoPlay loop muted className="video-background">
        <source src={`${process.env.PUBLIC_URL}/24 uwa capstone Group20 webpage background video.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content">
        <header className="header">
          <h1 className="project-title">Project Management System</h1>
          <div className="auth-buttons">
            <button className="auth-button">Sign up</button>
            <button className="auth-button">Sign in</button>
          </div>
        </header>

        <section className="mission">
          <p>
            Our mission is to empower teams and individuals to achieve their goals efficiently through a user-friendly project management platform.
            We strive to provide a seamless collaboration experience, enabling users to streamline workflows, track progress, and deliver projects on time.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
