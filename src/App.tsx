// src/App.tsx
// =========================================================================
// CENTRAL APPLICATION ROUTING MATRIX INTERFACE (MASTER ROUTER)
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
import DashboardLayout from './components/layout/dashboardLayout/DashboardLayout';
import StatsPage from './pages/stats/StatsPage';
import WritingsPage from './pages/writings/WritingsPage';
import SpeakingsPage from './pages/speakings/SpeakingsPage';
import SubmissionsPage from './pages/submissions/SubmissionsPage';
import SettingsPage from './pages/settings/SettingsPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        {/* =================================================================
            🔄 CENTRAL APPLICATION LIFECYCLE RECOVERY SHELL
            Positioned at the root to seamlessly restore authorized user sessions 
            on hard refreshes across ALL pages, public and private alike!
            ================================================================= */}
        <Route element={<PersistLogIn />}>

          {/* 🌐 1. OPEN PUBLIC PATHWAYS (ACCESSIBLE TO GUESTS & STUDENTS) */}
          <Route index element={<HomePage />} />
          <Route path="/logIn" element={<LogInPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* =================================================================
              🔒 2. RESTRICTED SECURITY ROUTE SHIELD GATES
              Blocks unauthenticated guests from bypassing study enclaves.
              ================================================================= */}
          <Route element={<RequireAuth />}>
            
            {/* Standard Private Study Workspaces */}
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/writings" element={<WritingsPage />} />
            <Route path="/speakings" element={<SpeakingsPage />} />

            {/* Sidebar-Enclosed Account Account Portals */}
            <Route element={<DashboardLayout />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            
          </Route>
        </Route>

      </Route>
    </Routes>
  );
};

export default App;