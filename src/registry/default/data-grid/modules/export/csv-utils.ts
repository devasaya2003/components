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

export function escapeCsvCell(value: string) {
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

export function neutralizeSpreadsheetFormula(value: string) {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}
