// src/hooks/localStorage/useToggle.ts
// =========================================================================
// DATA HANDLER HOOK FOR PERSISTED TOGGLES (LOCAL STORAGE BINARY UNIFIER)
// =========================================================================
// - Manages true/false interface indicators seamlessly inside local storage.
// - Handles automated state inversions for standard checkbox changes.
// - Supports strict value assignments to force explicit boolean overwrites.
// - Retains settings (like themes or checkbox selections) across browser reboots.
// =========================================================================
import useLocalStorage from './useLocalStorage';

type UseToggleResult = [
  boolean,
  (value?: boolean | unknown) => void
];

const useToggle = (key: string, initValue: boolean): UseToggleResult => {
  // Connect the true/false indicator straight to a persistent local storage row partition
  const [value, setValue] = useLocalStorage<boolean>(key, initValue);

  // -----------------------------------------------------------------------
  // STATE INVERSION AND FORCE CONTROLLER
  // -----------------------------------------------------------------------
  // Evaluates incoming arguments to decide how to shift the binary flag.
  // If an event passes an explicit true/false value, it forces that selection.
  // If no value or a standard click event object is passed, it cleanly flips 
  // the current state value backward to its opposite state automatically.
  // -----------------------------------------------------------------------
  const toggle = (value?: boolean | unknown): void => {
    setValue(prev => {
      return typeof value === 'boolean' ? value : !prev;
    });
  };

  // Return a structured array tuple containing the state flag and the change trigger
  return [value, toggle];
};

export default useToggle;