// src/pages/auth/RegisterPage.tsx
// =========================================================================
// NEW STUDENT ACCREDITATION CONTAINER VIEW (REGISTRATION PAGE)
// =========================================================================
// - Provides a clean structural layout viewport boundary context.
// - Isolates the authentication display panels from core dashboard views.
// - Mounts the centralized shared orchestrator pre-calibrated to signup modes.
// =========================================================================
import React from 'react';
import Auth from '../../components/auth/Auth';
import './authPage.css';

const RegisterPage: React.FC = () => {
  return (
    <div className="authPage_container">
      
      {/* CENTRAL AUTHENTICATION HOUSING BLOCK
          Mounts the shared layout orchestrator pane. By explicitly setting 
          the layout target attribute here, we instruct the downstream forms 
          and background videos to render the student sign-up workflow. */}
      <Auth page="register" />
      
    </div>
  );
};

export default RegisterPage;