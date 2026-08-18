// src/pages/profile/SettingsPage.tsx
import './settingsPage.css'
import { Settings } from '../../components/settings/Settings';

const SettingsPage: React.FC = () => {
  return (
    <div className="settings_page_route_wrapper" style={{ width: '100%' }}>
      <Settings />
    </div>
  );
};

export default SettingsPage;