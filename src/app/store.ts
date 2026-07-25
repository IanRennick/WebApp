// src/app/store.ts
// =========================================================================
// CENTRAL REDUX CORE STORE CONFIGURATION ARCHITECTURE
// =========================================================================
// - Organises and unifies all separate data partitions across the app.
// - Houses local client states alongside automated web cache servers.
// - Drives automated data garbage collection and real-time interface syncs.
// =========================================================================
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  // -----------------------------------------------------------------------
  // 1. DATA PARTITIONS MATRIX (REDUCERS)
  // -----------------------------------------------------------------------
  // Defines the primary structural blocks of memory inside your application.
  // Each top-level key houses an isolated dictionary partition cell.
  // -----------------------------------------------------------------------
  reducer: {
    // Reserves a central partition to manage network data logs,
    // server latency timings, and automatic background query caches.
    [apiSlice.reducerPath]: apiSlice.reducer,
    
    // Tracks current temporary user credential strings and short-term 
    // secure access bearer tokens in fast frontend memory.
    auth: authReducer
  },

  // -----------------------------------------------------------------------
  // 2. NETWORK EVENT LISTENER CHAIN (MIDDLEWARE)
  // -----------------------------------------------------------------------
  // Places specialized helper scripts into the store's processing loop.
  // This automatically handles timing out old data, cleaning memory,
  // and ensuring background re-authentication requests execute smoothly.
  // -----------------------------------------------------------------------
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  // Enables or disables the Redux DevTools tracking dashboard in the 
  // browser developer panel depending on the server environment.
  devTools: import.meta.env.DEV
});

// -------------------------------------------------------------------------
// 3. COMPILE-TIME STATE ARCHITECTURE Blueprints
// -------------------------------------------------------------------------
// Automated extractions that scan the store configuration above to construct
// real-time data shapes. These ensure your selectors and dispatches adapt
// instantly whenever you append new features to the data grid.
// -------------------------------------------------------------------------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;