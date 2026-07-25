// src/components/auth/authForms/RegisterForm.tsx
// =========================================================================
// INTERACTIVE STUDENT ACCOUNT CREATION INTERFACE (REGISTRATION PANEL)
// =========================================================================
// - Coordinates user creation inputs with strict frontend validation states.
// - Features real-time responsive tooltips that activate on field selection.
// - Leverages conditional design indicators to display verification outcomes.
// =========================================================================
import React from 'react';
import './authForms.css';
import { MdMarkEmailRead } from 'react-icons/md';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';
import { CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useRegisterForm } from '../../../hooks/auth/useRegisterForm';

const RegisterForm: React.FC = () => {
  // Extract interactive state states, field values, and execution handlers
  const {
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
  } = useRegisterForm();

  return (
    <div className="authForm_container">
      <form className="auth_form" onSubmit={handleSubmit}>
        
        {/* REAL-TIME DYNAMIC SYSTEM ALERTS
            Presents backend constraint rejections or missing argument notices.
            The negative tab index forces screen readers to prioritize reading this block
            whenever focus is programmatically shifted here after an operation fails. */}
        <p 
          ref={errorRef} 
          className={errorMessage ? "error_message" : "hide_message"}
          tabIndex={-1}
        >
          {errorMessage}
        </p>

        {/* -------------------------------------------------------------------
            1. USERNAME CAPTURE & VALIDATION TRACK
            ------------------------------------------------------------------- */}
        <div>
          {/* Label changes dynamically to show a green check or red X based on real-time regex matching */}
          <label className="form_label" htmlFor="username">
            Username:
            <span className={validUsername ? 'valid' : 'hide'}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validUsername || !name ? 'hide' : 'invalid'}>
              <FontAwesomeIcon icon={faTimes} />
            </span>   
          </label>
        
          <div className="input_container">
            <MdMarkEmailRead className="form_icon" />
            <input 
              type="text"
              id="username"
              className="form_input"
              ref={usernameRef}
              autoComplete="off"
              value={name}
              onChange={handleUsernameChange}
              required
              onFocus={() => setUsernameFocus(true)}
              onBlur={() => setUsernameFocus(false)}
            />
          </div>
        </div>

        {/* USERNAME HOVER/SELECTION INSTRUCTIONS
            This notes panel fades into view only when the user is actively inside 
            the username field, has typed characters, and hasn't yet met the complexity requirements. */}
        <p id="username_note" className={usernameFocus && name && !validUsername ? 'instructions' : 'offscreen'}>
          <FontAwesomeIcon icon={faInfoCircle} />
          4 to 24 characters.<br />
          Must begin with a letter.<br />
          Letters, numbers, underscores, hyphens allowed.
        </p>

        {/* -------------------------------------------------------------------
            2. EMAIL ADDRESS CAPTURE & VALIDATION TRACK
            ------------------------------------------------------------------- */}
        <div>
          <label className="form_label" htmlFor="email">
            Email:
            <span className={validEmail ? 'valid' : 'hide'}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validEmail || !email ? 'hide' : 'invalid'}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>

          <div className="input_container">
            <MdMarkEmailRead className="form_icon" />
            <input 
              type="email"
              id="email"
              className="form_input"
              value={email}
              onChange={handleEmailChange}
              required
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
          </div>
        </div>

        {/* EMAIL FORMAT COMPLIANCE TOOLTIP */}
        <p id="email_note" className={emailFocus && email && !validEmail ? 'instructions' : 'offscreen'}>
          <FontAwesomeIcon icon={faInfoCircle} />
          Enter a valid email address.
        </p>

        {/* -------------------------------------------------------------------
            3. CRYPTOGRAPHIC PASSWORD GENERATION TRACK
            ------------------------------------------------------------------- */}
        <div>
          <label className="form_label" htmlFor="password">
            Password:
            <span className={validPassword ? 'valid' : 'hide'}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validPassword || !password ? 'hide' : 'invalid'}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>

          <div className="input_container">
            <BsFillShieldLockFill className="form_icon" />
            <input
              type="password"
              id="password"
              className="form_input"
              value={password}
              onChange={handlePasswordChange}
              required
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
          </div>
        </div>

        {/* COMPLEXITY STANDARDS SUMMARY BUNDLE */}
        <p id="password_note" className={passwordFocus && !validPassword ? 'instructions' : 'offscreen'}>
          <FontAwesomeIcon icon={faInfoCircle} />
          8 to 24 characters.<br />
          Must include upper and lowercase letters, a number and a special character.<br />
          Allowed special characters: ! @ # $ %
        </p>

        {/* -------------------------------------------------------------------
            4. IDENTITY CONFIRMATION COMPARISON BLOCK
            ------------------------------------------------------------------- */}
        <div>
          <label className="form_label" htmlFor="confirm_password">
            Confirm Password:
            <span className={validPasswordMatch && passwordMatch ? 'valid' : 'hide'}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validPasswordMatch || !passwordMatch ? 'hide' : 'invalid'}>
              <FontAwesomeIcon icon={faTimes} />
            </span>    
          </label>

          <div className="input_container">
            <BsFillShieldLockFill className="form_icon" />
            <input
              type="password"
              id="confirm_password"
              className="form_input"
              value={passwordMatch}
              onChange={handlePasswordMatchChange}
              required
              onFocus={() => setPasswordMatchFocus(true)}
              onBlur={() => setPasswordMatchFocus(false)}
            />
          </div>
        </div>

        {/* PASSWORD COMPARISON MISMATCH TOOLTIP */}
        <p id="password_confirm_note" className={passwordMatchFocus && !validPasswordMatch ? 'instructions' : 'offscreen'}>
          <FontAwesomeIcon icon={faInfoCircle} />
          Must match first password.
        </p>

        {/* -------------------------------------------------------------------
            5. FORM STATE SUBMISSION TRIGGER
            ------------------------------------------------------------------- */}
        {/* Disables user input channels while network database transactions are active.
            Replaces regular action text strings with an active processing wheel spinner. */}
        <button className="submit_button" disabled={isLoading} type="submit">
          {isLoading ? (
            <CircularProgress size={24} style={{ color: '#ffffff' }} />
          ) : (
            <>
              <span>Register</span>
              <AiOutlineSwapRight className="button_icon" />
            </>
          )}
        </button>
        
        {/* SECURE DEVICE COOKIE TIMELINE EXTENDER
            Flags whether the application should set long-term persistent cookie expiration 
            timestamps on the backend instead of volatile temporary browser runtime session frames. */}
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
      </form>
    </div>
  );
};

export default RegisterForm;