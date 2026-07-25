// src/app/api/apiSlice.ts
// =========================================================================
// CENTRAL APPLICATION NETWORK ROUTING LAYER (RTK QUERY BASE APISLICE)
// =========================================================================
// - Sets up the base address configuration for all outgoing server contacts.
// - Automatically attaches active access keys to the headers of outgoing calls.
// - Intercepts expired session signals (403) to swap tokens behind the scenes.
// =========================================================================
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setCredentials, removeCredentials } from '../../features/auth/authSlice';

interface RootState {
  auth: {
    token: string | null;
  };
}

interface RefreshResponse {
  access_token: string;
}

// -------------------------------------------------------------------------
// 1. STANDARD DATA FETCH TUNING (BASE QUERY LAYER)
// -------------------------------------------------------------------------
// Configures the default network behavior for standard outbound requests.
// Automatically grabs access tokens from memory and structures standard headers.
// -------------------------------------------------------------------------
const baseQuery = fetchBaseQuery({
  // Pulls the backend API gateway URL from local environment configurations
  baseUrl: import.meta.env.VITE_BASE_URL,
  
  // Forces the client browser to automatically pass along secure, encrypted 
  // HttpOnly refresh token cookies on all connection attempts
  credentials: 'include', 

  prepareHeaders: (headers, { getState }) => {
    // Read the current access token string straight out of memory
    const state = getState() as RootState;
    const token = state.auth.token;

    // If an access token is active, inject it into the request authorization line
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

// -------------------------------------------------------------------------
// 2. AUTOMATED BACKSTAGE RE-AUTHENTICATION INTERCEPTOR LAYER
// -------------------------------------------------------------------------
// Wraps around all outbound API calls like an intelligent traffic supervisor.
// If a user request fails because their short-term access token has expired,
// it pauses the user's interface, sends a silent refresh post to the server,
// captures the newly issued token, updates memory, and retries the call.
// -------------------------------------------------------------------------
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {

  // Execute the user's intended original network connection attempt
  let result = await baseQuery(args, api, extraOptions);

  const errorObj = result?.error as any;

  // Catch 403 Forbidden signals indicating the current access key has expired
  if (errorObj?.status === 403 || errorObj?.originalStatus === 403) {
    
    // Fire a background POST call to swap the stored secure cookie for a new access token
    const refreshResult = await baseQuery({
      url: '/oauth/token',
      method: 'POST',
      credentials: 'include', // Guarantees the browser sends the hidden cookie to the token route
      body: {
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
        grant_type: 'refresh_token'
      }
    }, api, extraOptions);

    if (refreshResult?.data) {
      const refreshData = refreshResult.data as RefreshResponse;
      
      // Save the freshly issued short-term access token straight back into memory
      api.dispatch(setCredentials({ token: refreshData.access_token }));

      // Retry the original failed connection attempt seamlessly with the updated key
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If the refresh cookie is dead or missing, clean out the data store and force a logout
      api.dispatch(removeCredentials());
    }
  }

  // Return the final successful data result (or clean server error) to the component layout
  return result;
};

// -------------------------------------------------------------------------
// 3. MASTER API CONTAINER SYSTEM
// -------------------------------------------------------------------------
// Generates the core network node shell. Future feature pages (like quizzes,
// weaknesses, or users) will inject their individual custom endpoints into 
// this central point dynamically as your codebase grows.
// -------------------------------------------------------------------------
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}) 
});