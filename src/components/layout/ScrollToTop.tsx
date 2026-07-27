// src/components/layout/ScrollToTop.tsx
// =========================================================================
// UNIVERSAL VIEWPORT SCROLL-TO-TOP ROUTING LIFECYCLE CONTROLLER
// =========================================================================
// - Monitors the application router for active browser URL path modifications.
// - Forces the viewport window context to snap to the absolute top (0,0).
// - Guarantees pristine page landing alignments 100% of the time.
// =========================================================================
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  // Capture an active tracker snapshot of the current URL paths map
  const { pathname, search } = useLocation();

  useEffect(() => {
    // The moment either the main path string OR the query parameters update,
    // instantly force the browser screen frame to snap back to the coordinate top!
    window.scrollTo(0, 0);
  }, [pathname, search]); // Runs automatically on every single navigation event change

  // This is a pure background structural listener, so it returns absolutely no markup html
  return null;
};

export default ScrollToTop;