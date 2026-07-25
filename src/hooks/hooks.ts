// src/hooks/hooks.ts
// =========================================================================
// APPLICATION AUTHORITATIVE CENTRAL RETRIEVAL & DISPATCH HOOKS
// =========================================================================
// - Provides a pre-calibrated link straight to the Redux storage core.
// - Replaces standard data fetchers to eliminate repetitive configuration code.
// - Automatically understands your global state parameters without reminders.
// =========================================================================
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';

// -------------------------------------------------------------------------
// 1. DATA STATE MODIFIER CONNECTOR (DISPATCH ACTION CHANNEL)
// -------------------------------------------------------------------------
// Use this throughout your application instead of the raw native useDispatch.
// This gives you a clear connection straight to the central processing hub,
// allowing you to fire actions (like setting tokens or updating state) safely.
// -------------------------------------------------------------------------
export const useAppDispatch = () => useDispatch<AppDispatch>();

// -------------------------------------------------------------------------
// 2. DATA STATE VIEW CONNECTOR (SELECTOR DATA LOOKUP CHANNEL)
// -------------------------------------------------------------------------
// Use this throughout your application instead of the raw native useSelector.
// This opens a secure tracking tunnel into your central global memory tree,
// allowing any component to extract specific variables (like access tokens) 
// without needing to know the technical structural design of your data rows.
// -------------------------------------------------------------------------
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;