import { describe, expect, it, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDataGridColumns } from "./use-data-grid-columns";
import { SERIAL_NUMBER_COLUMN_ID } from "../cells/serial-number-column";
import type { DataGridColumn } from "../../types";

type Row = Record<string, unknown>;

const columns: DataGridColumn<Row>[] = [
  { id: SERIAL_NUMBER_COLUMN_ID, label: "S.No.", getValue: () => "" },
  { id: "name", label: "Name", getValue: () => "", width: 200 },
  { id: "city", label: "City", getValue: () => "", width: 200 },
];

beforeEach(() => {
  vi.stubGlobal("window", {
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
  });
});

describe("useDataGridColumns", () => {
  it("returns all available column ids", () => {
    const { result } = renderHook(() =>
      useDataGridColumns({ tableId: "test", columns, persist: false }),
    );
    expect(result.current.availableColumnIds).toEqual([
      SERIAL_NUMBER_COLUMN_ID,
      "name",
      "city",
    ]);
  });

  it("derives ordered columns with serial first", () => {
    const { result } = renderHook(() =>
      useDataGridColumns({ tableId: "test", columns, persist: false }),
    );
    expect(result.current.orderedColumns[0]?.id).toBe(SERIAL_NUMBER_COLUMN_ID);
    expect(result.current.orderedColumns.length).toBe(3);
  });

  it("hides a column via updateVisibleColumnIds", () => {
    const { result } = renderHook(() =>
      useDataGridColumns({ tableId: "test", columns, persist: false }),
    );
    act(() => {
      result.current.updateVisibleColumnIds([SERIAL_NUMBER_COLUMN_ID, "name"]);
    });
    expect(result.current.visibleColumnIds).toContain("name");
    expect(result.current.visibleColumnIds).not.toContain("city");
  });

  it("pins a column via updatePinnedColumnIds", () => {
    const { result } = renderHook(() =>
      useDataGridColumns({ tableId: "test", columns, persist: false }),
    );
    act(() => {
      result.current.updatePinnedColumnIds(["city"]);
    });
    expect(result.current.pinnedColumnIds).toEqual(["city"]);
  });

  it("moves a column left and right", () => {
    const { result } = renderHook(() =>
      useDataGridColumns({ tableId: "test", columns, persist: false }),
    );
    act(() => {
      result.current.moveColumn("city", "left");
    });
    const order = result.current.orderedColumns.map((c) => c.id);
    expect(order.indexOf("city")).toBeLessThan(order.indexOf("name"));
  });

  it("sets a column width", () => {
    const { result } = renderHook(() =>
      useDataGridColumns({ tableId: "test", columns, persist: false }),
    );
    act(() => {
      result.current.setColumnWidth("name", 400);
    });
    expect(result.current.columnWidths.name).toBe(400);
  });
});
