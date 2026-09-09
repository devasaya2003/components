import { getColumnLabelString, type DataGridColumn } from "./types";
import { getDataGridColumnDisplayValue } from "./get-data-grid-cell-value";

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

export function toCsv(rows: Array<Record<string, string>>) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0] ?? {});
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvCell(row[header] ?? "")).join(","),
    ),
  ];

  return lines.join("\n");
}

export function downloadTextFile(input: {
  filename: string;
  mimeType: string;
  contents: string;
}) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + input.contents], { type: input.mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = input.filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function sanitizeFilename(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "export"
  );
}

function getUniqueColumnLabels<TData>(columns: DataGridColumn<TData>[]) {
  const seen = new Map<string, number>();

  return columns.map((column) => {
    const label = getColumnLabelString(column);
    const count = seen.get(label) ?? 0;

    seen.set(label, count + 1);

    return count === 0 ? label : `${label} ${count + 1}`;
  });
}

function escapeCsvCell(value: string) {
  const normalizedValue = neutralizeSpreadsheetFormula(
    value.replace(/\r?\n/g, "\n"),
  );

  if (
    normalizedValue.includes(",") ||
    normalizedValue.includes('"') ||
    normalizedValue.includes("\n")
  ) {
    return `"${normalizedValue.replaceAll('"', '""')}"`;
  }

  return normalizedValue;
}

function neutralizeSpreadsheetFormula(value: string) {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
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
