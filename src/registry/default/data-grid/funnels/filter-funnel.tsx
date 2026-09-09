"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { FilterIcon, Loader2Icon, SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDataGridDate } from "../format-date";
import {
  getColumnLabelString,
  type DataGridColumn,
  type DataGridColumnFilterOption,
  type DataGridColumnFilters,
  type DataGridFunnel,
} from "../types";
import { DATA_GRID_SEARCH_DEBOUNCE_MS } from "../use-debounced-callback";
import { FilterFunnelVirtualList } from "./filter-funnel-virtual-list";

type FilterFunnelContentProps<TData> = {
  column: DataGridColumn<TData>;
  rows: TData[];
  selectedValues: string[];
  onFilterChange: (selectedValues: string[]) => void;
  close: () => void;
  showSearch?: boolean;
};

export function FilterFunnelContent<TData>({
  column,
  rows,
  selectedValues = [],
  onFilterChange,
  close,
  showSearch = true,
}: FilterFunnelContentProps<TData>) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [draftSelected, setDraftSelected] = useState<string[]>(selectedValues);
  const [asyncOptions, setAsyncOptions] = useState<
    DataGridColumnFilterOption[] | null
  >(null);
  const [isLoadingAsync, setIsLoadingAsync] = useState(false);

  useEffect(() => {
    if (!column.getFilterOptions) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, DATA_GRID_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [column.getFilterOptions, search]);

  useEffect(() => {
    if (!column.getFilterOptions) {
      setAsyncOptions(null);
      return;
    }

    let isMounted = true;
    setIsLoadingAsync(true);

    Promise.resolve(column.getFilterOptions(debouncedSearch))
      .then((opts) => {
        if (isMounted) {
          setAsyncOptions(opts);
          setIsLoadingAsync(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAsyncOptions([]);
          setIsLoadingAsync(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [column, debouncedSearch]);

  const resolvedOptions = useMemo<DataGridColumnFilterOption[]>(() => {
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
      const isDate =
        column.valueType === "date" || column.cell?.type === "date";
      return {
        value: val,
        label: isDate ? formatDataGridDate(val) : val,
      };
    });
  }, [asyncOptions, column, rows]);

  const filteredOptions = useMemo(() => {
    if (column.getFilterOptions) {
      return resolvedOptions;
    }

    if (!search.trim()) {
      return resolvedOptions;
    }
    const queryTerm = search.trim().toLowerCase();
    return resolvedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(queryTerm) ||
        opt.value.toLowerCase().includes(queryTerm) ||
        (opt.detail && opt.detail.toLowerCase().includes(queryTerm)),
    );
  }, [column.getFilterOptions, resolvedOptions, search]);

  const activeCount = selectedValues.length;
  const isFiltered = activeCount > 0;

  const allFilteredSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((opt) => draftSelected.includes(opt.value));

  function toggleSelectAll() {
    if (allFilteredSelected) {
      const valuesToRemove = new Set(filteredOptions.map((opt) => opt.value));
      setDraftSelected((prev) => prev.filter((v) => !valuesToRemove.has(v)));
    } else {
      const newValues = new Set([
        ...draftSelected,
        ...filteredOptions.map((opt) => opt.value),
      ]);
      setDraftSelected(Array.from(newValues));
    }
  }

  function toggleOption(value: string) {
    setDraftSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  }

  function handleApply() {
    onFilterChange(draftSelected);
    close();
  }

  function handleClear() {
    setDraftSelected([]);
    onFilterChange([]);
    close();
  }

  const columnTitle = getColumnLabelString(column);

  return (
    <div className="flex flex-col gap-2">
      <div className="pb-1 text-xs font-semibold">Filter: {columnTitle}</div>

      {showSearch ? (
        <div className="relative my-1">
          <SearchIcon className="absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${columnTitle.toLowerCase()}...`}
            className="h-7 pr-7 pl-7 text-xs shadow-none"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <XIcon className="size-3" />
            </button>
          ) : null}
        </div>
      ) : null}

      {filteredOptions.length > 0 ? (
        <div className="flex items-center justify-between border-b px-1 py-1 text-[11px] text-muted-foreground">
          <button
            type="button"
            onClick={toggleSelectAll}
            className="font-medium text-primary hover:underline"
          >
            {allFilteredSelected ? "Deselect all" : "Select all"}
          </button>
          <span>{draftSelected.length} selected</span>
        </div>
      ) : null}

      <div className="max-h-48 min-h-20 overflow-y-auto py-1">
        {isLoadingAsync ? (
          <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground text-xs">
            <Loader2Icon className="size-3.5 animate-spin" />
            Loading options...
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground text-xs">
            No options available.
          </div>
        ) : (
          <FilterFunnelVirtualList
            options={filteredOptions}
            draftSelected={draftSelected}
            toggleOption={toggleOption}
          />
        )}
      </div>

      <div className="mt-1 flex items-center justify-between border-t pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={handleClear}
          disabled={draftSelected.length === 0 && !isFiltered}
        >
          Clear
        </Button>
        <div className="flex gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

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

export function createCustomFunnel<TData>(funnel: DataGridFunnel<TData>): DataGridFunnel<TData> {
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
