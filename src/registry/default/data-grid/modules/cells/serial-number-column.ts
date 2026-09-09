import type { DataGridColumn } from "../../types";

export const SERIAL_NUMBER_COLUMN_ID = "__serialNumber";

export function createSerialNumberColumn<TData>(): DataGridColumn<TData> {
  return {
    id: SERIAL_NUMBER_COLUMN_ID,
    label: "S.No.",
    width: 72,
    getValue: () => "",
    filterable: false,
  };
}

export function isSerialNumberColumn(columnId: string) {
  return columnId === SERIAL_NUMBER_COLUMN_ID;
}

export function isUnsortableColumn(columnId: string) {
  return (
    isSerialNumberColumn(columnId) ||
    columnId === "selected" ||
    columnId === "action" ||
    columnId === "actions"
  );
}

export function getSerialNumberValue(index: number) {
  return String(index + 1);
}
