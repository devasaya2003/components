const EMPTY_SORT_VALUES = new Set(["", "—", "-"]);
const ISO_DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})/;
const MONTH_NAME = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i;

/** Grid cells sometimes return Date/number at runtime even when typed as string. */
export function toSortComparableString(value: unknown): string {
  if (value == null) {
    return "";
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : value.toISOString();
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }
  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }
  return String(value);
}

function isEmptySortValue(value: string) {
  return EMPTY_SORT_VALUES.has(value.trim());
}

/** Calendar / timestamp instant for sorting, or null if the value is not a date. */
export function parseSortableDateValue(value: string): number | null {
  const trimmed = value.trim();
  if (isEmptySortValue(trimmed)) {
    return null;
  }

  const isoDate = trimmed.match(ISO_DATE_PREFIX);
  if (
    isoDate?.[1] &&
    (trimmed.length === 10 || trimmed[10] === "T" || trimmed[10] === " ")
  ) {
    const timestamp = Date.parse(
      trimmed.length === 10 ? `${isoDate[1]}T00:00:00` : trimmed,
    );
    return Number.isNaN(timestamp) ? null : timestamp;
  }

  if (MONTH_NAME.test(trimmed)) {
    const timestamp = Date.parse(trimmed);
    return Number.isNaN(timestamp) ? null : timestamp;
  }

  return null;
}

function parseLooseNumericSortValue(value: string): number | null {
  const cleaned = value.trim().replace(/[₹$€,\s%]/g, "");
  if (!cleaned || !/^-?\d+(\.\d+)?$/.test(cleaned)) {
    return null;
  }
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
}

export function compareDataGridSortValues(
  left: unknown,
  right: unknown,
): number {
  const leftText = toSortComparableString(left);
  const rightText = toSortComparableString(right);
  const leftEmpty = isEmptySortValue(leftText);
  const rightEmpty = isEmptySortValue(rightText);
  if (leftEmpty && rightEmpty) {
    return 0;
  }
  if (leftEmpty) {
    return 1;
  }
  if (rightEmpty) {
    return -1;
  }

  const leftDate = parseSortableDateValue(leftText);
  const rightDate = parseSortableDateValue(rightText);
  if (leftDate != null && rightDate != null) {
    return leftDate - rightDate;
  }

  const leftNumber = Number(leftText);
  const rightNumber = Number(rightText);
  if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
    return leftNumber - rightNumber;
  }

  const leftAmount = parseLooseNumericSortValue(leftText);
  const rightAmount = parseLooseNumericSortValue(rightText);
  if (leftAmount != null && rightAmount != null) {
    return leftAmount - rightAmount;
  }

  return leftText.localeCompare(rightText, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}
