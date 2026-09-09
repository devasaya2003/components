import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDataGridColumnFilters } from "./use-data-grid-column-filters";

describe("useDataGridColumnFilters", () => {
  it("starts with no active filters", () => {
    const { result } = renderHook(() => useDataGridColumnFilters());
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.activeFilterCount).toBe(0);
  });

  it("sets a column filter and reports it as active", () => {
    const { result } = renderHook(() => useDataGridColumnFilters());
    act(() => {
      result.current.setColumnFilter("status", ["open", "done"]);
    });
    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.activeFilterCount).toBe(1);
    expect(result.current.columnFilters.status).toEqual(["open", "done"]);
  });

  it("removes a filter when set to empty array", () => {
    const { result } = renderHook(() => useDataGridColumnFilters());
    act(() => {
      result.current.setColumnFilter("status", ["open"]);
    });
    act(() => {
      result.current.setColumnFilter("status", []);
    });
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.columnFilters.status).toBeUndefined();
  });

  it("clears a single column filter", () => {
    const { result } = renderHook(() => useDataGridColumnFilters());
    act(() => {
      result.current.setColumnFilter("status", ["open"]);
      result.current.setColumnFilter("city", ["NYC"]);
    });
    act(() => {
      result.current.clearColumnFilter("status");
    });
    expect(result.current.activeFilterCount).toBe(1);
  });

  it("clears all filters", () => {
    const { result } = renderHook(() => useDataGridColumnFilters());
    act(() => {
      result.current.setColumnFilter("status", ["open"]);
      result.current.setColumnFilter("city", ["NYC"]);
    });
    act(() => {
      result.current.clearAllFilters();
    });
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("serializes active filters to query params", () => {
    const { result } = renderHook(() => useDataGridColumnFilters());
    act(() => {
      result.current.setColumnFilter("status", ["open"]);
    });
    const params = result.current.toQueryParams();
    expect(typeof params.filters).toBe("string");
    expect(JSON.parse(params.filters ?? "{}")).toEqual({ status: ["open"] });
  });
});
