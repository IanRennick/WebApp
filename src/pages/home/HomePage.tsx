// src/pages/home/HomePage.tsx
// =========================================================================
// LIGHTWEIGHT HOMEPAGE CONTAINER ENTRY ENTRY TARGET HUB
// =========================================================================
import React from 'react';
import './homePage.css';
import Home from '../../components/home/Home';

const HomePage: React.FC = () => {
  return (
    <div className="home_page_container">
      <Home />
    </div>
  );
};

export default HomePage;