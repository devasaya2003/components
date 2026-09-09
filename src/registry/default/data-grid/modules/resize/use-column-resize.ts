"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { DataGridColumn } from "../../types";
import { clampColumnWidth } from "./clamp-column-width";

export type ResizeDraft = {
  columnId: string;
  startX: number;
  startWidth: number;
  width: number;
};

export type UseColumnResizeInput<TData> = {
  getBaseWidth: (column: DataGridColumn<TData>) => number;
  isControlled: boolean;
  onColumnWidthChange?: (columnId: string, width: number) => void;
  setUncontrolledWidths: (
    update: (current: Record<string, number>) => Record<string, number>,
  ) => void;
};

export function useColumnResize<TData>({
  getBaseWidth,
  isControlled,
  onColumnWidthChange,
  setUncontrolledWidths,
}: UseColumnResizeInput<TData>) {
  const [resizeDraft, setResizeDraft] = useState<ResizeDraft | null>(null);
  const resizeDraftRef = useRef<ResizeDraft | null>(null);

  function commitWidth(columnId: string, width: number) {
    const nextWidth = clampColumnWidth(width);
    if (onColumnWidthChange) {
      onColumnWidthChange(columnId, nextWidth);
      return;
    }
    if (!isControlled) {
      setUncontrolledWidths((current) => ({
        ...current,
        [columnId]: nextWidth,
      }));
    }
  }

  function endResize(event: PointerEvent) {
    const draft = resizeDraftRef.current;
    if (!draft) {
      return;
    }

    const target = event.target as Element | null;
    if (target && "releasePointerCapture" in target) {
      try {
        (target as Element).releasePointerCapture(event.pointerId);
      } catch {
        // Pointer may already be released.
      }
    }

    commitWidth(draft.columnId, draft.width);
    resizeDraftRef.current = null;
    setResizeDraft(null);
  }

  function handleResizePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
    column: DataGridColumn<TData>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    const startWidth = getBaseWidth(column);
    const draft: ResizeDraft = {
      columnId: column.id,
      startX: event.clientX,
      startWidth,
      width: startWidth,
    };
    resizeDraftRef.current = draft;
    setResizeDraft(draft);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleResizePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const draft = resizeDraftRef.current;
    if (!draft) {
      return;
    }

    const nextWidth = clampColumnWidth(
      draft.startWidth + (event.clientX - draft.startX),
    );
    const nextDraft = { ...draft, width: nextWidth };
    resizeDraftRef.current = nextDraft;
    setResizeDraft(nextDraft);
  }

  function handleResizePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    endResize(event.nativeEvent);
  }

  return {
    resizeDraft,
    isColumnResizing: resizeDraft !== null,
    handleResizePointerDown,
    handleResizePointerMove,
    handleResizePointerUp,
  };
}
