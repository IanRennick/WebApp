// src/hooks/auth/useRefreshToken.ts
// =========================================================================
// BACKGROUND RE-AUTHENTICATION PORTAL CONTROLLER (SILENT REFRESH HOOK)
// =========================================================================
// - Exchanges expired short-term user tokens for a fresh access key.
// - Leverages secure HttpOnly browser cookie channels behind the scenes.
// - Exposes loading indicator flags to lock down views during background swaps.
// =========================================================================
import { useCallback } from 'react';
import { useAppDispatch } from '../hooks';
import { useRefreshTokenMutation, AuthResponse } from '../../features/auth/authApiSlice';
import { setCredentials } from '../../features/auth/authSlice';

interface RefreshTokenResponse {
  access_token: string;
}

interface RefreshTokenHookResult {
  refresh: () => Promise<RefreshTokenResponse>;
  isLoading: boolean;
}

const useRefreshToken = (): RefreshTokenHookResult => {
  // Mount the network API mutation hook and access the central dispatcher
  const [refreshToken, { isLoading }] = useRefreshTokenMutation();
  const dispatch = useAppDispatch();

  // -----------------------------------------------------------------------
  // BACKGROUND TOKEN HANDSHAKE MEMOIZATION MATRIX
  // -----------------------------------------------------------------------
  // Wrapped in useCallback to preserve its functional reference in memory.
  // This guarantees that view containers (like your PersistLogIn wrapper)
  // won't accidentally trigger duplicate network calls during component re-renders.
  // -----------------------------------------------------------------------
  const refresh = useCallback(async (): Promise<RefreshTokenResponse> => {
    
    // Dispatches a background post call. Doorkeeper will decrypt the secure, 
    // hidden browser cookie jar to validate the request.
    const response = await refreshToken().unwrap() as AuthResponse;
        
    // Save the brand-new, freshly issued short-term access key straight into memory
    dispatch(setCredentials({
        token: response.access_token,
        user: response.user ? {
          username: response.user.username,
          rating: response.user.rating,
          cefrLevel: response.user.cefr_level,
          unreadNotificationsCount: response.user.unread_notifications_count
        } : null
      }));
    // Forward the token response object back up to the calling lifecycle hook
    return response;
  }, [refreshToken, dispatch]);

  // Export the execution function and the active loader state flag directly
  return { refresh, isLoading };
};

export default useRefreshToken;