// src/components/Header.jsx
import React from 'react';
import './Header.css';
// You can import icons from a library like react-icons if you want
// import { FaSun, FaMoon } from 'react-icons/fa';

function Header({ theme, toggleTheme }) {
  return (
    <header className="app-header">
      <h1 className="app-title">Simple Image Filters - Created by Ram Bapat</h1>
      <button onClick={toggleTheme} className="theme-toggle-button" aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
        {/* Example with text labels */}
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        {/* Example with icons (install react-icons: npm install react-icons) */}
        {/* {theme === 'light' ? <FaMoon /> : <FaSun />} */}
      </button>
    </header>
  );
}

export default React.memo(Header); // Memoize if props don't change often

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos