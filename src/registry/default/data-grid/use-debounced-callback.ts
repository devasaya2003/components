import { useEffect, useRef } from "react";

export const DATA_GRID_SEARCH_DEBOUNCE_MS = 250;

export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number = DATA_GRID_SEARCH_DEBOUNCE_MS,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const timeoutRef = useRef<number | null>(null);

  function debounced(...args: Parameters<T>) {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debounced;
}
