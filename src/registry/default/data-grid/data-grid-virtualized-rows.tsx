"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

type DataGridVirtualizedRowsProps<TData> = {
  rows: TData[];
  getRowId: (row: TData) => string;
  scrollElement: HTMLDivElement | null;
  gridTemplateColumns: string;
  displayTotalWidth: number;
  estimatedRowHeight: number;
  compact: boolean;
  scrollEndRef?: Ref<HTMLDivElement>;
  renderRowCells: (row: TData, rowIndex: number) => ReactNode;
  renderRowOverlay?: (row: TData) => ReactNode;
};

export function DataGridVirtualizedRows<TData>({
  rows,
  getRowId,
  scrollElement,
  gridTemplateColumns,
  displayTotalWidth,
  estimatedRowHeight,
  compact,
  scrollEndRef,
  renderRowCells,
  renderRowOverlay,
}: DataGridVirtualizedRowsProps<TData>) {
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => estimatedRowHeight,
    overscan: 12,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div
      className="relative"
      style={{
        height: rowVirtualizer.getTotalSize() + (scrollEndRef ? 16 : 0),
        width: displayTotalWidth,
      }}
    >
      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index];

        if (!row) {
          return null;
        }

        return (
          <div
            key={getRowId(row)}
            data-index={virtualRow.index}
            className={cn(
              "group isolate absolute top-0 left-0 grid border-b border-border text-left font-normal text-[13px] transition-colors hover:bg-muted/40",
              compact ? "min-h-8" : "min-h-10",
            )}
            style={{
              gridTemplateColumns,
              height: `${estimatedRowHeight}px`,
              transform: `translateY(${virtualRow.start}px)`,
              width: displayTotalWidth,
            }}
          >
            {renderRowCells(row, virtualRow.index)}
            {renderRowOverlay?.(row)}
          </div>
        );
      })}
      {scrollEndRef ? (
        <div
          ref={scrollEndRef}
          className="absolute left-0 h-4 w-full bg-transparent"
          style={{ top: rowVirtualizer.getTotalSize() }}
          aria-hidden
        />
      ) : null}
    </div>
  );
}
