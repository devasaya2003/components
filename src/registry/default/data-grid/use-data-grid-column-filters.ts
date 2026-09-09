"use client";

import { useCallback, useMemo, useState } from "react";
import type { DataGridColumnFilters } from "./types";

function omitColumnFilter(
  filters: DataGridColumnFilters,
  columnId: string,
): DataGridColumnFilters {
  const next = { ...filters };
  delete next[columnId];
  return next;
}

export function useDataGridColumnFilters(
  initialFilters: DataGridColumnFilters = {},
) {
  const [columnFilters, setColumnFilters] =
    useState<DataGridColumnFilters>(initialFilters);

  const setColumnFilter = useCallback(
    (columnId: string, selectedValues: string[]) => {
      setColumnFilters((current) => {
        if (selectedValues.length === 0) {
          return omitColumnFilter(current, columnId);
        }
        return {
          ...current,
          [columnId]: selectedValues,
        };
      });
    },
    [],
  );

  const clearColumnFilter = useCallback((columnId: string) => {
    setColumnFilters((current) => omitColumnFilter(current, columnId));
  }, []);

  const clearAllFilters = useCallback(() => {
    setColumnFilters({});
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.keys(columnFilters).filter(
      (key) => (columnFilters[key]?.length ?? 0) > 0,
    ).length;
  }, [columnFilters]);

  const hasActiveFilters = activeFilterCount > 0;

  const toQueryParams = useCallback(() => {
    if (!hasActiveFilters) {
      return {};
    }
    return {
      filters: JSON.stringify(columnFilters),
    };
  }, [columnFilters, hasActiveFilters]);

  return {
    columnFilters,
    setColumnFilters,
    setColumnFilter,
    clearColumnFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
    toQueryParams,
  };
}

export function serializeColumnFilters(
  filters?: DataGridColumnFilters,
): Record<string, string | undefined> {
  if (!filters) {
    return {};
  }
  const activeEntries = Object.entries(filters).filter(
    ([_, values]) => values && values.length > 0,
  );
  if (activeEntries.length === 0) {
    return {};
  }
  const cleanFilters: DataGridColumnFilters = {};
  for (const [key, values] of activeEntries) {
    cleanFilters[key] = values;
  }
  return {
    filters: JSON.stringify(cleanFilters),
  };
}
