"use client";

import { useMemo } from "react";
import { createFilterFunnel } from "./funnels/filter-funnel";
import { isSerialNumberColumn } from "./serial-number-column";
import type { DataGridColumn, DataGridColumnFilters } from "./types";

export type UseDataGridFunnelsOptions<TData> = {
  columns: DataGridColumn<TData>[];
  rows: TData[];
  columnFilters: DataGridColumnFilters;
  onColumnFiltersChange: (filters: DataGridColumnFilters) => void;
};

export function useDataGridFunnels<TData>({
  columns,
  rows,
  columnFilters = {},
  onColumnFiltersChange,
}: UseDataGridFunnelsOptions<TData>) {
  const funneledColumns = useMemo(() => {
    return columns.map((column) => {
      const existingFunnels = column.funnels ?? [];

      const isFilterable =
        column.filterable !== false && !isSerialNumberColumn(column.id);

      const filterFunnelExists = existingFunnels.some(
        (funnel) => funnel.id === "filter" || funnel.id.startsWith("filter"),
      );

      const funnels = [...existingFunnels];

      if (isFilterable && !filterFunnelExists) {
        const filterValues = columnFilters[column.id] ?? [];
        const filterFunnel = createFilterFunnel<TData>({
          rows,
          selectedValues: filterValues,
          allActiveFilters: columnFilters,
          onFilterChange: (nextValues) => {
            const nextFilters = { ...columnFilters };
            if (nextValues.length === 0) {
              delete nextFilters[column.id];
            } else {
              nextFilters[column.id] = nextValues;
            }
            onColumnFiltersChange(nextFilters);
          },
        });
        funnels.push(filterFunnel);
      }

      return {
        ...column,
        funnels,
      };
    });
  }, [columns, rows, columnFilters, onColumnFiltersChange]);

  return {
    columns: funneledColumns,
  };
}
