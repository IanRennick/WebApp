// src/components/nav/layouts/DashboardLayout.tsx
// =========================================================================
// REUSABLE DASHBOARD LAYOUT SYSTEM (WITH LIVE LOG OUT LIFECYCLE)
// =========================================================================
import React from 'react';
import { Outlet } from 'react-router-dom';
import { User, BarChart3, FileText, Mic, Settings, LogOut } from 'lucide-react';
import { Sidebar, SidebarItem } from '../../nav/sidebar/Sidebar';
import useLogOut from '../../../hooks/auth/useLogOut'; // ✅ NEW: Import your session hook
import './dashboardLayout.css';

const DashboardLayout: React.FC = () => {
  // ✅ NEW: Instantiate your secure session revocation dispatcher function
  const logOutUser = useLogOut();

  return (
    <div className="dashboard_layout_master_wrapper">
      
      {/* 🧭 PANEL 1: Shared Left Navigation Column Tray */}
      <Sidebar>
        <SidebarItem icon={<User size={18} />} text="Profile" to="/profile" />
        <SidebarItem icon={<BarChart3 size={18} />} text="Statistics" to="/profile/stats" alert />
        <SidebarItem icon={<FileText size={18} />} text="My Writings" to="/profile/writings" />
        <SidebarItem icon={<Mic size={18} />} text="My Speakings" to="/profile/speakings" />
        <SidebarItem icon={<Settings size={18} />} text="Settings" to="/profile/settings" />
        
        {/* ✅ FIXED: Bound to your logout hook execution cycle while dropping dead URL paths! */}
        <SidebarItem 
          icon={<LogOut size={18} />} 
          text="Log Out" 
          onClick={logOutUser} 
        />
      </Sidebar>

      {/* 🖥️ PANEL 2: Dynamic Right Content Column Viewport */}
      <main className="dashboard_layout_content_viewport">
        <Outlet />
      </main>

    </div>
  );
};

export default DashboardLayout;