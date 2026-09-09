"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpDown,
  CheckIcon,
  Columns3Icon,
  DownloadIcon,
  PinIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { isUnsortableColumn } from "./serial-number-column";
import {
  getColumnLabelString,
  type DataGridColumn,
  type DataGridColumnFilters,
  type DataGridSort,
} from "./types";

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
  const visibleColumnIdSet = new Set(visibleColumnIds);
  const pinnedColumnIdSet = new Set(pinnedColumnIds);
  const visibleColumns = columns.filter((column) =>
    visibleColumnIdSet.has(column.id),
  );
  const activeFilterColumnCount = columnFilters
    ? Object.keys(columnFilters).filter(
        (key) => (columnFilters[key]?.length ?? 0) > 0,
      ).length
    : 0;

  return (
    <div className="grid shrink-0 gap-3 border-b bg-background px-3 py-3 sm:px-4">
      <div className="flex min-w-0 flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
            <SearchIcon className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.currentTarget.value)}
              placeholder={searchPlaceholder}
              className="h-8 pl-8"
            />
          </div>
          {searchActions}
        </div>

        <div className="-mx-1 flex min-w-0 items-center gap-2 overflow-x-auto px-1 pb-1 xl:mx-0 xl:pb-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <Columns3Icon className="h-3.5 w-3.5" />
                Fields
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="grid gap-1">
                {columns.map((column) => {
                  const checked = visibleColumnIdSet.has(column.id);
                  const pinned = pinnedColumnIdSet.has(column.id);
                  const orderIndex = columnOrder.indexOf(column.id);

                  return (
                    <div
                      key={column.id}
                      className="flex items-center gap-1 rounded-md px-1.5 py-1 text-sm hover:bg-accent"
                    >
                      <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            onVisibleColumnIdsChange(
                              event.currentTarget.checked
                                ? [...visibleColumnIds, column.id]
                                : visibleColumnIds.filter(
                                    (id) => id !== column.id,
                                  ),
                            );
                          }}
                          className="h-3.5 w-3.5"
                        />
                        <span className="truncate">{column.label}</span>
                      </label>
                      <button
                        type="button"
                        className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-40"
                        disabled={orderIndex <= 0}
                        onClick={() => onColumnMove(column.id, "left")}
                        aria-label={`Move ${getColumnLabelString(column)} left`}
                      >
                        <ArrowLeftIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-40"
                        disabled={
                          orderIndex === -1 ||
                          orderIndex >= columnOrder.length - 1
                        }
                        onClick={() => onColumnMove(column.id, "right")}
                        aria-label={`Move ${getColumnLabelString(column)} right`}
                      >
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className={cn(
                          "rounded p-1 hover:bg-background",
                          pinned
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        onClick={() => {
                          onPinnedColumnIdsChange(
                            pinned
                              ? pinnedColumnIds.filter((id) => id !== column.id)
                              : [...pinnedColumnIds, column.id],
                          );
                        }}
                        aria-label={`${pinned ? "Unpin" : "Pin"} ${getColumnLabelString(column)}`}
                      >
                        <PinIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <PinIcon className="h-3.5 w-3.5" />
                Pin
                {pinnedColumnIds.length > 0 ? (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                    {pinnedColumnIds.length}
                  </span>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <div className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
                Pin visible columns to the left
              </div>
              <DropdownMenuSeparator />
              {visibleColumns.length === 0 ? (
                <div className="px-2 py-2 text-muted-foreground text-sm">
                  Show a field before pinning it.
                </div>
              ) : (
                visibleColumns.map((column) => {
                  const pinned = pinnedColumnIdSet.has(column.id);

                  return (
                    <DropdownMenuItem
                      key={column.id}
                      onClick={() =>
                        onPinnedColumnIdsChange(
                          pinned
                            ? pinnedColumnIds.filter((id) => id !== column.id)
                            : [...pinnedColumnIds, column.id],
                        )
                      }
                    >
                      {pinned ? <CheckIcon /> : <PinIcon />}
                      <span className="min-w-0 flex-1 truncate">
                        {column.label}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {pinned ? "Pinned" : "Pin"}
                      </span>
                    </DropdownMenuItem>
                  );
                })
              )}
              {pinnedColumnIds.length > 0 ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onPinnedColumnIdsChange([])}>
                    Clear pinned columns
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant={sort ? "secondary" : "outline"}
                size="sm"
                className="shrink-0"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {sort
                  ? `Sort · ${getColumnLabelString(
                      columns.find((column) => column.id === sort.columnId) ?? {
                        id: sort.columnId,
                        label: sort.columnId,
                      },
                    )}`
                  : "Sort"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className={sort === null ? "bg-accent" : undefined}
                data-checked={sort === null ? "" : undefined}
                onClick={() => onSortChange(null)}
              >
                {sort === null ? <CheckIcon /> : null}
                No sort
              </DropdownMenuItem>
              {columns
                .filter((column) => !isUnsortableColumn(column.id))
                .map((column) => {
                  const isActive = sort?.columnId === column.id;
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      className={isActive ? "bg-accent" : undefined}
                      data-checked={isActive ? "" : undefined}
                      onClick={() =>
                        onSortChange({
                          columnId: column.id,
                          direction:
                            isActive && sort?.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      {isActive ? <CheckIcon /> : null}
                      {column.label}
                      {isActive ? ` (${sort?.direction})` : ""}
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

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

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={exportDisabled || isExporting}
            className="shrink-0"
            onClick={onExportCsv}
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>

          {toolbarActions}
        </div>
      </div>
    </div>
  );
}
