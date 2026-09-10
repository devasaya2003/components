"use client";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  DataGridColumn,
  DataGridColumnFilters,
  DataGridSort,
} from "../../types";
import { ToolbarExportButton } from "./toolbar-export-button";
import { ToolbarFieldsMenu } from "./toolbar-fields-menu";
import { ToolbarPinMenu } from "./toolbar-pin-menu";
import { ToolbarSearch } from "./toolbar-search";
import { ToolbarSortMenu } from "./toolbar-sort-menu";

type DataGridToolbarProps<TData> = {
  columns: DataGridColumn<TData>[];
  visibleColumnIds: string[];
  pinnedColumnIds: string[];
  columnOrder: string[];
  search: string;
  sort: DataGridSort;
  columnFilters?: DataGridColumnFilters;
  searchPlaceholder?: string;
  exportDisabled?: boolean;
  isExporting?: boolean;
  onSearchChange: (search: string) => void;
  onVisibleColumnIdsChange: (columnIds: string[]) => void;
  onPinnedColumnIdsChange: (columnIds: string[]) => void;
  onColumnMove: (columnId: string, direction: "left" | "right") => void;
  onSortChange: (sort: DataGridSort) => void;
  onClearFilters?: () => void;
  onExportCsv: () => void;
  toolbarActions?: React.ReactNode;
  searchActions?: React.ReactNode;
};

export function DataGridToolbar<TData>({
  columns,
  visibleColumnIds,
  pinnedColumnIds,
  columnOrder,
  search,
  sort,
  columnFilters,
  searchPlaceholder = "Search...",
  exportDisabled = false,
  isExporting = false,
  onSearchChange,
  onVisibleColumnIdsChange,
  onPinnedColumnIdsChange,
  onColumnMove,
  onSortChange,
  onClearFilters,
  onExportCsv,
  toolbarActions,
  searchActions,
}: DataGridToolbarProps<TData>) {
  const activeFilterColumnCount = columnFilters
    ? Object.keys(columnFilters).filter(
        (key) => (columnFilters[key]?.length ?? 0) > 0,
      ).length
    : 0;

  return (
    <div className="grid shrink-0 gap-3 border-b bg-background px-3 py-3 sm:px-4">
      <div className="flex min-w-0 flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <ToolbarSearch
          search={search}
          searchPlaceholder={searchPlaceholder}
          searchActions={searchActions}
          onSearchChange={onSearchChange}
        />

        <div className="-mx-1 flex min-w-0 items-center gap-2 overflow-x-auto px-1 pb-1 xl:mx-0 xl:pb-0">
          <ToolbarFieldsMenu
            columns={columns}
            visibleColumnIds={visibleColumnIds}
            pinnedColumnIds={pinnedColumnIds}
            columnOrder={columnOrder}
            onVisibleColumnIdsChange={onVisibleColumnIdsChange}
            onPinnedColumnIdsChange={onPinnedColumnIdsChange}
            onColumnMove={onColumnMove}
          />
          <ToolbarPinMenu
            columns={columns}
            visibleColumnIds={visibleColumnIds}
            pinnedColumnIds={pinnedColumnIds}
            onPinnedColumnIdsChange={onPinnedColumnIdsChange}
          />
          <ToolbarSortMenu
            columns={columns}
            sort={sort}
            onSortChange={onSortChange}
          />

          {activeFilterColumnCount > 0 && onClearFilters ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              onClick={onClearFilters}
            >
              <XIcon className="h-3.5 w-3.5" />
              Clear filters ({activeFilterColumnCount})
            </Button>
          ) : null}

          <ToolbarExportButton
            exportDisabled={exportDisabled}
            isExporting={isExporting}
            onExportCsv={onExportCsv}
          />

          {toolbarActions}
        </div>
      </div>
    </div>
  );
}
