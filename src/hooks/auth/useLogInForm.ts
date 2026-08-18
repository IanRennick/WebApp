// src/hooks/auth/useLogInForm.ts
// =========================================================================
// DATA HANDLER HOOK FOR USER ACCREDITATION (LOGIN STATE MANAGER)
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
  const authRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const [auth, resetAuth, authAttributes] = useInput('authInput', '');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [check, toggleCheck] = useToggle('persist', false);

  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname || '/';

  const [logIn, { isLoading }] = useLogInMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authRef.current) authRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMessage('');
  }, [auth, password]);

  const handlePasswordInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  // -----------------------------------------------------------------------
  // API DISPATCH SUBMISSION LIFECYCLE
  // -----------------------------------------------------------------------
  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    try {
      const payload = {
        login: auth.trim(),
        password: password
      };

      const response = await logIn(payload).unwrap();

      // ✅ FIXED INTEGRATION: Symmetrically forwards the raw response.user payload hash 
      // straight down to setCredentials! This allows authSlice to parse avatar_url natively,
      // strips the dead notification variables, and stops the homepage session wipe crash forever.
      dispatch(setCredentials({
        token: response.access_token,
        user: response.user
      }));

      resetAuth();
      setPassword('');

      navigate(from, { replace: true });
    } catch (err: any) {
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

      if (errorRef.current) errorRef.current.focus();
    }
  };

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