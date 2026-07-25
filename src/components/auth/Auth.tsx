// src/components/auth/Auth.tsx
// =========================================================================
// CENTRAL INTERFACE ORCHESTRATOR & SPLIT-VIEW MODULE (MAIN AUTH COUPLER)
// =========================================================================
// - Acts as the primary orchestrator hub for all entry pages.
// - Sets up a responsive split-screen viewport layout frame.
// - Evaluates location states to mount correct data capture form cards.
// =========================================================================
import React from 'react';
import './auth.css';
import AuthDisplay from './authDisplay/AuthDisplay';
import LogInForm from './authForms/LogInForm';
import RegisterForm from './authForms/RegisterForm';

interface AuthProps {
  page: 'logIn' | 'register'; 
}

const Auth: React.FC<AuthProps> = ({ page }) => {
  return (
    <div className="auth_container">
      
      {/* -------------------------------------------------------------------
          1. BRANDING VISUAL DISPLAY BACKDROP PANEL
          -------------------------------------------------------------------
          Mounts the common graphic hero display block on the side of the 
          split screen, feeding it the current destination state to coordinate 
          footer redirection routing link text automatically. */}
      <AuthDisplay page={page} />

      {/* -------------------------------------------------------------------
          2. DYNAMIC FORM CONTAINER CONDITIONAL GATE
          -------------------------------------------------------------------
          Acts as a clean, conditional switch matrix. If the user is directed 
          here via login routes, it opens up the short-credentials card. 
          If they navigate to signup nodes, it mounts the full validation field grid. */}
      {page === 'logIn' ? (
        <LogInForm />
      ) : (
        <RegisterForm />
      )}
      
    </div>
  );
};

export default Auth;