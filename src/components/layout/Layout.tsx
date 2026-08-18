// src/components/layout/Layout.tsx
// =========================================================================
// ROOT LAYOUT SHELL FRAMEWORK (SYNCED WEBSOCKET HELPDESK ENGINE ENABLED)
// =========================================================================
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../nav/navbar/Navbar';
import Footer from '../nav/footer/Footer';
import { ChatBubbleWidget } from '../chats/chatBubbleWidget/ChatBubbleWidget'; // ✅ IMPORT FLOATING SUPPORT WIDGET

const Layout: React.FC = () => {
  const location = useLocation();

  const authPaths = ['/logIn', '/register'];
  const shouldHideNavbar = authPaths.includes(location.pathname);

  return (
    <div className="app_layout_wrapper">
      
      {!shouldHideNavbar && <Navbar />}
      
      <main className="main_content_viewport">
        <Outlet />
      </main>

      {/* ✅ INSTANTIATE THE FLOATING SUITE MESSENGER
          This places the round round launcher bubble badge pinned down in the 
          viewport corner on every single view route, completely running its own 
          ActionCable websocket data channel lines automatically behind the scenes! */}
      {!shouldHideNavbar && <ChatBubbleWidget />}

      {!shouldHideNavbar && <Footer />}
    </div>
  );
};

export default Layout;