// src/utils/formValidation.ts
// =========================================================================
// LIGHTWEIGHT FRONT-END CREDENTIALS DISPATCH VALIDATOR UTILITY
// =========================================================================
// - Enforces structural pattern requirements on registration inputs.
// - Safeguards database queries by catching malformed entries on the client.
// - Interacts seamlessly with form fields to update real-time visual states.
// =========================================================================
import { Dispatch, SetStateAction } from 'react';

// -------------------------------------------------------------------------
// 1. REGULAR EXPRESSION COMPLEXITY BLUEPRINTS
// -------------------------------------------------------------------------
// Strict structural boundaries that text inputs must fulfill to be accepted.
// -------------------------------------------------------------------------

// Username Standards: Must kick off with a letter, followed by 3 to 23 
// alphanumeric characters, hyphens, or underscores.
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;

// Standard Email Standards: Enforces traditional mailbox syntax rules, 
// ensuring presence of a localized text string, an '@' connector, and a top-level domain suffix.
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password Standards: 8 to 24 characters. Explicitly requires at least 
// one uppercase letter, one lowercase letter, one number, and one special structural symbol.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,24}$/;

// -------------------------------------------------------------------------
// 2. EXPORTED VALIDATION EVALUATION HANDLING METHODS
// -------------------------------------------------------------------------
// Direct operational hooks that run pattern match checks against field inputs.
// -------------------------------------------------------------------------

// Evaluates a username string input against character constraints and updates 
// the active form validation tracking indicators immediately.
export const validateUsername = (
  username: string, 
  setValidUsername: Dispatch<SetStateAction<boolean>>
): void => {
  setValidUsername(USERNAME_REGEX.test(username));
};

// Evaluates an email address string input against connectivity criteria and updates 
// the active form validation tracking indicators immediately.
export const validateEmail = (
  email: string, 
  setValidEmail: Dispatch<SetStateAction<boolean>>
): void => {
  setValidEmail(EMAIL_REGEX.test(email));
};

// Evaluates a main password string input against structural complexity requirements.
// Simultaneously performs a secondary verification to check if the confirmation field entry 
// matches the primary password text string exactly.
export const validatePassword = (
  password: string, 
  setValidPassword: Dispatch<SetStateAction<boolean>>, 
  passwordMatch: string, 
  setValidPasswordMatch: Dispatch<SetStateAction<boolean>>
): void => {
  setValidPassword(PASSWORD_REGEX.test(password));
  setValidPasswordMatch(password === passwordMatch && password.length > 0);
};