// src/components/nav/footer/Footer.tsx
// =========================================================================
// CENTRAL APPLICATION MAP FOOTER PANEL (FOOTER COMPONENT V1)
// =========================================================================
// - Organises deep navigation anchor grids for rapid platform traversal.
// - Features safe external social media anchors with cross-site script blocks.
// - Embeds core promotional slogans and brand identity metadata elements.
// =========================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { FaSpaceAwesome } from 'react-icons/fa6';
import './footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer_container">
      <div className="footer_wrapper">
        <div className="links_container">
          
          {/* --- LEFT COLUMNS GROUP --- */}
          <div className="links_wrapper">
            
            {/* PUZZLE VARIANT ANCHOR LINKS */}
            <div className="link_items">
              <h1 className="link_title">Puzzles</h1>
              <Link to="/quiz" className="footer_link">Multiple Choice</Link>
              <Link to="/quiz" className="footer_link">Open Cloze</Link>
              <Link to="/quiz" className="footer_link">Word Formation</Link>
              <Link to="/quiz" className="footer_link">Sentence Cloze</Link>
            </div>

            {/* CURRICULUM PRACTICE TRACKS */}
            <div className="link_items">
              <h1 className="link_title">Practice</h1>
              <Link to="/" className="footer_link">Exams</Link>
              <Link to="/" className="footer_link">Writings</Link>
              <Link to="/" className="footer_link">Speakings</Link>
              <Link to="/quiz" className="footer_link">Weaknesses</Link>
            </div>
          </div>

          {/* --- RIGHT COLUMNS GROUP --- */}
          <div className="links_wrapper">
            
            {/* ACCOUNT MANAGEMENT SECTOR */}
            <div className="link_items">
              <h1 className="link_title">Account</h1>
              <Link to="/profile" className="footer_link">Profile</Link>
              <Link to="/" className="footer_link">Statistics</Link>
              <Link to="/profile" className="footer_link">Achievements</Link>
              <Link to="/profile" className="footer_link">Settings</Link>
            </div>
               
            {/* ABOUT & REPORTING GATEWAYS */}
            <div className="link_items">
              <h1 className="link_title">About</h1>
              <Link to="/" className="footer_link">Classes</Link>
              <Link to="/" className="footer_link">Subscriptions</Link>
              <Link to="/" className="footer_link">Contact</Link>
              <Link to="/" className="footer_link">Report Bugs</Link>
            </div>   
          </div>
        </div>

        {/* --- BRANDING & SOCIAL MEDIA STRIP --- */}
        <div className="social_media">
          <div className="social_wrapper">
            
            <Link to="/" className="social_logo">
              <FaSpaceAwesome className="logo_icon" />
              Rennlad Academy
            </Link>

            <small className="social_message">
              Learning English made fun!
            </small>

            <div className="social_icons">
              <div>
                <a href="https://facebook.com" className="icon_link" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FaFacebook />
                </a>
              </div>
              <div>
                <a href="https://instagram.com" className="icon_link" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
              </div>
              <div>
                <a href="https://youtube.com" className="icon_link" target="_blank" rel="noreferrer" aria-label="YouTube">
                  <FaYoutube />
                </a>
              </div>
              <div>
                <a href="https://twitter.com" className="icon_link" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <FaTwitter />
                </a>
              </div>
              <div>
                <a href="https://linkedin.com" className="icon_link" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;