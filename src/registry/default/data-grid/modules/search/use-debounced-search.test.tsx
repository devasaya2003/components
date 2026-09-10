import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { DATA_GRID_SEARCH_DEBOUNCE_MS } from "./use-debounced-callback";
import { useDebouncedSearch } from "./use-debounced-search";

describe("useDebouncedSearch", () => {
  it("trims and debounces the search callback", () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedSearch(onSearch, DATA_GRID_SEARCH_DEBOUNCE_MS),
    );

    act(() => {
      result.current("  acme  ");
    });

    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(DATA_GRID_SEARCH_DEBOUNCE_MS);
    });

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("acme");
    vi.useRealTimers();
  });

  it("does nothing when onSearch is undefined", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDebouncedSearch(undefined, 50));

    act(() => {
      result.current("query");
      vi.advanceTimersByTime(50);
    });

    vi.useRealTimers();
  });
});
