// src/hooks/auth/useLogInForm.ts
// =========================================================================
// DATA HANDLER HOOK FOR USER ACCREDITATION (LOGIN STATE MANAGER)
// =========================================================================
// - Collects interactive string parameters for user form inputs.
// - Packages dual identifier keys (username or email) flatly for transmission.
// - Controls focus redirections and handles automated error translation strings.
// =========================================================================
import { useState, useEffect, useRef } from 'react';
import type { SyntheticEvent, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogInMutation } from '../../features/auth/authApiSlice';
import { useAppDispatch } from '../hooks';
import { setCredentials } from '../../features/auth/authSlice';
import useInput from '../localStorage/useInput';
import useToggle from '../localStorage/useToggle';

export const useLogInForm = () => {
  // Input Focus Tracking References
  // Isolates specific elements on the screen to control cursor placement.
  const authRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // Local Form Buffers and Local Cache Couplers
  const [auth, resetAuth, authAttributes] = useInput('authInput', '');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [check, toggleCheck] = useToggle('persist', false);

  // Router History and Redirection Anchors
  const navigate = useNavigate();
  const location = useLocation();
  
  // Grabs the exact secure URL destination path the student was trying to reach 
  // before being intercepted by our gateway, defaulting back to home if none exists.
  const from = (location.state as any)?.from?.pathname || '/';

  // API Integration Triggers
  const [logIn, { isLoading }] = useLogInMutation();
  const dispatch = useAppDispatch();

  // Moves the typing cursor focus onto the identity field the second the form view loads
  useEffect(() => {
    if (authRef.current) authRef.current.focus();
  }, []);

  // Erases old error banners automatically as soon as the user starts correcting fields
  useEffect(() => {
    setErrorMessage('');
  }, [auth, password]);

  // Synchronizes typed characters with password string states
  const handlePasswordInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  // -----------------------------------------------------------------------
  // API DISPATCH SUBMISSION LIFECYCLE
  // -----------------------------------------------------------------------
  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    try {
      // Formats the dual identifier entry cleanly into a single flat key.
      // This allows users to pass username strings or emails interchangeably.
      const payload = {
        login: auth.trim(),
        password: password
      };

      // Dispatches the flat payload through the OAuth server gate
      const response = await logIn(payload).unwrap();

      // Commit the newly returned Bearer access token string down into global memory
      dispatch(setCredentials({ token: response.access_token }));

      // Purge local storage text field input caches cleanly to keep user inputs safe
      resetAuth();
      setPassword('');

      // Send the user straight through to their originally requested screen target
      navigate(from, { replace: true });
    } catch (err: any) {
      // Evaluate network status codes to extract precise user validation notices
      const status = err?.status || err?.originalStatus;
      const errorType = err?.data?.error;

      if (!status) {
        setErrorMessage('No response received from the server. Check your internet connection.');
      } else if (status === 401 || errorType === 'invalid_grant') {
        setErrorMessage('Incorrect username, email, or password. Please try again.');
      } else if (status === 400 || errorType === 'invalid_request') {
        setErrorMessage('Missing login parameters. Please fill in all fields.');
      } else {
        setErrorMessage('Authentication gateway connection failed. Please try again later.');
      }

      // Automatically snap cursor focus onto the error notice block for high accessibility
      if (errorRef.current) errorRef.current.focus();
    }
  };

  // Export operational variables directly to the form view component frame
  return {
    authRef,
    errorRef,
    authAttributes,
    password,
    handlePasswordInput,
    errorMessage,
    check,
    toggleCheck,
    isLoading,
    handleSubmit,
  };
};