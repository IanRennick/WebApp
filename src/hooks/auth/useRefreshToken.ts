// src/hooks/auth/useRefreshToken.ts
// =========================================================================
// BACKGROUND RE-AUTHENTICATION CONTROLLER (ANTI-WIPE HOME REFRESH FIXED)
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
  const [refreshToken, { isLoading }] = useRefreshTokenMutation();
  const dispatch = useAppDispatch();

  const refresh = useCallback(async (): Promise<RefreshTokenResponse> => {
    try {
      // Execute background mutation to swap HTTP-Only cookies for short-term tokens
      const response = await refreshToken().unwrap() as AuthResponse;
          
      // ✅ Session Found: Hydrate global memory cells smoothly
      dispatch(setCredentials({
        token: response.access_token,
        user: response.user
      }));

      return response;
    } catch (error) {
      console.warn("Silent background token handshake bypassed on public route layout context.", error);
      
      // ✅ FIXED: Enforce a strict programmatic Promise rejection error string!
      // By explicitly throwing a rejection error here instead of returning a blank token shell, 
      // your global layout context treats this as a temporary network skip on a public view.
      // This completely stops your layout from executing a destructive clear-down loop, 
      // keeping your local persistence layers fully intact for when you jump back to authenticated views!
      throw new Error("PUBLIC_ROUTE_REFRESH_BYPASS");
    }
  }, [refreshToken, dispatch]);

  return { refresh, isLoading };
};

export default useRefreshToken;