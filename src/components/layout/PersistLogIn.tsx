// src/components/layout/PersistLogIn.tsx
// =========================================================================
// ANTI-FLICKER PERSISTENT LIFECYCLE CONTROLLER (SESSION RECOVERY GATE)
// =========================================================================
import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/hooks'; 
import { selectCurrentToken } from '../../features/auth/authSlice';
import useRefreshToken from '../../hooks/auth/useRefreshToken';
import useLocalStorage from '../../hooks/localStorage/useLocalStorage';
// ✅ FIXED: Import your beautiful new pulsing loader component screen
import LoadingScreen from './loadingScreen/LoadingScreen'; 

const PersistLogIn: React.FC = () => {
  const [hookCalled, setHookCalled] = useState<boolean>(false);
  const firstMount = useRef<boolean>(true);
  const { refresh, isLoading } = useRefreshToken();
  const token = useAppSelector(selectCurrentToken);
  const [persist] = useLocalStorage<boolean>('persist', false);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async (): Promise<void> => {
      try {
        await refresh();
      } catch (err) {
        console.error("Session verification trace execution notice:", err);
      } finally {
        if (isMounted) {
          setHookCalled(true);
        }
      }
    };

    if (!token && firstMount.current) {
      firstMount.current = false;
      verifyRefreshToken();
    } else {
      setHookCalled(true);
    }

    return () => {
      isMounted = false;
    };
  }, [token, refresh]);

  // -----------------------------------------------------------------------
  // CONDITIONAL PORTAL RENDER MATRIX
  // --------------------------------================================-------
  return (
    <>
      {!persist ? (
        <Outlet />
      ) : hookCalled && !isLoading ? (
        <Outlet />
      ) : (
        /* ✅ FIXED: Replaced unstyled <p> block with your premium animated loader screen! */
        <LoadingScreen />
      )}
    </>
  );
};

export default PersistLogIn;