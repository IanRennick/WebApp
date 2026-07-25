// src/components/layout/RequireAuth.tsx
// =========================================================================
// APPLICATION ACCESS SECURITY GATEKEEPER (ROUTE ACCESS SHIELD)
// =========================================================================
// - Asserts and confirms the presence of active user tokens before rendering.
// - Intercepts unauthenticated browsing events to block private page loads.
// - Caches intended navigation histories to enable silent recovery redirects.
// =========================================================================
import React from 'react';
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from '../../hooks/hooks';
import { selectCurrentToken } from '../../features/auth/authSlice';

const RequireAuth: React.FC = () => {
  // Extract the active access token directly from global frontend state memory
  const token = useAppSelector(selectCurrentToken);

  // Capture a snapshot of the exact private URL path the user is attempting to view
  const location = useLocation();

  // -----------------------------------------------------------------------
  // COMPONENT RENDERING GATEKEEPER CONDITION
  // -----------------------------------------------------------------------
  return token ? (
    // SECURITY CLEARED: A valid token exists. Mount the requested interior layout
    // sub-views (like the Quiz page or Profile dashboard) right into the viewport template.
    <Outlet />
  ) : (
    // ACCESS DENIED: No active token found. Stop the page load and deflect the viewport
    // straight to the login panel view.
    //
    // CRUCIAL UX LOGIC: We pack the intended path history directly into the router's 
    // background state memory container. This lets our login hook read it on successful 
    // authentications, recovering their place instantly without forcing them back to the root!
    <Navigate to="/logIn" state={{ from: location }} replace />
  );
};

export default RequireAuth;