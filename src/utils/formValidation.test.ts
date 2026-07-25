// src/utils/formValidation.test.ts
// =========================================================================
// AUTOMATED UNIT TESTING SUITE (INPUT VALIDATION UTILITY SPECS)
// =========================================================================
// - Asserts that the client-side validation engine approves clean input formats.
// - Confirms that character array rules flag hidden format exploits.
// - Verifies that email addresses lacking proper domains are securely blocked.
// =========================================================================
import { describe, test, expect, vi } from 'vitest';
import { validateUsername, validateEmail } from './formValidation';

describe('Authentication Form Validation Utility Matrix', () => {
  
  // -----------------------------------------------------------------------
  // SPEC 1: USERNAME FIELD COMPLIANCE AND ASCII EXPLOIT VERIFICATION
  // -----------------------------------------------------------------------
  test('should clear valid usernames and reject bad characters', () => {
    // Set up an isolated, fake spy function to monitor React state updates
    const mockSetState = vi.fn(); 

    // Test Case A: Submit a perfectly structured username containing alphanumeric traits
    validateUsername('Rennlad_123', mockSetState);
    expect(mockSetState).toHaveBeenCalledWith(true);

    // Test Case B: Submit a username containing a leading punctuation bracket.
    // This explicitly asserts that the hidden [A-z] range trap we uncovered is dead!
    validateUsername('[BadName', mockSetState);
    expect(mockSetState).toHaveBeenCalledWith(false);
  });

  // -----------------------------------------------------------------------
  // SPEC 2: EMAIL FORMAT COMPLIANCE AND DOMAIN COMPLETION VERIFICATION
  // -----------------------------------------------------------------------
  test('should validate standard emails and flag typos', () => {
    const mockSetState = vi.fn();

    // Test Case A: Submit a fully standard, complete email address string
    validateEmail('student@rennlad.com', mockSetState);
    expect(mockSetState).toHaveBeenCalledWith(true);

    // Test Case B: Submit a broken email address missing its localized suffix routing tag
    validateEmail('bademail@rennlad', mockSetState);
    expect(mockSetState).toHaveBeenCalledWith(false);
  });
});