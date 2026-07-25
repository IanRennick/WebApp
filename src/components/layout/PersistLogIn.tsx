// src/components/layout/PersistLogIn.tsx
// =========================================================================
// ANTI-FLICKER PERSISTENT LIFECYCLE CONTROLLER (SESSION RECOVERY GATE)
// =========================================================================
// - Verifies the presence of active user sessions when the app first loads.
// - Intercepts private routing requests to trigger silent backend cookie lookups.
// - Safely handles complex data updates without throwing double-mount errors.
// =========================================================================
import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/hooks'; 
import { selectCurrentToken } from '../../features/auth/authSlice';
import useRefreshToken from '../../hooks/auth/useRefreshToken';
import useLocalStorage from '../../hooks/localStorage/useLocalStorage';

const PersistLogIn: React.FC = () => {
  // Tracks if the background network re-authentication check has completed
  const [hookCalled, setHookCalled] = useState<boolean>(false);

  // A persistent marker used to shield against React Dev Mode's double mounting behavior.
  // Helps ensure we only fire our silent cookie token request exactly once.
  const firstMount = useRef<boolean>(true);

  // Access the centralized background token refresh handler
  const { refresh, isLoading } = useRefreshToken();

  // Extract the active access token directly from frontend memory storage
  const token = useAppSelector(selectCurrentToken);

  // Pull the student's "Trust this device" selection preference from browser local storage
  const [persist] = useLocalStorage<boolean>('persist', false);

  // -----------------------------------------------------------------------
  // BACKGROUND AUTHORIZATION HANDSHAKE DISPATCHER
  // -----------------------------------------------------------------------
  useEffect(() => {
    // A local cancel flag to prevent updating memory states if a component unmounts mid-call
    let isMounted = true;

    const verifyRefreshToken = async (): Promise<void> => {
      try {
        // Attempt a background silent token cookie exchange loop with the server
        await refresh();
      } catch (err) {
        console.error("Session verification trace execution notice:", err);
      } finally {
        if (isMounted) {
          // Drop the loading screen indicators once the network call settles
          setHookCalled(true);
        }
      }
    };

    // ---------------------------------------------------------------------
    // LIFECYCLE FLOW SHIELD
    // ---------------------------------------------------------------------
    // Only execute the verification routine if there is no active token in memory 
    // AND this is the absolute first time this container is initializing.
    // ---------------------------------------------------------------------
    if (!token && firstMount.current) {
      // Instantly mark the first initialization as completed to block double-mount triggers
      firstMount.current = false;

      // Execute the token refresh sequence
      verifyRefreshToken();
    } else {
      // If a token is already present or initialization has cleared, drop loading locks immediately
      setHookCalled(true);
    }

    // Clean up lifecycle routine that fires if the component unmounts during active requests
    return () => {
      isMounted = false;
    };
  }, [token, refresh]);

  // -----------------------------------------------------------------------
  // CONDITIONAL PORTAL RENDER MATRIX
  // -----------------------------------------------------------------------
  return (
    <>
      {/* 
        Case 1: User did not trust the device. Skip background checks and route normally.
        Case 2: Background refresh completed. Render the private application dashboard pages.
        Case 3: Network handshake is still active. Hold the viewport with a clear loading text banner.
      */}
      {!persist ? (
        <Outlet />
      ) : hookCalled && !isLoading ? (
        <Outlet />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default PersistLogIn;