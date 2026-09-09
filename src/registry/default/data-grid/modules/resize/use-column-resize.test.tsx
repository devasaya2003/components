import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useColumnResize } from "./use-column-resize";
import type { DataGridColumn } from "../../types";

type Row = Record<string, unknown>;

const column: DataGridColumn<Row> = {
  id: "name",
  label: "Name",
  getValue: () => "",
  width: 200,
};

function makeHook() {
  return renderHook(() =>
    useColumnResize<Row>({
      getBaseWidth: (col) => col.width ?? 220,
      isControlled: false,
      setUncontrolledWidths: (update) => update({}),
    }),
  );
}

describe("useColumnResize", () => {
  it("starts with no active resize", () => {
    const { result } = makeHook();
    expect(result.current.isColumnResizing).toBe(false);
    expect(result.current.resizeDraft).toBeNull();
  });

  it("sets a resize draft on pointer down", () => {
    const { result } = makeHook();
    const fakeEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      clientX: 100,
      pointerId: 1,
      currentTarget: { setPointerCapture: vi.fn() },
    } as unknown as React.PointerEvent<HTMLDivElement>;

    act(() => {
      result.current.handleResizePointerDown(fakeEvent, column);
    });

    expect(result.current.isColumnResizing).toBe(true);
    expect(result.current.resizeDraft?.columnId).toBe("name");
    expect(result.current.resizeDraft?.startX).toBe(100);
    expect(result.current.resizeDraft?.startWidth).toBe(200);
  });

  it("updates draft width on pointer move", () => {
    const { result } = makeHook();
    const downEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      clientX: 100,
      pointerId: 1,
      currentTarget: { setPointerCapture: vi.fn() },
    } as unknown as React.PointerEvent<HTMLDivElement>;

    act(() => {
      result.current.handleResizePointerDown(downEvent, column);
    });

    const moveEvent = {
      clientX: 150,
    } as unknown as React.PointerEvent<HTMLDivElement>;

    act(() => {
      result.current.handleResizePointerMove(moveEvent);
    });

    expect(result.current.resizeDraft?.width).toBe(250);
  });
});
