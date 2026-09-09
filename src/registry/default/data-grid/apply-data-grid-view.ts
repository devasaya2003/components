import { compareDataGridSortValues } from "./modules/sort/compare-data-grid-sort-values";
import { getDataGridColumnDisplayValue } from "./modules/cells/get-data-grid-cell-value";
import { isSerialNumberColumn } from "./modules/cells/serial-number-column";
import type { DataGridColumn, DataGridViewState } from "./types";

/** Sort (and optional client search/column filters) apply only to rows already loaded in memory. */
export function applyDataGridView<TData>(
  rows: TData[],
  columns: DataGridColumn<TData>[],
  viewState: DataGridViewState,
  options?: {
    skipClientSearch?: boolean;
    skipClientFilters?: boolean;
    skipClientSort?: boolean;
  },
) {
  const searchTerm = viewState.search.trim().toLowerCase();
  let result = rows;

  if (searchTerm && !options?.skipClientSearch) {
    result = result.filter((row) =>
      columns.some((column) => {
        if (isSerialNumberColumn(column.id)) {
          return false;
        }

        return getDataGridColumnDisplayValue(column, row)
          .toLowerCase()
          .includes(searchTerm);
      }),
    );
  }

  if (viewState.filters && !options?.skipClientFilters) {
    const activeFilterEntries = Object.entries(viewState.filters).filter(
      ([_, values]) => values && values.length > 0,
    );

    if (activeFilterEntries.length > 0) {
      result = result.filter((row) =>
        activeFilterEntries.every(([columnId, allowedValues]) => {
          const targetColumn = columns.find((col) => col.id === columnId);
          if (!targetColumn) {
            return true;
          }
          const cellValue = targetColumn.getValue(row);
          return allowedValues.includes(cellValue);
        }),
      );
    }
  }

  if (viewState.sort) {
    const sortColumn = columns.find(
      (column) => column.id === viewState.sort?.columnId,
    );
    const skipClientSort =
      Boolean(options?.skipClientSort) && !sortColumn?.getSortValue;

    if (sortColumn && !skipClientSort) {
      const direction = viewState.sort.direction === "asc" ? 1 : -1;

      if (isSerialNumberColumn(sortColumn.id)) {
        const indexByRow = new Map(result.map((row, index) => [row, index]));
        result = [...result].sort(
          (left, right) =>
            ((indexByRow.get(left) ?? 0) - (indexByRow.get(right) ?? 0)) *
            direction,
        );
      } else {
        result = [...result].sort((left, right) => {
          const leftValue =
            sortColumn.getSortValue?.(left) ?? sortColumn.getValue(left);
          const rightValue =
            sortColumn.getSortValue?.(right) ?? sortColumn.getValue(right);
          return compareDataGridSortValues(leftValue, rightValue) * direction;
        });
      }
    }
  }

  return result;
}
