// src/hooks/auth/useLogOut.ts
// =========================================================================
// SESSION TERMINATION & TOKEN REVOCATION CONTROLLER (LOG OUT HOOK)
// =========================================================================
// - Instantly wipes short-term user tokens out of active frontend memory.
// - Transmits a secure background post to invalidate tokens on the database.
// - Gracefully disconnects client applications from remote API streams.
// =========================================================================
import { useAppDispatch } from '../hooks';
import { useLogOutMutation } from '../../features/auth/authApiSlice';
import { removeCredentials } from '../../features/auth/authSlice';

type LogOutHookFunction = () => Promise<void>;

const useLogOut = (): LogOutHookFunction => {
  // Mount the network API mutation tool and access the central dispatcher
  const [logOut] = useLogOutMutation();
  const dispatch = useAppDispatch(); 
  
  // -----------------------------------------------------------------------
  // SESSION DESTRUCTION LIFECYCLE
  // -----------------------------------------------------------------------
  const logOutUser = async (): Promise<void> => {
    // 1. SECURITY LOCKDOWN (IMMEDIATE)
    // Instantly purges the bearer token out of reactive frontend memory.
    // This immediately triggers your layout route shields to slam shut and 
    // kick the user out of private dashboards before the server even responds.
    dispatch(removeCredentials());

    try {
      // 2. REMOTE STORAGE DATABASE REVOCATION
      // Fire an asynchronous network post down to Doorkeeper's revoke endpoint.
      // This tells your Rails database to explicitly delete and cancel this token key.
      await logOut().unwrap();  
    } catch (error) {
      // Catch connection errors silently. If a user loses internet connectivity,
      // we still consider them logged out on the client side without throwing crashes.
      console.error("API session revocation notice:", error);
    }
  };

  // Export the trigger handler method out to your navigation and header components
  return logOutUser;
};

export default useLogOut;