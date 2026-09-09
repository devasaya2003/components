"use client";

import { useState } from "react";
import type { DataGridColumnFilters, DataGridSort } from "../../types";
import { useDataGridColumnFilters } from "../filters/use-data-grid-column-filters";
import { useDataGridSort } from "../sort/use-data-grid-sort";

export type DataGridInitialBehavior = {
  filters?: DataGridColumnFilters;
  sort?: DataGridSort;
  search?: string;
};

export const DEFAULT_DATA_GRID_INITIAL_BEHAVIOR: DataGridInitialBehavior = {
  filters: {},
  sort: null,
  search: "",
};

export function useDataGridInitialBehavior(
  initialBehavior: DataGridInitialBehavior = DEFAULT_DATA_GRID_INITIAL_BEHAVIOR,
) {
  const [search, setSearch] = useState(initialBehavior.search ?? "");
  const sortState = useDataGridSort(initialBehavior.sort ?? null);
  const filterState = useDataGridColumnFilters(initialBehavior.filters ?? {});

  return {
    search,
    setSearch,
    sort: sortState.sort,
    setSort: sortState.setSort,
    columnFilters: filterState.columnFilters,
    setColumnFilters: filterState.setColumnFilters,
  };
}
