// src/features/auth/authSlice.ts
// =========================================================================
// APPLICATION TRANSIENT MEMORY PARTITION (AUTHENTICATION STATE SLICE)
// =========================================================================
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserProfileData {
  username: string;
  rating: number;
  cefrLevel: string;
  avatarUrl: string | null; 
}

interface AuthState {
  token: string | null;
  user: UserProfileData | null; 
}

interface SetCredentialsPayload {
  token: string;
  // ✅ FIXED TYPES: Made optional so your token refreshes and background 
  // mock dispatches can pass a raw string without throwing schema errors!
  user?: any; 
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
      const token = action.payload?.token;
      const rawUser = action.payload?.user;

      if (token !== undefined) {
        state.token = token;
      }
      
      // Only modify or populate the user cache block if user metadata is present in the payload
      if (rawUser && rawUser.username) {
        state.user = {
          username: rawUser.username,
          rating: Number(rawUser.rating || 1200),
          cefrLevel: rawUser.cefrLevel || rawUser.cefr_level || 'B2',
          avatarUrl: rawUser.avatarUrl || rawUser.avatar_url || null
        };
      }
    },

    // ---------------------------------------------------------------------
    // 2. DATA CACHE FLUSH ACTION (REMOVE CREDENTIALS)
    // ---------------------------------------------------------------------
    removeCredentials: (state) => {
      state.token = null;
      state.user = null; 
    },

    // ---------------------------------------------------------------------
    // 3. ACTIVE USER METRICS INTERCEPTOR (UPDATE USER METRICS)
    // ---------------------------------------------------------------------
    updateUserMetrics: (state, action: PayloadAction<any>) => {
      if (state.user) {
        const incoming = action.payload;
        
        const normalizedAvatar = incoming?.avatarUrl || incoming?.avatar_url || state.user.avatarUrl;
        const normalizedLevel = incoming?.cefrLevel || incoming?.cefr_level || state.user.cefrLevel;
        const normalizedUsername = incoming?.username || state.user.username;
        const normalizedRating = incoming?.rating !== undefined ? Number(incoming.rating) : state.user.rating;

        state.user = {
          username: normalizedUsername,
          rating: normalizedRating,
          cefrLevel: normalizedLevel,
          avatarUrl: normalizedAvatar
        };
      }
    }
  }
});

export const { setCredentials, removeCredentials, updateUserMetrics } = authSlice.actions;

interface RootStateContext {
  auth: AuthState;
}

export const selectCurrentToken = (state: RootStateContext) => state.auth.token;
export const selectCurrentUser = (state: RootStateContext) => state.auth.user;
export const selectCurrentUserElo = (state: RootStateContext) => state.auth.user?.rating || 1200;

export default authSlice.reducer;