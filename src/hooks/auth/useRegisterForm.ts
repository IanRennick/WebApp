// src/hooks/auth/useRegisterForm.ts
// =========================================================================
// DATA HANDLER HOOK FOR STUDENT REGISTRATION (SIGN UP STATE MANAGER)
// =========================================================================
// - Coordinates multi-field string states for account profile creation.
// - Triggers automated side-effect validation checks on every keystroke.
// - Manages real-time contextual tooltip indicators and safety guard blocks.
// - Formats and dispatches flat data payloads directly to backend endpoints.
// =========================================================================
import { useState, useEffect, useRef } from 'react';
import type { SyntheticEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../features/auth/authApiSlice';
import { useAppDispatch } from '../hooks';
import { setCredentials } from '../../features/auth/authSlice';
import useToggle from '../localStorage/useToggle';
import { validateUsername, validateEmail, validatePassword } from '../../utils/formValidation';

export const useRegisterForm = () => {
  // Input Focus Tracking References
  // Tracks specific HTML element nodes to manage cursor focus programmatically.
  const usernameRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // Raw Form Field State Buffers
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordMatch, setPasswordMatch] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Real-Time Regex Validation Outcome Flags
  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [validPasswordMatch, setValidPasswordMatch] = useState<boolean>(false);

  // Interactive Contextual Tooltip Visibility States
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false);
  const [emailFocus, setEmailFocus] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  const [passwordMatchFocus, setPasswordMatchFocus] = useState<boolean>(false);

  // Local Machine Session Caching
  const [check, toggleCheck] = useToggle('persist', false);

  // Core API and Navigation Infrastructure
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();

  // Moves the text typing cursor into the username field automatically upon mounting the view
  useEffect(() => {
    if (usernameRef.current) usernameRef.current.focus();
  }, []);

  // -----------------------------------------------------------------------
  // REAL-TIME INPUT VALIDATION OBSERVERS (SIDE-EFFECTS)
  // -----------------------------------------------------------------------
  // Automatically evaluate form inputs against our strict validation regex
  // patterns as the student types, unlocking instant on-screen design cues.
  // -----------------------------------------------------------------------
  useEffect(() => {
    validateUsername(name, setValidUsername);
  }, [name]);

  useEffect(() => {
    validateEmail(email, setValidEmail);
  }, [email]);

  useEffect(() => {
    validatePassword(password, setValidPassword, passwordMatch, setValidPasswordMatch);
  }, [password, passwordMatch]);

  // Clears active error notification banners the split second a user alters an input field
  useEffect(() => {
    setErrorMessage('');
  }, [name, email, password, passwordMatch]);

  // -----------------------------------------------------------------------
  // FIELD PARAMETER EXTRACTION ACTIONS
  // -----------------------------------------------------------------------
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handlePasswordMatchChange = (e: ChangeEvent<HTMLInputElement>) => setPasswordMatch(e.target.value);

  // -----------------------------------------------------------------------
  // API DISPATCH SUBMISSION LIFECYCLE
  // -----------------------------------------------------------------------
  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    // FORM INTEGRITY CHECK GUARD GATE
    // Halts submission and issues a warning if the client side regex checks aren't fully satisfied
    if (!validUsername || !validEmail || !validPassword || !validPasswordMatch) {
      setErrorMessage("Please fulfill all form criteria requirements before continuing.");
      return;
    }

    try {
      // Maps and packages flat parameter fields to fit your custom API controller schema
      const payload = {
        username: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };

      // Dispatch creation query out to your database endpoint
      const response = await register(payload).unwrap() as { access_token: string };

      // Save the freshly generated session access token straight down into frontend memory
      dispatch(setCredentials({ token: response.access_token }));

      // Purge state data variables cleanly to eliminate raw text footprints from form cache
      setEmail('');
      setName('');
      setPassword('');
      setPasswordMatch('');

      // Redirect the user forward directly onto the core application homepage dashboard
      navigate('/', { replace: true });
    } catch (err: any) {
      // Intercept and decode server status signals to display specific validation errors
      const status = err?.status || err?.originalStatus;
      const validationErrors = err?.data?.errors;

      if (!status) {
        setErrorMessage('No response received from the server. Check your internet connection.');
      } else if (status === 422) {
        if (validationErrors?.email && validationErrors?.username) {
          setErrorMessage('Both this username and email address are already registered.');
        } else if (validationErrors?.email) {
          setErrorMessage('This email address is already in use.');
        } else if (validationErrors?.username) {
          setErrorMessage('This username is already taken.');
        } else {
          setErrorMessage('Registration validation failed. Please check your form criteria.');
        }
      } else if (status === 400) {
        setErrorMessage('Missing registration parameters. Please fill in all required fields.');
      } else {
        setErrorMessage('Registration system gateway connection failed. Please try again later.');
      }

      // Shift programmatic cursor focus to the error notice block for accessibility compliance
      if (errorRef.current) errorRef.current.focus();
    }
  };

  // Export operational variables and field actions directly to the view layout card
  return {
    usernameRef,
    errorRef,
    name,
    email,
    password,
    passwordMatch,
    errorMessage,
    validUsername,
    validEmail,
    validPassword,
    validPasswordMatch,
    usernameFocus,
    setUsernameFocus,
    emailFocus,
    setEmailFocus,
    passwordFocus,
    setPasswordFocus,
    passwordMatchFocus,
    setPasswordMatchFocus,
    check,
    toggleCheck,
    isLoading,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordMatchChange,
    handleSubmit,
  };
};