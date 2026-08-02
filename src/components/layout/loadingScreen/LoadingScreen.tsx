// src/components/layout/loadingScreen/LoadingScreen.tsx
// =========================================================================
// PREMIUM REUSABLE CENTRALIZED ACADEMIC LOADER CANVAS (V1)
// =========================================================================
import React from 'react';
import { FaSpaceAwesome } from 'react-icons/fa6';
import './loadingScreen.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className="platform_global_loader_fullscreen_wrapper">
      <div className="loader_branding_pulse_box">
        
        {/* Reusing your native space awesome brand identity icon as the loader */}
        <FaSpaceAwesome className="loader_pulsing_brand_logo_icon" />
        
        <h2 className="loader_typography_title">Rennlad Academy</h2>
        <p className="loader_typography_subtext">Assembling exercise universe layers...</p>
        
        <div className="loader_infinite_progress_track">
          <div className="loader_infinite_progress_fill_glow" />
        </div>
        
      </div>
    </div>
  );
};

export default LoadingScreen;