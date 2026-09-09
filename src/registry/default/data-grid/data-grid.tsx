"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DataGridVirtualizedRows } from "./data-grid-virtualized-rows";
import { DataGridFunnelTrigger } from "./data-grid-funnel-trigger";
import { renderDataGridCell } from "./render-data-grid-cell";
import {
  DEFAULT_COLUMN_WIDTH,
  MIN_COLUMN_WIDTH,
  type DataGridColumn,
} from "./types";

const SKELETON_ROWS = [
  "skeleton-1",
  "skeleton-2",
  "skeleton-3",
  "skeleton-4",
  "skeleton-5",
  "skeleton-6",
  "skeleton-7",
  "skeleton-8",
  "skeleton-9",
  "skeleton-10",
];

type ResizeDraft = {
  columnId: string;
  startX: number;
  startWidth: number;
  width: number;
};

export type DataGridProps<TData> = {
  tableId?: string;
  columns: DataGridColumn<TData>[];
  rows: TData[];
  pinnedColumnIds: string[];
  getRowId: (row: TData) => string;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
  className?: string;
  onScrollContainerRef?: (element: HTMLDivElement | null) => void;
  scrollEndRef?: React.Ref<HTMLDivElement>;
  scrollVertically?: boolean;
  virtualized?: boolean;
  compact?: boolean;
  columnWidths?: Record<string, number>;
  onColumnWidthChange?: (columnId: string, width: number) => void;
  rowHoverActions?: (row: TData) => ReactNode;
};

function clampColumnWidth(width: number) {
  return Math.max(MIN_COLUMN_WIDTH, Math.round(width));
}

