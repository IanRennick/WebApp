// src/hooks/localStorage/useLocalStorage.ts
// =========================================================================
// UNIVERSAL DATA PERSISTENCE HOOK (LOCAL STORAGE CACHE ENGINE)
// =========================================================================
// - Synchronizes transient UI states directly with the browser's persistent cache.
// - Formats and stringifies raw JavaScript objects/booleans for storage.
// - Gracefully interprets fallback parameters if no historical data exists.
// - Automatically updates browser storage rows whenever state values mutate.
// =========================================================================
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// -------------------------------------------------------------------------
// 1. DATA EXTRACTION CONTROLLER (GET LOCAL VALUE)
// -------------------------------------------------------------------------
// Background utility that searches the browser's disk space for a given key.
// Parses raw storage strings into usable runtime data arrays, objects, or booleans.
// -------------------------------------------------------------------------
const getLocalValue = <T>(key: string, initialValue: T | (() => T)): T => {
  // Defensive Check: If running outside a browser context, safely skip reading the disk
  if (typeof window === 'undefined') {
    return initialValue instanceof Function ? initialValue() : initialValue;
  }

  try {
    const rawStoredValue = localStorage.getItem(key);
    
    // If a saved data row already exists in storage, extract and decode it
    if (rawStoredValue !== null) {
      return JSON.parse(rawStoredValue) as T;
    }
  } catch (error) {
    console.error("Local storage initialization parse failure:", error);
  }

  // FALLBACK PROCESSING: If no historical row exists, evaluate the default parameter.
  // Handles cases where the default value is passed as an executable setup function.
  if (initialValue instanceof Function) {
    return initialValue();
  }

  // Return the standard default value parameter if storage was completely empty
  return initialValue;
};

// -------------------------------------------------------------------------
// 2. STATE PERSISTENCE COUPLER (USE LOCAL STORAGE)
// -------------------------------------------------------------------------
// A drop-in custom replacement for standard useState.
// It matches standard state/setter signatures perfectly while managing disk syncs.
// -------------------------------------------------------------------------
const useLocalStorage = <T>(
  key: string, 
  initialValue: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] => {

  // Initialize the local reactive state block with either historical cache data 
  // or the configured baseline default fallback value up front
  const [value, setValue] = useState<T>(() => {
    return getLocalValue<T>(key, initialValue);
  });

  // -----------------------------------------------------------------------
  // PERSISTENCE DISK WRITER SIDE-EFFECT
  // -----------------------------------------------------------------------
  // Monitors the current value state. The microsecond the data value is changed
  // anywhere across the app, this converts it to a string and commits it to disk.
  // -----------------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // Export a structured state and state-setter pairing matching standard React structures
  return [value, setValue];
};

export default useLocalStorage;