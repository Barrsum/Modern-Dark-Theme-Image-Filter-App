// src/components/Footer.jsx
import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa'; // Import necessary icons
import './Footer.css'; // We'll create this CSS file next

function Footer() {
  return (
    <footer className="app-footer">
      <p>Created by Ram Bapat</p>
      <div className="social-links">
        <a
          href="https://www.linkedin.com/in/ram-bapat-barrsum-diamos"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          title="LinkedIn Profile" // Add title for tooltip
        >
          <FaLinkedin />
        </a>
        <a
          href="https://github.com/Barrsum/Modern-Dark-Theme-Image-Filter-App.git"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
          title="GitHub Repository" // Add title for tooltip
        >
          <FaGithub />
        </a>
      </div>
      <p className="connect-text">Connect above</p> {/* Use <p> instead of <h7> */}
    </footer>
  );
}

export default React.memo(Footer); // Footer content is static, memoize it

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos