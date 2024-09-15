import React from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import '../styles/HomePage.css';



const HomePage = () => {
  const navigate = useNavigate(); // 使用 useNavigate 进行路由跳转

  return (
    <div className="container">
      <div className="page">
        <div className="homepage fullHeightSection">
          <video autoPlay loop muted className="video-background">
            <source src={`${process.env.PUBLIC_URL}/24 uwa capstone Group20 webpage background video.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="overlay">
            <div className="textContainer">
              <h1 className="title">PROJECT MANAGEMENT SYSTEM</h1>
              <div className="buttonsContainer">
                <button className="button" onClick={() => navigate('/login')}>Sign in</button>
                <button className="button" onClick={() => navigate('/register')}>Sign up</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page">
  <div className="homepage fullHeightSection gradientBackground">
    <div className="contentContainer">
      <div className="infoSection">
        <h1 className="title">WHAT IS AASYP PMS?</h1>
        <p className="description">
          Our mission is to empower teams and individuals to achieve their goals efficiently through a user-friendly project management platform. We strive to provide a seamless collaboration experience, enabling users to streamline workflows, track progress, and deliver projects on time.
        </p>
      </div>
      <div className="videoContainer">
        <video autoPlay loop muted className="videoSmall">
          <source src={`${process.env.PUBLIC_URL}/PMS.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </div>
</div>


      <div className="page">
        <video autoPlay loop muted className="video-background">
          <source src={`${process.env.PUBLIC_URL}/24 uwa capstone Group20 webpage background video.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay">
          <div className="content">
            <h1 className="title">CONTACT US</h1>
            <div className="info">
              <p className="label">PHONE</p>
              <p className="value">(123) 456-7890</p>
              <p className="label">EMAIL</p>
              <p className="value">team@aasyp.org</p>
              <p className="label">SOCIAL</p>
              <div className="socialIcons">
                <a href="#" className="icon"><i className="fab fa-tumblr"></i></a>
                <a href="#" className="icon"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="icon"><i className="fab fa-youtube"></i></a>
                <a href="#" className="icon"><i className="fab fa-instagram"></i></a>
                <a href="#" className="icon"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
