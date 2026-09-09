import type { DataGridColumnFilters, DataGridSort } from "./types";

export type DataGridColumnLayoutState = {
  visibleColumnIds: string[];
  columnOrder: string[];
  pinnedColumnIds: string[];
  columnWidths: Record<string, number>;
};

export type DataGridPersistedState = {
  layout: DataGridColumnLayoutState;
  view?: {
    search: string;
    sort: DataGridSort;
    filters: DataGridColumnFilters;
  };
};

export const EMPTY_DATA_GRID_LAYOUT: DataGridColumnLayoutState = {
  visibleColumnIds: [],
  columnOrder: [],
  pinnedColumnIds: [],
  columnWidths: {},
};

export function dataGridStorageKey(tableId: string) {
  return `data-grid:${tableId}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function parseWidths(value: unknown): Record<string, number> {
  if (!isRecord(value)) {
    return {};
  }
  const widths: Record<string, number> = {};
  for (const [key, width] of Object.entries(value)) {
    if (typeof width === "number" && Number.isFinite(width)) {
      widths[key] = width;
    }
  }
  return widths;
}

function parseSort(value: unknown): DataGridSort {
  if (value === null) {
    return null;
  }
  if (
    isRecord(value) &&
    typeof value.columnId === "string" &&
    (value.direction === "asc" || value.direction === "desc")
  ) {
    return {
      columnId: value.columnId,
      direction: value.direction,
    };
  }
  return null;
}

function parseFilters(value: unknown): DataGridColumnFilters {
  if (!isRecord(value)) {
    return {};
  }
  const filters: DataGridColumnFilters = {};
  for (const [key, values] of Object.entries(value)) {
    const next = parseStringArray(values);
    if (next.length > 0) {
      filters[key] = next;
    }
  }
  return filters;
}

export function readDataGridPersistedState(
  tableId: string,
): DataGridPersistedState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(dataGridStorageKey(tableId));
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return null;
    }

    const layoutSource = isRecord(parsed.layout) ? parsed.layout : parsed;

    return {
      layout: {
        visibleColumnIds: parseStringArray(layoutSource.visibleColumnIds),
        columnOrder: parseStringArray(layoutSource.columnOrder),
        pinnedColumnIds: parseStringArray(layoutSource.pinnedColumnIds),
        columnWidths: parseWidths(layoutSource.columnWidths),
      },
      view: isRecord(parsed.view)
        ? {
            search:
              typeof parsed.view.search === "string" ? parsed.view.search : "",
            sort: parseSort(parsed.view.sort),
            filters: parseFilters(parsed.view.filters),
          }
        : undefined,
    };
  } catch {
    return null;
  }
}

export function writeDataGridPersistedState(
  tableId: string,
  state: DataGridPersistedState,
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      dataGridStorageKey(tableId),
      JSON.stringify(state),
    );
  } catch {
    // Ignore quota / private-mode failures.
  }
}
