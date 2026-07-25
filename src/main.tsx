// src/main.tsx
// =========================================================================
// AUTHORITATIVE PLATFORM ENTRY POINT & BOOTSTRAP ORCHESTRATOR
// =========================================================================
// - Grabs the physical browser HTML window node container to inflate your UI.
// - Injects your universal Redux memory state providers globally.
// - Boots up the central browser URL history router tracking frameworks.
// - Wraps the initialization cycle inside a strict development sandbox.
// =========================================================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// -------------------------------------------------------------------------
// 1. PHYSICAL WINDOW CONTAINER TARGETING
// -------------------------------------------------------------------------
// Reaches out to grab the core static div shell sitting inside your index.html.
// -------------------------------------------------------------------------
const rootElement = document.getElementById('root');

// SYSTEM INTEGRITY SHIELD
// Halts compilation and logs a clear structural warning if the raw HTML node 
// container is missing or corrupted from your distribution directory.
if (!rootElement) {
  throw new Error("Fatal System Boot Failure: Targeted HTML element root node container not found.");
}

// -------------------------------------------------------------------------
// 2. ROOT ENGINE INSTANTIATION & INFLATION
// -------------------------------------------------------------------------
// Initializes the rendering tree inside the verified element mount point.
// -------------------------------------------------------------------------
const root = ReactDOM.createRoot(rootElement);

root.render(
  // DEVELOPER RENDERING SANDBOX (STRICT MODE)
  // Activates real-time background diagnostic checks, double-mount routines,
  // and legacy code deprecation monitors to keep your code modern during dev.
  <React.StrictMode>
    
    {/* GLOBAL DATA MEMORY ACCESS BRIDGE
        Plugs your master Redux state store straight into your component ecosystem.
        Enables any form, hook, or dashboard row across your workspace to read or 
        mutate shared memory states seamlessly. */}
    <Provider store={store}>
      
      {/* BROWSER ADDRESS HISTORY DRIVER
          Grabs control of your browser address bar history timeline tracks. */}
      <BrowserRouter>
        <Routes>
          
          {/* WILDCARD APP HAND-OFF GATEWAY
              Forwards all incoming top-level URL paths directly down to your central 
              App.tsx router, allowing React Router to manage complex page switches
              without forcing slow, traditional browser page refreshes. */}
          <Route path="/*" element={<App />} />
          
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);