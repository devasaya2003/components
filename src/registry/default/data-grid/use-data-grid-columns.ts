"use client";

import { useEffect, useState } from "react";
import { MIN_COLUMN_WIDTH, type DataGridColumn, type DataGridColumnFilters, type DataGridSort } from "./types";
import {
  EMPTY_DATA_GRID_LAYOUT,
  readDataGridPersistedState,
  writeDataGridPersistedState,
  type DataGridColumnLayoutState,
} from "./use-data-grid-persistence";
import {
  isSerialNumberColumn,
  SERIAL_NUMBER_COLUMN_ID,
} from "./serial-number-column";

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

  const availableColumnIds = columns.map((column) => column.id);

  let visibleColumnIds: string[];

  if (layout.visibleColumnIds.length === 0) {
    visibleColumnIds = availableColumnIds;
  } else {
    const availableColumnIdSet = new Set(availableColumnIds);
    visibleColumnIds = layout.visibleColumnIds.filter((columnId) =>
      availableColumnIdSet.has(columnId),
    );
  }

  const availableColumnIdSet = new Set(availableColumnIds);
  const visibleColumnIdSetForSerial = new Set(visibleColumnIds);

  if (
    availableColumnIdSet.has(SERIAL_NUMBER_COLUMN_ID) &&
    !visibleColumnIdSetForSerial.has(SERIAL_NUMBER_COLUMN_ID)
  ) {
    visibleColumnIds = [SERIAL_NUMBER_COLUMN_ID, ...visibleColumnIds];
  }

  const columnOrder =
    layout.columnOrder.length > 0 ? layout.columnOrder : availableColumnIds;

  const columnById = new Map(columns.map((column) => [column.id, column]));
  const nextColumnOrder =
    layout.columnOrder.length > 0 ? layout.columnOrder : availableColumnIds;
  const orderedFromState = nextColumnOrder
    .map((columnId) => columnById.get(columnId))
    .filter((column): column is DataGridColumn<TData> => Boolean(column));
  const nextColumnOrderSet = new Set(nextColumnOrder);
  const remainingColumns = columns.filter(
    (column) => !nextColumnOrderSet.has(column.id),
  );
  const visibleColumnIdSet = new Set(visibleColumnIds);
  const pinnedColumnIdSet = new Set(layout.pinnedColumnIds);
  const visibleOrderedColumns = [
    ...orderedFromState,
    ...remainingColumns,
  ].filter((column) => visibleColumnIdSet.has(column.id));
  const pinnedColumns = visibleOrderedColumns.filter((column) =>
    pinnedColumnIdSet.has(column.id),
  );
  const unpinnedColumns = visibleOrderedColumns.filter(
    (column) => !pinnedColumnIdSet.has(column.id),
  );
  const serialColumn = visibleOrderedColumns.find((column) =>
    isSerialNumberColumn(column.id),
  );
  const pinnedWithoutSerial = pinnedColumns.filter(
    (column) => !isSerialNumberColumn(column.id),
  );
  const unpinnedWithoutSerial = unpinnedColumns.filter(
    (column) => !isSerialNumberColumn(column.id),
  );

  const orderedColumns = [
    ...(serialColumn ? [serialColumn] : []),
    ...pinnedWithoutSerial,
    ...unpinnedWithoutSerial,
  ];

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
