import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDataGridSort } from "./use-data-grid-sort";
import type { DataGridSort } from "../../types";

describe("useDataGridSort", () => {
  it("initializes with the provided sort", () => {
    const initial: DataGridSort = { columnId: "name", direction: "asc" };
    const { result } = renderHook(() => useDataGridSort(initial));
    expect(result.current.sort).toEqual(initial);
  });

  it("defaults to null sort", () => {
    const { result } = renderHook(() => useDataGridSort());
    expect(result.current.sort).toBeNull();
  });

  it("updates sort via setSort", () => {
    const { result } = renderHook(() => useDataGridSort());
    act(() => {
      result.current.setSort({ columnId: "age", direction: "desc" });
    });
    expect(result.current.sort).toEqual({ columnId: "age", direction: "desc" });
  });
});
