// src/components/nav/sidebar/Sidebar.tsx
// =========================================================================
// RESPONSIVE COMPOUND ACCOUNT MANAGEMENT SIDEBAR PORTAL MODULE (V1)
// =========================================================================
import React, { useState, createContext, useContext, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react';
import Avatar from '@mui/material/Avatar';
import { selectCurrentUser } from '../../../features/auth/authSlice';
import { useAppSelector } from '../../../hooks/hooks';
import './sidebar.css';

interface SidebarContextType {
  expanded: boolean;
}

interface SidebarProps {
  children: ReactNode;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to?: string;        // Made optional so action items like Log Out don't require dead routes
  onClick?: () => void; // ✅ NEW: Optional click execution handler pointer
  alert?: boolean;    
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// =========================================================================
// PARENT CONTAINER WRAPPER COMPONENT
// =========================================================================
export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  
  const user = useAppSelector(selectCurrentUser);
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <aside className={`account_sidebar_aside ${expanded ? 'expanded_aside' : 'collapsed_aside'}`}>
      <nav className="sidebar_nav_frame">
        
        <div className="sidebar_upper_header">
          <div className={`sidebar_branding_logo_text ${expanded ? 'logo_visible' : 'logo_hidden'}`}>
            Rennlad Academy
          </div>
          <button
            type="button"
            onClick={() => setExpanded((curr) => !curr)}
            className="sidebar_toggle_collapse_btn"
            aria-label={expanded ? 'Minimize side menu drawer' : 'Maximize side menu drawer'}
          >
            {expanded ? <ChevronFirst size={18} /> : <ChevronLast size={18} />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="sidebar_items_unordered_list">{children}</ul>
        </SidebarContext.Provider>

        <div className="sidebar_account_footer_card">
          <Avatar 
            sx={{ 
              bgcolor: '#c7d2fe', 
              color: '#3730a3', 
              fontWeight: 'bold',
              width: 36,
              height: 36,
              fontSize: '0.9rem',
              borderRadius: '6px'
            }}
          >
            {userInitial}
          </Avatar>
          
          <div className={`sidebar_footer_profile_info_block ${expanded ? 'profile_expanded' : 'profile_collapsed'}`}>
            <div className="profile_typography_flow">
              <h4 className="profile_username_header">{user?.username || 'Student User'}</h4>
              <span className="profile_tier_meta_text">{user?.cefrLevel || 'B2'} Proficiency</span>
            </div>
            <MoreVertical size={16} className="profile_context_dots_icon" />
          </div>
        </div>

      </nav>
    </aside>
  );
};

// =========================================================================
// CHILD ITEM NAVIGATION ROW NODE (COMPOUND SUB-ELEMENT)
// =========================================================================
export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, to, onClick, alert }) => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('SidebarItem sub-components must be rendered strictly inside a parent <Sidebar> layout wrapper!');
  }

  const { expanded } = context;

  // Render content block dynamically based on whether a route or click handler is active
  const itemInnerContent = (
    <>
      <div className="sidebar_item_icon_slot">{icon}</div>
      <span className={`sidebar_item_text_label ${expanded ? 'text_label_expanded' : 'text_label_collapsed'}`}>
        {text}
      </span>
      {alert && (
        <div className={`sidebar_alert_dot_indicator ${expanded ? 'alert_right' : 'alert_minimized_top'}`} />
      )}
      {!expanded && (
        <div className="sidebar_collapsed_hover_tooltip_bubble">
          {text}
        </div>
      )}
    </>
  );

  return (
    <li className="sidebar_item_row_li_wrapper">
      {/* ✅ FIXED GATING: If an explicit onClick method exists, render a standard 
          HTML button element to execute your hook and block empty address routing! */}
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="sidebar_item_link_anchor sidebar_item_link_idle group execution_action_btn"
          style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
        >
          {itemInnerContent}
        </button>
      ) : (
        <NavLink
          to={to || '/'}
          className={({ isActive }) => 
            `sidebar_item_link_anchor ${isActive ? 'item_link_active' : 'sidebar_item_link_idle'} group`
          }
        >
          {itemInnerContent}
        </NavLink>
      )}
    </li>
  );
};