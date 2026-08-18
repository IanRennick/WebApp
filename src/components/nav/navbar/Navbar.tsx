import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpaceAwesome } from "react-icons/fa6";
import { FaBars, FaTimes } from 'react-icons/fa';
import Avatar from '@mui/material/Avatar'; 
import Badge from '@mui/material/Badge';   
import { selectCurrentToken, selectCurrentUser } from '../../../features/auth/authSlice';
import { useGetNotificationsListQuery } from '../../../features/notifications/notificationsApiSlice';
import { useAppSelector } from '../../../hooks/hooks';
import './navbar.css';

const Navbar: React.FC = () => {
  const [toggle, setToggle] = useState<boolean>(false);

  const handleToggle = (): void => setToggle(!toggle);
  const handleClose = (): void => setToggle(false);

  const token = useAppSelector(selectCurrentToken);
  const user = useAppSelector(selectCurrentUser);


  const { data: notifData } = useGetNotificationsListQuery(undefined, {
    skip: !token || !user?.username
  });

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : '?';
  const unreadAlerts = notifData?.notifications 
    ? notifData.notifications.filter((n: any) => n.event_type !== 'new_chat_message' && !n.read).length
    : notifData?.unread_count || 0;

  return (
    <div className="navbar">
      <div className="navbar_container container">
        
        <Link to="/" className="navbar_logo" onClick={handleClose}>
          <FaSpaceAwesome className="logo_icon" />
          Rennlad Academy
        </Link>                 

        <div className="navbar_toggle" onClick={handleToggle}>
          {toggle ? <FaTimes className="toggle_icon1" /> : <FaBars className="toggle_icon2" />}
        </div>

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
                  {/* ✅ FIXED: Restored clean Material-UI Avatar component back into the Badge loop!
                      Stripped out the hover scaling animations, manual image tags, and custom mouse listeners. */}
                  <Avatar 
                    src={user?.avatarUrl || undefined}
                    sx={{ 
                      bgcolor: '#2563eb', 
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      width: 40,
                      height: 40,
                      cursor: 'pointer'
                    }}
                  >
                    {/* Native fallback text string only evaluates if src string is empty/null */}
                    {!user?.avatarUrl && userInitial}
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