export function DataGrid<TData>({
  tableId: _tableId,
  columns,
  rows,
  pinnedColumnIds,
  getRowId,
  isLoading = false,
  isFetchingNextPage = false,
  onRowClick,
  emptyMessage = "No results.",
  className,
  onScrollContainerRef,
  scrollEndRef,
  scrollVertically = true,
  virtualized = true,
  compact = false,
  columnWidths: controlledColumnWidths,
  onColumnWidthChange,
  rowHoverActions,
}: DataGridProps<TData>) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [containerWidth, setContainerWidth] = useState(0);
  const [uncontrolledWidths, setUncontrolledWidths] = useState<
    Record<string, number>
  >({});
  const [resizeDraft, setResizeDraft] = useState<ResizeDraft | null>(null);
  const resizeDraftRef = useRef<ResizeDraft | null>(null);

  const isControlled = controlledColumnWidths !== undefined;
  const storedWidths = isControlled
    ? controlledColumnWidths
    : uncontrolledWidths;

  const estimatedRowHeight = compact ? 32 : 40;
  const headerCellClassName = compact
    ? "relative border-r bg-background px-0 py-0 font-normal text-[11px] text-muted-foreground last:border-r-0"
    : "relative border-r bg-background px-3 py-2 font-normal text-[11px] text-muted-foreground last:border-r-0";
  const bodyCellClassName = compact
    ? "relative z-0 flex min-h-8 min-w-0 items-center border-r bg-background px-0 py-0 last:border-r-0"
    : cn(
        "relative z-0 flex min-h-10 min-w-0 border-r bg-background px-3 py-2 last:border-r-0",
        virtualized ? "items-center" : "items-start",
      );

  function getBaseWidth(column: DataGridColumn<TData>) {
    const stored = storedWidths[column.id];
    if (typeof stored === "number" && Number.isFinite(stored)) {
      return clampColumnWidth(stored);
    }
    return clampColumnWidth(column.width ?? DEFAULT_COLUMN_WIDTH);
  }

  const displayWidths = columns.map((column) => {
    if (resizeDraft?.columnId === column.id) {
      return clampColumnWidth(resizeDraft.width);
    }
    return getBaseWidth(column);
  });

  const totalColumnWidth = displayWidths.reduce(
    (total, width) => total + width,
    0,
  );

  const displayTotalWidth = Math.max(containerWidth, totalColumnWidth);

  useEffect(() => {
    const element = scrollElement ?? parentRef.current;
    if (!element) {
      return;
    }

    const updateWidth = () => {
      setContainerWidth(element.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [scrollElement]);

  const isColumnResizing = resizeDraft !== null;

  useEffect(() => {
    if (!isColumnResizing) {
      return;
    }

    document.body.classList.add("data-grid-column-resizing");

    return () => {
      document.body.classList.remove("data-grid-column-resizing");
    };
  }, [isColumnResizing]);

  const pinnedColumnIdSet = new Set(pinnedColumnIds);
  const pinnedOffsets = (() => {
    const offsets = new Map<string, number>();
    let left = 0;

    for (const [index, column] of columns.entries()) {
      if (!pinnedColumnIdSet.has(column.id)) {
        continue;
      }

      offsets.set(column.id, left);
      left += displayWidths[index] ?? DEFAULT_COLUMN_WIDTH;
    }

    return offsets;
  })();

  const gridTemplateColumns = displayWidths
    .map((width) => `${width}px`)
    .join(" ");

  function commitWidth(columnId: string, width: number) {
    const nextWidth = clampColumnWidth(width);
    if (onColumnWidthChange) {
      onColumnWidthChange(columnId, nextWidth);
      return;
    }
    if (!isControlled) {
      setUncontrolledWidths((current) => ({
        ...current,
        [columnId]: nextWidth,
      }));
    }
  }

  function endResize(event: PointerEvent) {
    const draft = resizeDraftRef.current;
    if (!draft) {
      return;
    }

    const target = event.target as Element | null;
    if (target && "releasePointerCapture" in target) {
      try {
        (target as Element).releasePointerCapture(event.pointerId);
      } catch {
        // Pointer may already be released.
      }
    }

    commitWidth(draft.columnId, draft.width);
    resizeDraftRef.current = null;
    setResizeDraft(null);
  }

  function handleResizePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
    column: DataGridColumn<TData>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    const startWidth = getBaseWidth(column);
    const draft: ResizeDraft = {
      columnId: column.id,
      startX: event.clientX,
      startWidth,
      width: startWidth,
    };
    resizeDraftRef.current = draft;
    setResizeDraft(draft);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleResizePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const draft = resizeDraftRef.current;
    if (!draft) {
      return;
    }

    const nextWidth = clampColumnWidth(
      draft.startWidth + (event.clientX - draft.startX),
    );
    const nextDraft = { ...draft, width: nextWidth };
    resizeDraftRef.current = nextDraft;
    setResizeDraft(nextDraft);
  }

  function handleResizePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    endResize(event.nativeEvent);
  }

  const renderRowOverlay = rowHoverActions
    ? (row: TData) => (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-40 flex items-center pr-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
          <div
            className="pointer-events-auto flex items-center gap-1 rounded-md border bg-background/95 p-1 shadow-sm"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            {rowHoverActions(row)}
          </div>
        </div>
      )
    : undefined;

  const renderRowCells = (row: TData, rowIndex: number) =>
    columns.map((column) => {
      const content = renderDataGridCell(column, row, rowIndex);

      const cellClassName = cn(
        bodyCellClassName,
        !compact && "min-h-10",
        pinnedOffsets.has(column.id) &&
          "sticky z-30 bg-background shadow-[1px_0_0_var(--border)]",
      );

      if (column.interactive || !onRowClick) {
        return (
          <div
            key={column.id}
            className={cn(
              cellClassName,
              onRowClick && !column.interactive && "group-hover:bg-muted/40",
              pinnedOffsets.has(column.id) &&
                onRowClick &&
                "group-hover:bg-muted",
            )}
            style={getPinnedStyle(column.id, pinnedOffsets)}
          >
            {content}
          </div>
        );
      }

      return (
        <button
          key={column.id}
          type="button"
          className={cn(
            cellClassName,
            "text-left group-hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            pinnedOffsets.has(column.id) && "group-hover:bg-muted",
          )}
          style={getPinnedStyle(column.id, pinnedOffsets)}
          onClick={() => onRowClick(row)}
        >
          {content}
        </button>
      );
    });

  const onScrollContainerRefRef = useRef(onScrollContainerRef);
  onScrollContainerRefRef.current = onScrollContainerRef;

  const setScrollContainerRef = useCallback((element: HTMLDivElement | null) => {
    parentRef.current = element;
    setScrollElement(element);
    onScrollContainerRefRef.current?.(element);
  }, []);

  if (columns.length === 0 && !isLoading) {
    return (
      <div
        className={cn(
          "grid min-h-80 place-items-center text-center text-muted-foreground text-sm",
          className,
        )}
      >
        No columns are visible. Open Fields to show at least one column.
      </div>
    );
  }

  return (
    <div
      className={cn(
        virtualized
          ? "flex min-h-0 flex-1 flex-col overflow-hidden"
          : "flex flex-col",
        className,
      )}
    >
      <div
        ref={setScrollContainerRef}
        className={cn(
          virtualized ? "min-h-0 flex-1" : "w-full",
          scrollVertically
            ? "overflow-auto"
            : "overflow-x-auto overflow-y-visible",
        )}
      >
        <div
          className={cn(
            "isolate flex flex-col",
            totalColumnWidth > containerWidth && "min-w-max",
          )}
          style={{ width: displayTotalWidth }}
        >
          <div
            className="sticky top-0 z-50 grid border-b bg-background shadow-[0_1px_0_var(--border)]"
            style={{ gridTemplateColumns, width: displayTotalWidth }}
          >
            {columns.map((column) => {
              return (
                <div
                  key={column.id}
                  className={cn(
                    headerCellClassName,
                    pinnedOffsets.has(column.id) &&
                      "sticky z-[60] shadow-[1px_0_0_var(--border)]",
                  )}
                  style={getPinnedStyle(column.id, pinnedOffsets)}
                >
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <span className="line-clamp-1">{column.label}</span>
                    {column.funnels && column.funnels.length > 0 ? (
                      <div className="flex items-center gap-0.5">
                        {column.funnels.map((funnel) => (
                          <DataGridFunnelTrigger
                            key={funnel.id}
                            column={column}
                            funnel={funnel}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div
                    aria-hidden
                    className="absolute top-0 right-0 z-[70] h-full w-1 cursor-col-resize touch-none select-none hover:bg-primary/30"
                    onPointerDown={(event) =>
                      handleResizePointerDown(event, column)
                    }
                    onPointerMove={handleResizePointerMove}
                    onPointerUp={handleResizePointerUp}
                    onPointerCancel={handleResizePointerUp}
                  />
                </div>
              );
            })}
          </div>

          {isLoading ? (
            <div className="grid gap-2 p-4">
              {SKELETON_ROWS.map((id) => (
                <Skeleton key={id} className="h-10 w-full" />
              ))}
              {scrollEndRef ? (
                <div
                  ref={scrollEndRef}
                  className="h-4 w-full bg-transparent"
                  aria-hidden
                />
              ) : null}
            </div>
          ) : rows.length === 0 ? (
            <div className="grid min-h-80 place-items-center text-center text-muted-foreground text-sm">
              {emptyMessage}
            </div>
          ) : virtualized ? (
            <DataGridVirtualizedRows
              rows={rows}
              getRowId={getRowId}
              scrollElement={scrollElement}
              gridTemplateColumns={gridTemplateColumns}
              displayTotalWidth={displayTotalWidth}
              estimatedRowHeight={estimatedRowHeight}
              compact={compact}
              scrollEndRef={scrollEndRef}
              renderRowCells={renderRowCells}
              renderRowOverlay={renderRowOverlay}
            />
          ) : (
            <div className="relative" style={{ width: displayTotalWidth }}>
              {rows.map((row, rowIndex) => (
                <div
                  key={getRowId(row)}
                  className={cn(
                    "group isolate grid border-b border-border text-left font-normal text-[13px] transition-colors hover:bg-muted/40",
                    compact ? "min-h-8" : "min-h-10",
                  )}
                  style={{
                    gridTemplateColumns,
                    width: displayTotalWidth,
                  }}
                >
                  {renderRowCells(row, rowIndex)}
                  {renderRowOverlay?.(row)}
                </div>
              ))}
              {scrollEndRef ? (
                <div
                  ref={scrollEndRef}
                  className="h-4 w-full bg-transparent"
                  aria-hidden
                />
              ) : null}
            </div>
          )}
        </div>
      </div>

      {isFetchingNextPage ? (
        <div className="border-t px-4 py-2 text-muted-foreground text-xs">
          Loading more...
        </div>
      ) : null}
    </div>
  );
}

function getPinnedStyle(
  columnId: string,
  pinnedOffsets: Map<string, number>,
): CSSProperties | undefined {
  const left = pinnedOffsets.get(columnId);

  if (left === undefined) {
    return undefined;
  }

  return { left };
}
