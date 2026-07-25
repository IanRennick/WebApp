// src/App.tsx
// =========================================================================
// CENTRAL APPLICATION ROUTING MATRIX INTERFACE (MASTER ROUTER)
// =========================================================================
// - Defines the entry points and navigation pathways for the whole app.
// - Sets up the structural core that maps browser URLs to specific page views.
// - Separates open public pathways from restricted, secure student zones.
// =========================================================================
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/profile/ProfilePage';
import QuizPage from './pages/quiz/QuizPage';
import LogInPage from './pages/auth/LogInPage';
import RegisterPage from './pages/auth/RegisterPage';
import RequireAuth from './components/layout/RequireAuth';
import PersistLogIn from './components/layout/PersistLogIn';

const App: React.FC = () => {
  return (
    <Routes>
      {/* MASTER APPLICATION SHELL CONTAINER
          Wraps all navigation nodes inside the universal Layout framework. 
          This allows structural elements like your upcoming navbar to stay mounted 
          consistently while interior screen templates switch out underneath. */}
      <Route path="/" element={<Layout />}>
        
        {/* =================================================================
            1. OPEN PUBLIC NAVIGATION ENDPOINTS
            =================================================================
            Pathways accessible to anyone browsing the web application. 
            Contains standard home index gateways and credentials forms portals. 
            ----------------------------------------------------------------- */}
        <Route index element={<HomePage />} />
        <Route path="/logIn" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* =================================================================
            2. RESTRICTED PRIVATE STUDENT ENCLAVES (ROUTE SHIELD ENVELOPE)
            =================================================================
            Nests private dashboards behind layers of security logic gate keepers.
            ----------------------------------------------------------------- */}
        {/* INTERCEPTOR LAYER A: SESSION RECOVERY SHELL
            Intercepts initial page reboots to silently check the browser's 
            encrypted cookie drawer for valid refresh tokens before rendering views. */}
        <Route element={<PersistLogIn />}>
          
          {/* INTERCEPTOR LAYER B: ROUTE GUARD SHIELD
              Asserts the presence of an active token in state memory. If empty, 
              it blocks access and throws the user straight back to the login screen. */}
          <Route element={<RequireAuth />}>
            
            {/* Private Student Dashboard Workspaces */}
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;