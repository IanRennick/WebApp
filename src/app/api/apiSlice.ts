// src/app/api/apiSlice.ts
// =========================================================================
// CENTRAL APPLICATION NETWORK ROUTING LAYER (RTK QUERY BASE APISLICE)
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

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: 'include', 

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {

  // ✅ FIXED: Read the active access token straight into local function scope!
  const state = api.getState() as RootState;
  const currentToken = state.auth.token;

  let result = await baseQuery(args, api, extraOptions);
  const errorObj = result?.error as any;

  if (errorObj?.status === 403 || errorObj?.originalStatus === 403) {
    
    const refreshResult = await baseQuery({
      url: '/oauth/token',
      method: 'POST',
      credentials: 'include', 
      body: {
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
        grant_type: 'refresh_token'
      }
    }, api, extraOptions);

     if (refreshResult?.data) {
      const refreshData = refreshResult.data as RefreshResponse;
      api.dispatch(setCredentials({ token: refreshData.access_token } as any));
      result = await baseQuery(args, api, extraOptions);
    } else {
      // ✅ FIXED: Read the active physical window path location straight out of the browser!
      const currentBrowserPath = window.location.pathname;
      const targetUrl = typeof args === 'string' ? args : args.url;
      
      // ✅ BREAKING THE RE-RENDER PURGE LOOP:
      // We enforce an unbreakable security wall: if a student is sitting on the public 
      // Homepage ('/'), the system is explicitly FORBIDDEN from wiping out their credentials cache!
      if (
        currentBrowserPath !== '/' &&
        targetUrl && 
        !targetUrl.includes('/oauth/token') && 
        currentToken
      ) {
        api.dispatch(removeCredentials());
      }
    }
  }

  return result;
};

// -------------------------------------------------------------------------
// 3. CENTRAL MASTER API REGISTER CONTAINER
// -------------------------------------------------------------------------
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  // ✅ FIXED CACHE SYSTEM: Registered 'Notification' straight into your tagTypes array loop.
  // This authorizes your new notification mutations to flush and update counts cleanly!
  tagTypes: ['Puzzle', 'Notification', 'UserProfile'],
  endpoints: () => ({}) 
});