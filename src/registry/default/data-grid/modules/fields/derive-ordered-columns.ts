import type { DataGridColumn } from "../../types";
import {
  isSerialNumberColumn,
  SERIAL_NUMBER_COLUMN_ID,
} from "../cells/serial-number-column";

export function deriveOrderedColumns<TData>(input: {
  columns: DataGridColumn<TData>[];
  visibleColumnIds: string[];
  columnOrder: string[];
  pinnedColumnIds: string[];
}): DataGridColumn<TData>[] {
  const { columns, visibleColumnIds, columnOrder, pinnedColumnIds } = input;

  const availableColumnIds = columns.map((column) => column.id);
  const columnById = new Map(columns.map((column) => [column.id, column]));
  const nextColumnOrder =
    columnOrder.length > 0 ? columnOrder : availableColumnIds;
  const orderedFromState = nextColumnOrder
    .map((columnId) => columnById.get(columnId))
    .filter((column): column is DataGridColumn<TData> => Boolean(column));
  const nextColumnOrderSet = new Set(nextColumnOrder);
  const remainingColumns = columns.filter(
    (column) => !nextColumnOrderSet.has(column.id),
  );
  const visibleColumnIdSet = new Set(visibleColumnIds);
  const pinnedColumnIdSet = new Set(pinnedColumnIds);
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

  return [
    ...(serialColumn ? [serialColumn] : []),
    ...pinnedWithoutSerial,
    ...unpinnedWithoutSerial,
  ];
}

export function resolveVisibleColumnIds<TData>(input: {
  columns: DataGridColumn<TData>[];
  storedVisibleColumnIds: string[];
}): string[] {
  const { columns, storedVisibleColumnIds } = input;
  const availableColumnIds = columns.map((column) => column.id);

  let visibleColumnIds: string[];

  if (storedVisibleColumnIds.length === 0) {
    visibleColumnIds = availableColumnIds;
  } else {
    const availableColumnIdSet = new Set(availableColumnIds);
    visibleColumnIds = storedVisibleColumnIds.filter((columnId) =>
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

  return visibleColumnIds;
}
