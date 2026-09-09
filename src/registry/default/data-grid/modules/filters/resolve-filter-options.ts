import { formatDataGridDate } from "../cells/format-date";
import type {
  DataGridColumn,
  DataGridColumnFilterOption,
} from "../../types";

export function resolveFilterOptions<TData>(input: {
  column: DataGridColumn<TData>;
  rows: TData[];
  asyncOptions: DataGridColumnFilterOption[] | null;
}): DataGridColumnFilterOption[] {
  const { column, rows, asyncOptions } = input;

  if (column.getFilterOptions) {
    return asyncOptions ?? [];
  }

  if (column.filterOptions) {
    if (typeof column.filterOptions === "function") {
      return column.filterOptions(rows);
    }
    return column.filterOptions;
  }

  const uniqueValuesMap = new Map<string, string>();
  for (const row of rows) {
    const value = column.getValue(row);
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      const valueStr = String(value);
      if (!uniqueValuesMap.has(valueStr)) {
        uniqueValuesMap.set(valueStr, valueStr);
      }
    }
  }

  const sortedValues = Array.from(uniqueValuesMap.keys()).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  );

  return sortedValues.map((val) => {
    const isDate = column.valueType === "date" || column.cell?.type === "date";
    return {
      value: val,
      label: isDate ? formatDataGridDate(val) : val,
    };
  });
}

export function filterOptionsBySearch(
  options: DataGridColumnFilterOption[],
  search: string,
): DataGridColumnFilterOption[] {
  if (!search.trim()) {
    return options;
  }
  const queryTerm = search.trim().toLowerCase();
  return options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(queryTerm) ||
      opt.value.toLowerCase().includes(queryTerm) ||
      (opt.detail && opt.detail.toLowerCase().includes(queryTerm)),
  );
}
