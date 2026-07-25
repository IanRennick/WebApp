// src/features/auth/authSlice.test.ts
// =========================================================================
// AUTOMATED UNIT TESTING SUITE (AUTHENTICATION MEMORY SLICE SPECS)
// =========================================================================
// - Verifies that global memory stores start in a secure, unlogged state.
// - Asserts that access tokens are correctly cached upon successful login.
// - Confirms that memory arrays are wiped clean when user logouts trigger.
// =========================================================================
import { describe, test, expect } from 'vitest';
import authReducer, { setCredentials, removeCredentials, selectCurrentToken } from './authSlice';

describe('Authentication Redux Slice Cell Matrix', () => {
  
  // Establish an isolated, clean state template container before each spec execution
  const initialState = {
    token: null,
  };

  // -----------------------------------------------------------------------
  // SPEC 1: INITIAL BOOTSTRAP DEFAULT EVALUATION
  // -----------------------------------------------------------------------
  test('should return the initial state by default', () => {
    // Passing undefined forces the slice to fall back to its internal configuration rules,
    // ensuring the application boots securely with an empty authorization barrier.
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  // -----------------------------------------------------------------------
  // SPEC 2: SECURITY TOKEN RETRIEVAL FLOW
  // -----------------------------------------------------------------------
  test('should handle setCredentials and capture access tokens smoothly', () => {
    const fakeToken = 'v3_pristine_bearer_token_string_123';
    
    // Simulate dispatching a successful token object payload directly down to the store cell
    const actualState = authReducer(initialState, setCredentials({ token: fakeToken }));

    // Assert that our frontend memory array captured the short-term access key perfectly
    expect(actualState.token).toBe(fakeToken);
  });

  // -----------------------------------------------------------------------
  // SPEC 3: CRYPTOGRAPHIC MEMORY PURGE EVALUATION
  // -----------------------------------------------------------------------
  test('should handle removeCredentials and purge token states cleanly', () => {
    const activeState = {
      token: 'active_session_token_to_be_purged',
    };

    // Simulate dispatching a logout event action string directly into an occupied state
    const actualState = authReducer(activeState, removeCredentials());

    // Assert that the token string is completely wiped and rolled back to a secure null state
    expect(actualState.token).toBe(null);
  });

  // -----------------------------------------------------------------------
  // SPEC 4: GLOBAL MEMORY VIEW EXTRACTOR (SELECTOR MATRIX)
  // -----------------------------------------------------------------------
  test('should return the correct token string via selectCurrentToken selector', () => {
    const fakeToken = 'selector_test_bearer_token';
    
    // Mock the layout shape of your global centralized Redux state tree matrix
    const mockGlobalState = {
      auth: {
        token: fakeToken,
      },
    };

    // Verify that our selector extracts the string property smoothly from the nested branch
    const selectedToken = selectCurrentToken(mockGlobalState);
    expect(selectedToken).toBe(fakeToken);
  });
});