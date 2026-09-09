import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  DATA_GRID_SEARCH_DEBOUNCE_MS,
  useDebouncedCallback,
} from "./use-debounced-callback";

describe("useDebouncedCallback", () => {
  it("debounces the callback by the configured delay", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, DATA_GRID_SEARCH_DEBOUNCE_MS),
    );

    act(() => {
      result.current("first");
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(DATA_GRID_SEARCH_DEBOUNCE_MS);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("first");
    vi.useRealTimers();
  });

  it("only fires the last call when invoked rapidly", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, 100),
    );

    act(() => {
      result.current("a");
      result.current("b");
      result.current("c");
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("c");
    vi.useRealTimers();
  });
});
