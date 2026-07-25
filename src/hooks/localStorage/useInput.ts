// src/hooks/localStorage/useInput.ts
// =========================================================================
// DATA HANDLER HOOK FOR CACHED INPUT FIELDS (LOCAL STORAGE TEXT UNIFIER)
// =========================================================================
// - Synchronizes typed text characters seamlessly with browser local storage.
// - Packages current values and change functions into an automated bundle.
// - Enables form views to spread attributes directly onto text field tags.
// - Prevents users from losing typed data during accidental page reloads.
// =========================================================================
import { ChangeEvent } from 'react';
import useLocalStorage from './useLocalStorage';

type UseInputResult = [
  string,
  () => void,
  {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }
];

const useInput = (key: string, initValue: string): UseInputResult => {
  // Connect the text container directly to a persistent local storage row partition
  const [value, setValue] = useLocalStorage<string>(key, initValue);

  // -----------------------------------------------------------------------
  // FIELD PURGE WORKFLOW
  // -----------------------------------------------------------------------
  // Rolls the text input value completely back to its starting state (empty string).
  // This automatically clears the row out of the browser's persistent local cache.
  // -----------------------------------------------------------------------
  const reset = (): void => setValue(initValue);

  // -----------------------------------------------------------------------
  // BROWSER ELEMENT ATTRIBUTES BUNDLE
  // -----------------------------------------------------------------------
  // Packs the active string value and the text modifier action into one block.
  // This lets components use the {...attributes} short-hand spread on inputs,
  // completely eliminating the need to write custom onChange methods on views.
  // -----------------------------------------------------------------------
  const attributeObj = {
    value,
    onChange: (e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value)
  };

  // Return a structured array tuple containing the state, reset tool, and spreadable bundle
  return [value, reset, attributeObj];
};

export default useInput;