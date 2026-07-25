// src/features/auth/authSlice.ts
// =========================================================================
// APPLICATION TRANSIENT MEMORY PARTITION (AUTHENTICATION STATE SLICE)
// =========================================================================
// - Manages the presence of short-term bearer tokens inside the browser memory.
// - Handles updating active session markers when logins or silent refreshes occur.
// - flushes internal memory cells entirely during account logouts.
// =========================================================================
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
}

interface SetCredentialsPayload {
  token: string;
}

// Establishes a secure baseline environment: when the app reboots or initializes,
// it locks the app behind an unauthenticated state until a token arrives.
const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ---------------------------------------------------------------------
    // 1. DATA CACHE REGISTRATION ACTION (SET CREDENTIALS)
    // ---------------------------------------------------------------------
    // Receives incoming token strings from successful login or refresh 
    // network calls, writing the key directly into reactive frontend memory.
    // ---------------------------------------------------------------------
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const { token } = action.payload;
      state.token = token;
    },

    // ---------------------------------------------------------------------
    // 2. DATA CACHE FLUSH ACTION (REMOVE CREDENTIALS)
    // ---------------------------------------------------------------------
    // Instantly purges short-term session access tokens from active memory arrays,
    // immediately triggering your route shields to lock down the interface.
    // ---------------------------------------------------------------------
    removeCredentials: (state) => {
      state.token = null;
    }
  }
});

// Export atomic execution triggers for distribution to views or hooks
export const { setCredentials, removeCredentials } = authSlice.actions;

interface RootStateContext {
  auth: AuthState;
}

// -------------------------------------------------------------------------
// 3. GLOBAL MEMORY EXTRACTOR WINDOW (STATE SELECTOR)
// -------------------------------------------------------------------------
// Exposes a dedicated lookup tunnel used by layout guards and route shields.
// Allows views to instantly evaluate if a valid user token exists in the central 
// memory tree without exposing the entire state store to unauthenticated nodes.
// -------------------------------------------------------------------------
export const selectCurrentToken = (state: RootStateContext) => state.auth.token;

export default authSlice.reducer;