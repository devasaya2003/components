import { formatDataGridDate } from "./format-date";
import {
  getSerialNumberValue,
  isSerialNumberColumn,
} from "./serial-number-column";
import type { DataGridColumn } from "./types";

export function getDataGridColumnDisplayValue<TData>(
  column: DataGridColumn<TData>,
  row: TData,
  rowIndex?: number,
) {
  if (isSerialNumberColumn(column.id) && rowIndex !== undefined) {
    return getSerialNumberValue(rowIndex);
  }

  const raw = column.getValue(row);
  const isDate =
    column.valueType === "date" || column.cell?.type === "date";

  if (isDate) {
    return formatDataGridDate(raw);
  }

  return raw;
}
