// src/features/auth/authSlice.ts
// =========================================================================
// APPLICATION TRANSIENT MEMORY PARTITION (AUTHENTICATION STATE SLICE)
// =========================================================================
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// ✅ NEW: Strict interface representing your synchronized Rails user profile schema
export interface UserProfileData {
  username: string;
  rating: number;
  cefrLevel: string;
  unreadNotificationsCount: number;
}

interface AuthState {
  token: string | null;
  user: UserProfileData | null; // ✅ NEW: Global User Profile State Cell Anchor
}

interface SetCredentialsPayload {
  token: string;
  user: UserProfileData | null; // ✅ NEW: Captured from the updated Rails controller response
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ---------------------------------------------------------------------
    // 1. DATA CACHE REGISTRATION ACTION (SET CREDENTIALS)
    // ---------------------------------------------------------------------
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
    },

    // ---------------------------------------------------------------------
    // 2. DATA CACHE FLUSH ACTION (REMOVE CREDENTIALS)
    // ---------------------------------------------------------------------
    removeCredentials: (state) => {
      state.token = null;
      state.user = null; // Clean out user profile memory context on logout
    },

    // ---------------------------------------------------------------------
    // 3. ✅ NEW: ACTIVE USER METRICS INTERCEPTOR (UPDATE USER METRICS)
    // ---------------------------------------------------------------------
    // Allows components like Puzzle.tsx to dynamically update the user's running
    // global rating or notifications directly inside state memory on submission cycles!
    // ---------------------------------------------------------------------
    updateUserMetrics: (state, action: PayloadAction<Partial<UserProfileData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  }
});

// Export atomic execution triggers for distribution to views or hooks
export const { setCredentials, removeCredentials, updateUserMetrics } = authSlice.actions;

interface RootStateContext {
  auth: AuthState;
}

// -------------------------------------------------------------------------
// 4. GLOBAL MEMORY EXTRACTOR WINDOWS (STATE SELECTORS)
// -------------------------------------------------------------------------
export const selectCurrentToken = (state: RootStateContext) => state.auth.token;

// ✅ NEW: Synchronous global selector hooks to read user info with zero loading delay
export const selectCurrentUser = (state: RootStateContext) => state.auth.user;
export const selectCurrentUserElo = (state: RootStateContext) => state.auth.user?.rating || 1200;

export default authSlice.reducer;