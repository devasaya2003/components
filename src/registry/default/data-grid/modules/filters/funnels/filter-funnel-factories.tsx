"use client";

import type { ReactNode } from "react";
import { FilterIcon } from "lucide-react";
import type {
  DataGridColumnFilterOption,
  DataGridColumnFilters,
  DataGridFunnel,
} from "../../../types";
import { FilterFunnelContent } from "./filter-funnel";

export function createFilterFunnel<TData>(options: {
  rows: TData[];
  selectedValues: string[];
  allActiveFilters?: DataGridColumnFilters;
  onFilterChange: (selectedValues: string[]) => void;
}): DataGridFunnel<TData> {
  const isFiltered = options.selectedValues.length > 0;

  return {
    id: "filter",
    label: "Filter",
    isActive: isFiltered,
    icon: <FilterIcon className="size-3" />,
    renderWorkflow: ({ column, close }) => (
      <FilterFunnelContent
        key={options.selectedValues.join("\0")}
        column={column}
        rows={options.rows}
        selectedValues={options.selectedValues}
        onFilterChange={options.onFilterChange}
        close={close}
      />
    ),
  };
}

export function createSearchFilterFunnel<TData>(options: {
  rows: TData[];
  selectedValues: string[];
  onFilterChange: (selectedValues: string[]) => void;
}): DataGridFunnel<TData> {
  return {
    ...createFilterFunnel(options),
    id: "filter-search",
    label: "Search filter",
  };
}

export function createCustomFunnel<TData>(
  funnel: DataGridFunnel<TData>,
): DataGridFunnel<TData> {
  return funnel;
}

export function createCustomListFilterFunnel<TData>(options: {
  selectedValues: string[];
  onFilterChange: (selectedValues: string[]) => void;
  optionsList: DataGridColumnFilterOption[];
}): DataGridFunnel<TData> {
  return {
    id: "filter-list",
    label: "Filter",
    isActive: options.selectedValues.length > 0,
    icon: <FilterIcon className="size-3" />,
    renderWorkflow: ({ column, close }) => (
      <FilterFunnelContent
        key={options.selectedValues.join("\0")}
        column={{
          ...column,
          filterOptions: options.optionsList,
          getFilterOptions: undefined,
        }}
        rows={[]}
        selectedValues={options.selectedValues}
        onFilterChange={options.onFilterChange}
        close={close}
        showSearch={false}
      />
    ),
  };
}

export function renderCustomFunnelPanel(content: ReactNode) {
  return content;
}
