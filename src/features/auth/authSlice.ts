// src/features/auth/authSlice.ts
// =========================================================================
// APPLICATION TRANSIENT MEMORY PARTITION (AUTHENTICATION STATE SLICE)
// =========================================================================
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserProfileData {
  id: number; 
  username: string;
  rating: number;
  cefrLevel: string;
  avatarUrl: string | null; 
}

interface AuthState {
  token: string | null;
  user: UserProfileData | null; 
}

// ✅ FIXED INTERFACE PAYLOAD: Declare all possible incoming backend properties 
// as optional fields to satisfy the compiler without breaking your working data paths!
interface SetCredentialsPayload {
  token?: string;
  access_token?: string;
  user?: any; 
  id?: number;
  user_id?: number;
  username?: string;
  rating?: number;
  cefr_level?: string;
  cefrLevel?: string;
  avatar_url?: string | null;
  avatarUrl?: string | null;
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
      // ✅ RESTORED WORKFLOW: Running your exact working assignment statements!
      const token = action.payload?.token || action.payload?.access_token || state.token;
      const rawUser = action.payload?.user || action.payload;

      state.token = token;
      
      if (rawUser && rawUser.username) {
        state.user = {
          id: Number(rawUser.id || rawUser.user_id || 0),
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
        const normalizedId = incoming?.id !== undefined ? Number(incoming.id) : state.user.id;

        state.user = {
          id: normalizedId,
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