// src/features/auth/authApiSlice.ts
// =========================================================================
// AUTHENTICATION NETWORK GATEWAY ENDPOINTS (AUTH API SLICE)
// =========================================================================
// - Injects specialized authentication mutations into the main central API pipeline.
// - Packages login credentials and environment tracking tokens into standard request formats.
// - Auto-generates the customized reactive custom data fetching hooks used by forms.
// =========================================================================
import { apiSlice } from '../../app/api/apiSlice';

interface LoginCredentials {
  login: string;       // Acceptable as either username or email strings interchangeably
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({

    // ---------------------------------------------------------------------
    // 1. ACCOUNT ACCESS CREATOR MUTATION (LOG IN ROUTE)
    // ---------------------------------------------------------------------
    // Submits credentials to the server to establish an authenticated session.
    // Automatically enforces credential passing so cookie chains write correctly.
    // ---------------------------------------------------------------------
    logIn: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/oauth/token',
        method: 'POST',
        credentials: 'include', // Instructs the browser to handle cross-origin cookie setups securely
        body: { 
          ...credentials,
          client_id: import.meta.env.VITE_CLIENT_ID,
          client_secret: import.meta.env.VITE_CLIENT_SECRET,
          grant_type: 'password' // Informs Doorkeeper we are using standard credential lookups
        }
      })
    }),

    // ---------------------------------------------------------------------
    // 2. NEW STUDENT ACCOUNT REGISTER MUTATION (SIGN UP ROUTE)
    // ---------------------------------------------------------------------
    // Transmits flat registration inputs directly to your custom backend controller.
    // Passes tracking parameters along to enable automatic logins upon success.
    // ---------------------------------------------------------------------
    register: builder.mutation<unknown, RegisterCredentials>({
      query: (credentials) => ({
        url: '/users',
        method: 'POST',
        credentials: 'include', // Instructs the browser to capture the resulting session cookie drop
        body: { 
          ...credentials,
          client_id: import.meta.env.VITE_CLIENT_ID,
        }
      })
    }),

    // ---------------------------------------------------------------------
    // 3. SILENT BACKGROUND TOKEN EXCHANGE MUTATION (REFRESH ROUTE)
    // ---------------------------------------------------------------------
    // Dispatches background parameters to swap out short-term access tokens.
    // Bypasses local input states since values are extracted from hidden cookies.
    // ---------------------------------------------------------------------
    refreshToken: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: '/oauth/token',
        method: 'POST',
        body: { 
          client_id: import.meta.env.VITE_CLIENT_ID,
          client_secret: import.meta.env.VITE_CLIENT_SECRET,
          grant_type: 'refresh_token' // Activates Doorkeeper cookie extraction tracks
        }
      })
    }),

    // ---------------------------------------------------------------------
    // 4. ACCOUNT SESSION TERMINATION MUTATION (LOG OUT ROUTE)
    // ---------------------------------------------------------------------
    // Notifies the database to explicitly revoke and delete active token keys.
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

// Auto-generated data hooks cleanly extracted out of your endpoint definitions.
// Call these across your screens to run background network lookups effortlessly!
export const { 
  useLogInMutation, 
  useRegisterMutation, 
  useRefreshTokenMutation, 
  useLogOutMutation 
} = authApiSlice;