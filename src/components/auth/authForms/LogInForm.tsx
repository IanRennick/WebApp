// src/components/auth/authForms/LogInForm.tsx
// =========================================================================
// INTERACTIVE USER ACCREDITATION SCREEN VIEW (LOG IN PANEL)
// =========================================================================
// - Presents the interactive entry fields for credential submissions.
// - Houses user accessibility attributes to guide browser screen readers.
// - Links user interface keystrokes directly to automated state hooks.
// =========================================================================
import React from 'react';
import './authForms.css';
import image from '../../../images/spaceship.svg';
import { Link } from 'react-router-dom';
import { MdMarkEmailRead } from 'react-icons/md';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';
import { CircularProgress } from '@mui/material';
import { useLogInForm } from '../../../hooks/auth/useLogInForm';

const LogInForm: React.FC = () => {
  // Extract all operational states and submission handles from the form processing controller
  const {
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
  } = useLogInForm();

  return (
    <div className="authForm_container">
      
      {/* -------------------------------------------------------------------
          1. BRANDING HEADER SECTION
          ------------------------------------------------------------------- */}
      <div className="message_container">
        <Link to="/">
          <img className="message_image" src={image} alt="spaceship graphic link to home" />
        </Link>
        <h3 className="message">Welcome Back!</h3>
      </div>

      {/* -------------------------------------------------------------------
          2. DATA CAPTURE AND SUBMISSION MATRIX
          ------------------------------------------------------------------- */}
      <form className="auth_form" onSubmit={handleSubmit}>
        
        {/* REAL-TIME DYNAMIC SYSTEM ALERTS
            Displays backend connection rejections or credential validation warnings.
            The negative tab index allows browser accessibility tools to instantly 
            shift focus to this text box if an operation fails. */}
        <p
          ref={errorRef}
          className={errorMessage ? "error_message" : "hide_message"}
          tabIndex={-1} 
        >
          {errorMessage}
        </p>

        {/* IDENTITY ENTRY GATEWAY
            Accepts either traditional alphanumeric usernames or verified email addresses.
            Spreads automatic storage attributes to retain input across accidental reloads. */}
        <div>
          <label className="form_label" htmlFor="auth">
            Username or Email
          </label>
          <div className="input_container">
            <MdMarkEmailRead className="form_icon" />
            <input
              type="text"
              id="auth"
              ref={authRef}
              {...authAttributes}
              autoComplete="off"
              required
              className="form_input"
            />
          </div>
        </div>

        {/* SECURITY CRITERIA ENTRY BLOCK
            Accepts hidden text inputs. Captures modifications on every typed character. */}
        <div>
          <label className="form_label" htmlFor="password">
            Password
          </label>
          <div className="input_container">
            <BsFillShieldLockFill className="form_icon" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordInput}
              required
              className="form_input"
            />
          </div>
        </div>

        {/* INTERACTIVE ACTION DISPATCHER
            Locks down interaction during active API database lookups.
            Replaces clear display text with an active animated wheel indicator. */}
        <button className="submit_button" disabled={isLoading} type="submit">
          {isLoading ? (
            <CircularProgress size={24} style={{ color: '#ffffff' }} />
          ) : (
            <>
              <span>Log In</span>
              <AiOutlineSwapRight className="button_icon" />
            </>
          )}
        </button>

        {/* BROWSER DEVICE STORAGE LIFETIME TOGGLE
            Instructs the application layer to toggle long-term session 
            cookies instead of purging memory states on browser tab closures. */}
        <div className="persist_check">
          <input
            type="checkbox"
            id="persist"
            onChange={toggleCheck}
            checked={check}
          />
          <label className="persist_label" htmlFor="persist">
            Trust this device?
          </label>
        </div>

        {/* EMERGENCY ACCESS PATHWAY */}
        <span className="forgot_password">
          Forgot your password?{' '}
          <Link to="/" className="forgot_link">
            Click here
          </Link>
        </span>
      </form>
    </div>
  );
};

export default LogInForm;