import { getColumnLabelString } from "../../column-label";
import type { DataGridColumn } from "../../types";
import { getDataGridColumnDisplayValue } from "../cells/get-data-grid-cell-value";
import { toCsv } from "./csv-utils";
import { downloadTextFile } from "./download-text-file";
import { sanitizeFilename } from "./sanitize-filename";

export function buildDataGridExportRows<TData>(input: {
  columns: DataGridColumn<TData>[];
  rows: TData[];
}) {
  const headers = getUniqueColumnLabels(input.columns);

  return input.rows.map((row, rowIndex) =>
    input.columns.reduce<Record<string, string>>((record, column, index) => {
      record[headers[index] ?? getColumnLabelString(column)] =
        getDataGridColumnDisplayValue(column, row, rowIndex);
      return record;
    }, {}),
  );
}

export { toCsv } from "./csv-utils";
export { downloadTextFile } from "./download-text-file";
export { sanitizeFilename } from "./sanitize-filename";

function getUniqueColumnLabels<TData>(columns: DataGridColumn<TData>[]) {
  const seen = new Map<string, number>();

  return columns.map((column) => {
    const label = getColumnLabelString(column);
    const count = seen.get(label) ?? 0;

    seen.set(label, count + 1);

    return count === 0 ? label : `${label} ${count + 1}`;
  });
}

export function exportDataGridCsv<TData>(input: {
  columns: DataGridColumn<TData>[];
  rows: TData[];
  filename: string;
}) {
  const exportRows = buildDataGridExportRows(input);
  downloadTextFile({
    filename: `${sanitizeFilename(input.filename)}.csv`,
    mimeType: "text/csv;charset=utf-8",
    contents: toCsv(exportRows),
  });
}
