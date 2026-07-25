// src/components/auth/authDisplay/AuthDisplay.tsx
// =========================================================================
// PRESENTATION SHOWCASE & NAVIGATION TOGGLE CARD (AUTH DISPLAY PANEL)
// =========================================================================
// - Mounts high-fidelity background cinematic video loops for app branding.
// - Houses core marketing slogans and welcoming platform subtitles.
// - Evaluates user navigation locations to swap contextual signup/login links.
// =========================================================================
import React from 'react';
import './authDisplay.css';
import video from '../../../videos/Spaceship2.mp4';
import { Link } from 'react-router-dom';

interface AuthDisplayProps {
  page: 'logIn' | 'register';
}

const AuthDisplay: React.FC<AuthDisplayProps> = ({ page }) => {
  return (
    <div className="authDisplay_container">
      
      {/* -------------------------------------------------------------------
          1. CINEMATIC BACKGROUND LAYER
          -------------------------------------------------------------------
          Loads a muted, looping mp4 video file to serve as the animated
          aesthetic frame backdrop behind the authentication panel. */}
      <video className="auth_video" src={video} autoPlay muted loop></video>

      {/* -------------------------------------------------------------------
          2. PLATFORM HERO BRANDING HEADER
          ------------------------------------------------------------------- */}
      <div className="display_banner">
        <h2 className="banner_title">Welcome to Rennlad Academy</h2>
        <p className="banner_text">Which will definitely one day be a real website</p>
      </div>

      {/* -------------------------------------------------------------------
          3. DYNAMIC CROSS-OVER NAVIGATION ROUTER LINKS
          -------------------------------------------------------------------
          Intelligently reads the current parent layout viewport status.
          If the student is looking at a login screen, it builds subtext
          and action buttons directing them to the user creation form.
          If they are signing up, it shifts options to direct them back. */}
      <div className="link_container">
        
        {/* Dynamic Context Description String */}
        <span className="link_text">
          {page === "logIn" ? "Don't have an account?" : "Have an account?"}
        </span>

        {/* Dynamic Navigation Action Target */}
        <Link to={page === "logIn" ? "/register" : "/logIn"}>
          <button className="link_button">
            {page === "logIn" ? "Sign Up" : "Log In"}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AuthDisplay;