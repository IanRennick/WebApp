// src/components/nav/navbar/Navbar.tsx
// =========================================================================
// RESPONSIVE INTERACTIVE PLATFORM HEADER MODULE (NAVIGATION BAR V1)
// =========================================================================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpaceAwesome } from "react-icons/fa6";
import { FaBars, FaTimes } from 'react-icons/fa';
import Avatar from '@mui/material/Avatar'; 
import Badge from '@mui/material/Badge';   
import { selectCurrentToken, selectCurrentUser } from '../../../features/auth/authSlice';
import { useAppSelector } from '../../../hooks/hooks';
import './navbar.css';

const Navbar: React.FC = () => {
  const [toggle, setToggle] = useState<boolean>(false);

  const handleToggle = (): void => setToggle(!toggle);
  const handleClose = (): void => setToggle(false);

  // Synchronously pull down your token and active global cached user profile variables
  const token = useAppSelector(selectCurrentToken);
  const user = useAppSelector(selectCurrentUser);

  // Safely read values cross-mapping your camelCase properties
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : '?';
  const unreadAlerts = user?.unreadNotificationsCount || 0;

  return (
    <div className="navbar">
      <div className="navbar_container container">
        
        {/* BRAND IDENTITY LINK HUB */}
        <Link to="/" className="navbar_logo" onClick={handleClose}>
          <FaSpaceAwesome className="logo_icon" />
          Rennlad Academy
        </Link>                 

        {/* RESPONSIVE MOBILE ACCESSIBILITY BREAKPOINT TRIGGER */}
        <div className="navbar_toggle" onClick={handleToggle}>
          {toggle ? <FaTimes className="toggle_icon1" /> : <FaBars className="toggle_icon2" />}
        </div>

        {/* EXPANDABLE CORE LINKS CONSOLE SHELF */}
        <ul className={toggle ? "navbar_menu active" : "navbar_menu"}>
          
          <li className="menu_search_container">
            <form onSubmit={(e) => e.preventDefault()}>
              <input className="search_input" type="text" placeholder="Search" />
              <button type="submit" style={{ display: "none" }}></button>
            </form>
          </li>

          <li className="menu_link_container" onClick={handleClose}>
            <Link to="/quiz" className="menu_link">Puzzles</Link>
          </li>

          <li className="menu_link_container" onClick={handleClose}>
            <Link to="/writings" className="menu_link">Writings</Link>
          </li>

          <li className="menu_link_container" onClick={handleClose}>
            <Link to="/speakings" className="menu_link">Speakings</Link>
          </li>

          {/* INTERACTIVE ACCESS GATEWAY BUTTON */}
          <li className="menu_button_container" onClick={handleClose}>
            {!token ? (
              <Link to="/logIn" className="menu_button">Log In</Link>  
            ) : (
              <Link to="/profile" className="navbar_avatar_link_wrapper" title="Go to account dashboard">
                <Badge 
                  badgeContent={unreadAlerts} 
                  color="error"
                  max={9}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: '#2563eb', 
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      width: 40,
                      height: 40,
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      transition: 'all 150ms ease',
                      '&:hover': {
                        borderColor: '#2563eb',
                        transform: 'scale(1.04)'
                      }
                    }}
                  >
                    {userInitial}
                  </Avatar>
                </Badge>
              </Link>
            )}
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Navbar;