// src/components/nav/navbar/Navbar.tsx
// =========================================================================
// RESPONSIVE INTERACTIVE PLATFORM HEADER MODULE (NAVIGATION BAR V1)
// =========================================================================
// - Mounts high-fidelity reactive anchor nodes to shift application viewports.
// - Handles collapsible canvas state sliders for mobile viewport breakpoints.
// - Intelligently reads global login tokens to swap log-in paths for profile targets.
// =========================================================================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpaceAwesome } from "react-icons/fa6";
import { FaBars, FaTimes } from 'react-icons/fa';
import { selectCurrentToken } from '../../../features/auth/authSlice';
import { useAppSelector } from '../../../hooks/hooks';
import './navbar.css';

const Navbar: React.FC = () => {
  // Mobile canvas sliding shelf visibility indicator toggle
  const [toggle, setToggle] = useState<boolean>(false);

  // Layout presentation modifier triggers
  const handleToggle = (): void => setToggle(!toggle);
  const handleClose = (): void => setToggle(false);

  // Read the active token out of global memory to dynamically adjust access buttons
  const token = useAppSelector(selectCurrentToken);

  return (
    <div className="navbar">
      <div className="navbar_container container">
        
        {/* BRAND IDENTITY LINK HUB */}
        <Link to="/" className="navbar_logo" onClick={handleClose}>
          <FaSpaceAwesome className="logo_icon" />
          Rennlad Academy
        </Link>                 

        {/* RESPONSIVE MOBILE ACCESSIBILITY BREAKPOINT TRIGGER
            Swaps between an open menu bars graphic and a close icon indicator */}
        <div className="navbar_toggle" onClick={handleToggle}>
          {toggle ? (
            <FaTimes className="toggle_icon1" />
          ) : (
            <FaBars className="toggle_icon2" />
          )}
        </div>

        {/* EXPANDABLE CORE LINKS CONSOLE SHELF */}
        <ul className={toggle ? "navbar_menu active" : "navbar_menu"}>
          
          {/* USER DISCOVERY FIELD CHANNEL (FUTURE EXPANSION FEATURE) */}
          <li className="menu_search_container">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                className="search_input" 
                type="text" 
                placeholder="Search"
              />
              <button type="submit" style={{ display: "none" }}></button>
            </form>
          </li>

          {/* APPLICATION VIEW NAVIGATION NODES */}
          <li className="menu_link_container" onClick={handleClose}>
            <Link to="/quiz" className="menu_link">
              Puzzles
            </Link>
          </li>

          <li className="menu_link_container" onClick={handleClose}>
            <Link to="/" className="menu_link">
              Writings
            </Link>
          </li>

          <li className="menu_link_container" onClick={handleClose}>
            <Link to="/" className="menu_link">
              Speakings
            </Link>
          </li>

          {/* INTERACTIVE ACCESS GATEWAY BUTTON
              Intelligently updates layout targets based on user authentication flags.
              Swaps entry paths for profile dashboards once token handshakes complete. */}
          <li className="menu_button_container" onClick={handleClose}>
            {!token ? (
              <Link to="/logIn" className="menu_button">
                Log In
              </Link>  
            ) : (
              <Link to="/profile" className="menu_button">
                Account
              </Link> 
            )}
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Navbar;