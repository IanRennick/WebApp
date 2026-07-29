// src/features/auth/authApiSlice.ts
// =========================================================================
// AUTHENTICATION NETWORK GATEWAY ENDPOINTS (AUTH API SLICE)
// =========================================================================
import { apiSlice } from '../../app/api/apiSlice';

interface LoginCredentials {
  login: string;       
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// ✅ FIXED: Unified under a single, robust, metadata-extended response contract
export interface AuthResponse {
  access_token: string;
  user: {
    username: string;
    rating: number;
    cefr_level: string; 
    unread_notifications_count: number;
  } | null;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({

    // ---------------------------------------------------------------------
    // 1. ACCOUNT ACCESS CREATOR MUTATION (LOG IN ROUTE)
    // ---------------------------------------------------------------------
    logIn: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/oauth/token',
        method: 'POST',
        credentials: 'include', 
        body: { 
          ...credentials,
          client_id: import.meta.env.VITE_CLIENT_ID,
          client_secret: import.meta.env.VITE_CLIENT_SECRET,
          grant_type: 'password' 
        }
      })
    }),

    // ---------------------------------------------------------------------
    // 2. NEW STUDENT ACCOUNT REGISTER MUTATION (SIGN UP ROUTE)
    // ---------------------------------------------------------------------
    // ✅ FIXED: Shifted return type from unknown to AuthResponse to pass user data on signup!
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: '/users',
        method: 'POST',
        credentials: 'include', 
        body: { 
          ...credentials,
          client_id: import.meta.env.VITE_CLIENT_ID,
        }
      })
    }),

    // ---------------------------------------------------------------------
    // 3. SILENT BACKGROUND TOKEN EXCHANGE MUTATION (REFRESH ROUTE)
    // ---------------------------------------------------------------------
    // ✅ FIXED: Shifted return type to AuthResponse to pass user data on refresh!
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/oauth/token',
        method: 'POST',
        body: { 
          client_id: import.meta.env.VITE_CLIENT_ID,
          client_secret: import.meta.env.VITE_CLIENT_SECRET,
          grant_type: 'refresh_token' 
        }
      })
    }),

    // ---------------------------------------------------------------------
    // 4. ACCOUNT SESSION TERMINATION MUTATION (LOG OUT ROUTE)
    // ---------------------------------------------------------------------
    logOut: builder.mutation<unknown, void>({
      query: () => ({
        url: '/oauth/revoke',
        method: 'POST',
        body: { 
          client_id: import.meta.env.VITE_CLIENT_ID,
          client_secret: import.meta.env.VITE_CLIENT_SECRET,
        }
      })
    })
  })
});

export const { 
  useLogInMutation, 
  useRegisterMutation, 
  useRefreshTokenMutation, 
  useLogOutMutation 
} = authApiSlice;