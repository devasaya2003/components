"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getColumnLabelString } from "../../../column-label";
import type {
  DataGridColumn,
  DataGridColumnFilterOption,
} from "../../../types";
import { DATA_GRID_SEARCH_DEBOUNCE_MS } from "../../search/use-debounced-callback";
import {
  filterOptionsBySearch,
  resolveFilterOptions,
} from "../resolve-filter-options";
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

  const resolvedOptions = useMemo<DataGridColumnFilterOption[]>(
    () => resolveFilterOptions({ column, rows, asyncOptions }),
    [asyncOptions, column, rows],
  );

  const filteredOptions = useMemo(() => {
    if (column.getFilterOptions) {
      return resolvedOptions;
    }
    return filterOptionsBySearch(resolvedOptions, search);
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
