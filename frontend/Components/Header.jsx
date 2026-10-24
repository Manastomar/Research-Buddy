import React from 'react'
import logo from "../Images/Logo.jpeg";
import './Header.css'

function Header({ onSignInClick, onHomeClick, onToolSelect }) {
  return (
    <nav className='header-nav'>
      <div className='header-container'>
        {/* Left Section: Brand Logo & Title */}
        <div className='header-left'>
          <div onClick={onHomeClick} className='header-logo-container'>
            <div className='header-logo-box'>
              <img src={logo} alt="Logo" className="header-logo-img"/>
            </div>
            <div className='header-brand-title'>
              Research Buddy
            </div>
          </div>
        </div>

        {/* Center Section: Tools Navigation Links */}
        <div className='header-center'>
          <div className='header-menu'>
            <button
              onClick={() => onToolSelect ? onToolSelect('generator') : onHomeClick()}
              className="header-menu-btn"
            >
              AI Generator
            </button>
            <button
              onClick={() => onToolSelect ? onToolSelect('detector') : onHomeClick()}
              className="header-menu-btn"
            >
              AI Detector
            </button>
            <button
              onClick={() => onToolSelect ? onToolSelect('humanizer') : onHomeClick()}
              className="header-menu-btn"
            >
              AI Humanizer
            </button>
          </div>
        </div>

        {/* Right Section: Sign In Button at edge */}
        <div className='header-right'>
          <button onClick={onSignInClick} className="header-signin-btn">
            Sign in
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Header
