"use client";

import { ArrowLeftIcon, ArrowRightIcon, Columns3Icon, PinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getColumnLabelString } from "../../column-label";
import type { DataGridColumn } from "../../types";

export function ToolbarFieldsMenu<TData>({
  columns,
  visibleColumnIds,
  pinnedColumnIds,
  columnOrder,
  onVisibleColumnIdsChange,
  onPinnedColumnIdsChange,
  onColumnMove,
}: {
  columns: DataGridColumn<TData>[];
  visibleColumnIds: string[];
  pinnedColumnIds: string[];
  columnOrder: string[];
  onVisibleColumnIdsChange: (columnIds: string[]) => void;
  onPinnedColumnIdsChange: (columnIds: string[]) => void;
  onColumnMove: (columnId: string, direction: "left" | "right") => void;
}) {
  const visibleColumnIdSet = new Set(visibleColumnIds);
  const pinnedColumnIdSet = new Set(pinnedColumnIds);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="shrink-0">
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
                          : visibleColumnIds.filter((id) => id !== column.id),
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
                    orderIndex === -1 || orderIndex >= columnOrder.length - 1
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
  );
}
