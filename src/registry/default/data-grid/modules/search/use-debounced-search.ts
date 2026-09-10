import {
  DATA_GRID_SEARCH_DEBOUNCE_MS,
  useDebouncedCallback,
} from "./use-debounced-callback";

export function useDebouncedSearch(
  onSearch: ((search: string) => void) | undefined,
  delay: number = DATA_GRID_SEARCH_DEBOUNCE_MS,
) {
  return useDebouncedCallback((nextSearch: string) => {
    onSearch?.(nextSearch.trim());
  }, delay);
}
