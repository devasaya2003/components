"use client";

import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { applyDataGridView } from "./apply-data-grid-view";
import { DataGrid } from "./data-grid";
import { DataGridToolbar } from "./data-grid-toolbar";
import { exportDataGridCsv } from "./export-data-grid";
import { createSerialNumberColumn } from "./serial-number-column";
import type {
  DataGridColumn,
  DataGridColumnFilters,
  DataGridSort,
} from "./types";
import { useDataGridColumns } from "./use-data-grid-columns";
import { useDataGridFunnels } from "./use-data-grid-funnels";
import {
  type DataGridInitialBehavior,
  useDataGridInitialBehavior,
} from "./use-data-grid-initial-behavior";
import { readDataGridPersistedState } from "./use-data-grid-persistence";
import { useDataGridViewportHeight } from "./use-data-grid-viewport-height";
import {
  DATA_GRID_SEARCH_DEBOUNCE_MS,
  useDebouncedCallback,
} from "./use-debounced-callback";

export type DataGridViewProps<TData> = {
  tableId: string;
  columns: DataGridColumn<TData>[];
  rows: TData[];
  getRowId: (row: TData) => string;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
  searchPlaceholder?: string;
  exportFilename?: string;
  toolbarActions?: ReactNode;
  searchActions?: ReactNode;
  /**
   * Debounced (~250ms) search callback for API-backed lists.
   * When set, client-side search is skipped.
   */
  onSearch?: (search: string) => void;
  searchDebounceMs?: number;
  fillViewport?: boolean;
  className?: string;
  onScrollContainerRef?: (element: HTMLDivElement | null) => void;
  scrollEndRef?: React.Ref<HTMLDivElement>;
  serverSearch?: boolean;
  onServerSearchChange?: (search: string) => void;
  columnFilters?: DataGridColumnFilters;
  onColumnFiltersChange?: (filters: DataGridColumnFilters) => void;
  onServerFilterChange?: (filters: DataGridColumnFilters) => void;
  sort?: DataGridSort;
  onSortChange?: (sort: DataGridSort) => void;
  initialBehavior?: DataGridInitialBehavior;
  persist?: boolean;
  persistViewState?: boolean;
  rowHoverActions?: (row: TData) => ReactNode;
  virtualized?: boolean;
  compact?: boolean;
};

