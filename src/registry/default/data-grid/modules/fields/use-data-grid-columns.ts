"use client";

import { useEffect, useMemo, useState } from "react";
import { MIN_COLUMN_WIDTH, type DataGridColumn, type DataGridColumnFilters, type DataGridSort } from "../../types";
import {
  EMPTY_DATA_GRID_LAYOUT,
  readDataGridPersistedState,
  writeDataGridPersistedState,
  type DataGridColumnLayoutState,
} from "../persistence/use-data-grid-persistence";
import {
  deriveOrderedColumns,
  resolveVisibleColumnIds,
} from "./derive-ordered-columns";

type UseDataGridColumnsInput<TData> = {
  tableId: string;
  columns: DataGridColumn<TData>[];
  persist?: boolean;
  viewState?: {
    search: string;
    sort: DataGridSort;
    filters: DataGridColumnFilters;
  };
};

export function useDataGridColumns<TData>({
  tableId,
  columns,
  persist = true,
  viewState,
}: UseDataGridColumnsInput<TData>) {
  const [activeTableId, setActiveTableId] = useState(tableId);
  const [layout, setLayout] = useState<DataGridColumnLayoutState>(() => {
    if (!persist) {
      return EMPTY_DATA_GRID_LAYOUT;
    }
    return readDataGridPersistedState(tableId)?.layout ?? EMPTY_DATA_GRID_LAYOUT;
  });

  if (activeTableId !== tableId) {
    setActiveTableId(tableId);
    setLayout(
      persist
        ? (readDataGridPersistedState(tableId)?.layout ?? EMPTY_DATA_GRID_LAYOUT)
        : EMPTY_DATA_GRID_LAYOUT,
    );
  }

  useEffect(() => {
    if (!persist) {
      return;
    }
    const current = readDataGridPersistedState(tableId);
    writeDataGridPersistedState(tableId, {
      layout,
      view: viewState ?? current?.view,
    });
  }, [layout, persist, tableId, viewState]);

  const availableColumnIds = useMemo(
    () => columns.map((column) => column.id),
    [columns],
  );
  const availableColumnIdSet = useMemo(
    () => new Set(availableColumnIds),
    [availableColumnIds],
  );

  const visibleColumnIds = useMemo(
    () =>
      resolveVisibleColumnIds({
        columns,
        storedVisibleColumnIds: layout.visibleColumnIds,
      }),
    [columns, layout.visibleColumnIds],
  );

  const columnOrder =
    layout.columnOrder.length > 0 ? layout.columnOrder : availableColumnIds;

  const orderedColumns = useMemo(
    () =>
      deriveOrderedColumns({
        columns,
        visibleColumnIds,
        columnOrder: layout.columnOrder,
        pinnedColumnIds: layout.pinnedColumnIds,
      }),
    [columns, visibleColumnIds, layout.columnOrder, layout.pinnedColumnIds],
  );

  function updateVisibleColumnIds(nextColumnIds: string[]) {
    const nextColumnIdSet = new Set(nextColumnIds);
    setLayout((current) => ({
      ...current,
      visibleColumnIds: nextColumnIds,
      columnOrder:
        current.columnOrder.length > 0
          ? current.columnOrder
          : availableColumnIds,
      pinnedColumnIds: current.pinnedColumnIds.filter((columnId) =>
        nextColumnIdSet.has(columnId),
      ),
    }));
  }

  function updatePinnedColumnIds(nextColumnIds: string[]) {
    const nextVisibleColumnIdSet = new Set(visibleColumnIds);
    setLayout((current) => ({
      ...current,
      pinnedColumnIds: nextColumnIds.filter((columnId) =>
        nextVisibleColumnIdSet.has(columnId),
      ),
    }));
  }

  function moveColumn(columnId: string, direction: "left" | "right") {
    const currentOrder =
      layout.columnOrder.length > 0
        ? layout.columnOrder.filter((id) => availableColumnIdSet.has(id))
        : availableColumnIds;
    const currentIndex = currentOrder.indexOf(columnId);

    if (currentIndex === -1) return;

    const nextIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;

    if (nextIndex < 0 || nextIndex >= currentOrder.length) return;

    const nextOrder = [...currentOrder];
    const [movedColumnId] = nextOrder.splice(currentIndex, 1);

    if (!movedColumnId) return;

    nextOrder.splice(nextIndex, 0, movedColumnId);
    setLayout((current) => ({ ...current, columnOrder: nextOrder }));
  }

  function setColumnWidth(columnId: string, width: number) {
    const nextWidth = Math.max(MIN_COLUMN_WIDTH, Math.round(width));
    setLayout((current) => ({
      ...current,
      columnWidths: {
        ...current.columnWidths,
        [columnId]: nextWidth,
      },
    }));
  }

  return {
    availableColumnIds,
    columnOrder,
    columnWidths: layout.columnWidths,
    moveColumn,
    orderedColumns,
    pinnedColumnIds: layout.pinnedColumnIds,
    setColumnWidth,
    updatePinnedColumnIds,
    updateVisibleColumnIds,
    visibleColumnIds,
  };
}
