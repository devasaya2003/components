import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  DEFAULT_DATA_GRID_INITIAL_BEHAVIOR,
  useDataGridInitialBehavior,
} from "./use-data-grid-initial-behavior";

describe("useDataGridInitialBehavior", () => {
  it("defaults to empty search, null sort, no filters", () => {
    const { result } = renderHook(() => useDataGridInitialBehavior());
    expect(result.current.search).toBe("");
    expect(result.current.sort).toBeNull();
    expect(result.current.columnFilters).toEqual({});
  });

  it("seeds initial search, sort, and filters", () => {
    const { result } = renderHook(() =>
      useDataGridInitialBehavior({
        search: "acme",
        sort: { columnId: "name", direction: "asc" },
        filters: { status: ["open"] },
      }),
    );
    expect(result.current.search).toBe("acme");
    expect(result.current.sort).toEqual({ columnId: "name", direction: "asc" });
    expect(result.current.columnFilters.status).toEqual(["open"]);
  });

  it("allows updating search independently", () => {
    const { result } = renderHook(() => useDataGridInitialBehavior());
    act(() => {
      result.current.setSearch("new term");
    });
    expect(result.current.search).toBe("new term");
  });

  it("exposes the default constant", () => {
    expect(DEFAULT_DATA_GRID_INITIAL_BEHAVIOR.search).toBe("");
    expect(DEFAULT_DATA_GRID_INITIAL_BEHAVIOR.sort).toBeNull();
  });
});
