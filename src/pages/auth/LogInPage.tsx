// src/pages/auth/LogInPage.tsx
// =========================================================================
// RETURNING USER ACCREDITATION CONTAINER VIEW (LOG IN PAGE)
// =========================================================================
// - Provides a clean structural layout viewport boundary context.
// - Isolates the authentication display panels from core dashboard views.
// - Mounts the centralized shared orchestrator pre-calibrated to login modes.
// =========================================================================
import React from 'react';
import Auth from '../../components/auth/Auth';
import './authPage.css';

const LogInPage: React.FC = () => {
  return (
    <div className="authPage_container">
      
      {/* CENTRAL AUTHENTICATION HOUSING BLOCK
          Mounts the shared layout orchestrator pane. By explicitly setting 
          the layout target attribute here, we instruct the downstream forms 
          and background videos to render the standard log-in workflow. */}
      <Auth page="logIn" />
      
    </div>
  );
};

export default LogInPage;