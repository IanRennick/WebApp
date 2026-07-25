// src/components/layout/Layout.tsx
// =========================================================================
// ROOT LAYOUT SHELL FRAMEWORK (MASTER VIEWPORTS ENVELOPE)
// =========================================================================
// - Provides a universal skeletal layout container around the whole app.
// - Houses global navigation bars and sticky notification sub-headers.
// - Evaluates active URL strings to hide header bars on auth form portals.
// =========================================================================
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../nav/navbar/Navbar';

const Layout: React.FC = () => {
  // Capture the browser's current active URL location track snapshot
  const location = useLocation();

  // -----------------------------------------------------------------------
  // NAVIGATION VISIBILITY LOGIC PERIMETER
  // -----------------------------------------------------------------------
  // Checks if the user is actively sitting inside an authentication screen.
  // Add any path to this list to automatically hide your navbar there!
  // -----------------------------------------------------------------------
  const authPaths = ['/logIn', '/register'];
  const shouldHideNavbar = authPaths.includes(location.pathname);

  return (
    <div className="app_layout_wrapper">
      
      {/* GLOBAL NAVIGATION CONTROL CENTRE
          Renders your custom navigation dashboard frame on all standard pages,
          but vanishes entirely when students view the login/registration splash screens. */}
      {!shouldHideNavbar && <Navbar />}
      
      {/* MAIN VIEWPORT ROUTING GATEWAY
          Acts as the active presentation frame container. React Router swaps
          interior sub-views (like HomePage, ProfilePage, or QuizPage) directly
          into this slot depending on the browser URL path. */}
      <main className="main_content_viewport">
        <Outlet />
      </main>

    </div>
  );
};

export default Layout;