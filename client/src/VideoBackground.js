// VideoBackground.js
import React from 'react';
import './VideoBackground.css';

const VideoBackground = ({ videoSrc }) => {
  return (
    <div className="video-background-container">
      <video autoPlay loop muted className="video-background">
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground;