export function DataGridView<TData>({
  tableId,
  columns,
  rows,
  getRowId,
  isLoading = false,
  isFetchingNextPage = false,
  onRowClick,
  emptyMessage = "No results.",
  searchPlaceholder,
  exportFilename,
  toolbarActions,
  searchActions,
  onSearch,
  searchDebounceMs = DATA_GRID_SEARCH_DEBOUNCE_MS,
  fillViewport = false,
  className,
  onScrollContainerRef,
  scrollEndRef,
  serverSearch = false,
  onServerSearchChange,
  columnFilters,
  onColumnFiltersChange,
  onServerFilterChange,
  sort,
  onSortChange,
  initialBehavior,
  persist = true,
  persistViewState = false,
  rowHoverActions,
  virtualized = true,
  compact = false,
}: DataGridViewProps<TData>) {
  const storedView = persistViewState
    ? readDataGridPersistedState(tableId)?.view
    : undefined;
  const columnsWithSerial = [createSerialNumberColumn<TData>(), ...columns];
  const {
    search,
    setSearch,
    sort: internalSort,
    setSort: setInternalSort,
    columnFilters: internalFilters,
    setColumnFilters: setInternalFilters,
  } = useDataGridInitialBehavior({
    search: storedView?.search ?? initialBehavior?.search,
    sort: storedView?.sort ?? initialBehavior?.sort,
    filters: storedView?.filters ?? initialBehavior?.filters,
  });
  const searchHandler = onSearch ?? onServerSearchChange;
  const notifyServerSearch = useDebouncedCallback((nextSearch: string) => {
    searchHandler?.(nextSearch.trim());
  }, searchDebounceMs);
  const { sentinelRef, layout, estimatedHeight } =
    useDataGridViewportHeight(fillViewport);

  const activeFilters = columnFilters ?? internalFilters;
  const activeSort = sort !== undefined ? sort : internalSort;
  const skipClientSearch = serverSearch || Boolean(searchHandler);
  const skipClientSort = Boolean(onSortChange);
  const skipClientFilters =
    Boolean(onServerFilterChange) || Boolean(onColumnFiltersChange);

  const {
    columnOrder,
    columnWidths,
    moveColumn,
    orderedColumns,
    pinnedColumnIds,
    setColumnWidth,
    updatePinnedColumnIds,
    updateVisibleColumnIds,
    visibleColumnIds,
  } = useDataGridColumns({
    tableId,
    columns: columnsWithSerial,
    persist,
    viewState: persistViewState
      ? {
          search,
          sort: activeSort,
          filters: activeFilters,
        }
      : undefined,
  });

  function handleSearchChange(nextSearch: string) {
    setSearch(nextSearch);
    if (skipClientSearch) {
      notifyServerSearch(nextSearch);
    }
  }

  function handleSortChange(nextSort: DataGridSort) {
    if (onSortChange) {
      onSortChange(nextSort);
      return;
    }
    setInternalSort(nextSort);
  }

  function handleClearFilters() {
    if (onColumnFiltersChange) {
      onColumnFiltersChange({});
    } else {
      setInternalFilters({});
    }
    onServerFilterChange?.({});
  }

  const handleAllFiltersChange = (nextFilters: DataGridColumnFilters) => {
    if (onColumnFiltersChange) {
      onColumnFiltersChange(nextFilters);
    } else {
      setInternalFilters(nextFilters);
    }
    onServerFilterChange?.(nextFilters);
  };

  const visibleRows = applyDataGridView(
    rows,
    orderedColumns,
    { search, sort: activeSort, filters: activeFilters },
    {
      skipClientSearch,
      skipClientFilters,
      skipClientSort,
    },
  );

  const { columns: funneledColumns } = useDataGridFunnels({
    columns: orderedColumns,
    rows,
    columnFilters: activeFilters,
    onColumnFiltersChange: handleAllFiltersChange,
  });

  function handleExportCsv() {
    const visibleColumnIdSet = new Set(visibleColumnIds);
    exportDataGridCsv({
      filename: exportFilename ?? tableId,
      columns: orderedColumns.filter((column) =>
        visibleColumnIdSet.has(column.id),
      ),
      rows: visibleRows,
    });
  }

  const panelStyle = ((): CSSProperties | undefined => {
    if (!fillViewport) return undefined;

    if (layout) {
      return {
        position: "fixed",
        top: layout.top,
        left: layout.left,
        width: layout.width,
        height: layout.height,
        zIndex: 0,
      };
    }

    return {
      height: estimatedHeight,
      maxHeight: estimatedHeight,
    };
  })();

  return (
    <>
      {fillViewport ? (
        <div ref={sentinelRef} className="h-0 w-full shrink-0" aria-hidden />
      ) : null}

      {fillViewport && layout ? (
        <div
          className="w-full shrink-0"
          style={{ height: layout.height }}
          aria-hidden
        />
      ) : null}

      <div
        style={panelStyle}
        className={cn(
          "flex min-h-0 flex-col overflow-hidden bg-background",
          !fillViewport && "h-[32rem]",
          className,
        )}
      >
        <DataGridToolbar
          columns={columnsWithSerial}
          visibleColumnIds={visibleColumnIds}
          pinnedColumnIds={pinnedColumnIds}
          columnOrder={columnOrder}
          search={search}
          sort={activeSort}
          columnFilters={activeFilters}
          searchPlaceholder={searchPlaceholder}
          onSearchChange={handleSearchChange}
          onVisibleColumnIdsChange={updateVisibleColumnIds}
          onPinnedColumnIdsChange={updatePinnedColumnIds}
          onColumnMove={moveColumn}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
          onExportCsv={handleExportCsv}
          toolbarActions={toolbarActions}
          searchActions={searchActions}
        />

        <DataGrid
          tableId={tableId}
          columns={funneledColumns}
          rows={visibleRows}
          pinnedColumnIds={pinnedColumnIds}
          columnWidths={columnWidths}
          onColumnWidthChange={setColumnWidth}
          getRowId={getRowId}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          onRowClick={onRowClick}
          emptyMessage={emptyMessage}
          onScrollContainerRef={onScrollContainerRef}
          scrollEndRef={scrollEndRef}
          scrollVertically={fillViewport || virtualized}
          virtualized={virtualized}
          compact={compact}
          rowHoverActions={rowHoverActions}
        />
      </div>
    </>
  );
}
