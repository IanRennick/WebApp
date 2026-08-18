// src/components/nav/layouts/DashboardLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { User, BarChart3, FileText, Settings, LogOut } from 'lucide-react';
import { Sidebar, SidebarItem } from '../../nav/sidebar/Sidebar';
import useLogOut from '../../../hooks/auth/useLogOut';
import { useGetNotificationsListQuery } from '../../../features/notifications/notificationsApiSlice'; // ✅ Import your notifications query slice hook
import './dashboardLayout.css';

const DashboardLayout: React.FC = () => {
  const logOutUser = useLogOut();

  const { data: notifData } = useGetNotificationsListQuery();

  // ✅ CHECK UNREADS: Scan if any notification targets an evaluation update or unread submission task
  const hasUnreadSubmissions = notifData?.notifications?.some(
    (n) => !n.read && (n.event_type === 'writing_feedback' || n.submission_id !== undefined)
  ) || false;

  return (
    <div className="dashboard_layout_master_wrapper">
      
      <Sidebar>
        <SidebarItem icon={<User size={18} />} text="Profile" to="/profile" />
        <SidebarItem icon={<BarChart3 size={18} />} text="Statistics" to="/stats" />
        
        {/* ✅ LIVE INDICATOR LOCKED: Passes the alert boolean flag contextually 
            whenever a new correction sheet hits the user's account backend profile! */}
        <SidebarItem 
          icon={<FileText size={18} />} 
          text="Submissions" 
          to="/submissions" 
          alert={hasUnreadSubmissions} 
        />
        
        <SidebarItem icon={<Settings size={18} />} text="Settings" to="/settings" />
        <SidebarItem icon={<LogOut size={18} />} text="Log Out" onClick={logOutUser} />
      </Sidebar>

      <main className="dashboard_layout_content_viewport">
        <Outlet />
      </main>

    </div>
  );
};

export default DashboardLayout;