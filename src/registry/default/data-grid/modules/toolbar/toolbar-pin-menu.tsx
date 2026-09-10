"use client";

import { CheckIcon, PinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataGridColumn } from "../../types";

export function ToolbarPinMenu<TData>({
  columns,
  visibleColumnIds,
  pinnedColumnIds,
  onPinnedColumnIdsChange,
}: {
  columns: DataGridColumn<TData>[];
  visibleColumnIds: string[];
  pinnedColumnIds: string[];
  onPinnedColumnIdsChange: (columnIds: string[]) => void;
}) {
  const visibleColumnIdSet = new Set(visibleColumnIds);
  const pinnedColumnIdSet = new Set(pinnedColumnIds);
  const visibleColumns = columns.filter((column) =>
    visibleColumnIdSet.has(column.id),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="shrink-0">
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
                <span className="min-w-0 flex-1 truncate">{column.label}</span>
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
  );
}
