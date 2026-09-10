"use client";

import { ArrowUpDown, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getColumnLabelString } from "../../column-label";
import type { DataGridColumn, DataGridSort } from "../../types";
import { isUnsortableColumn } from "../cells/serial-number-column";

export function ToolbarSortMenu<TData>({
  columns,
  sort,
  onSortChange,
}: {
  columns: DataGridColumn<TData>[];
  sort: DataGridSort;
  onSortChange: (sort: DataGridSort) => void;
}) {
  const activeColumn = columns.find((column) => column.id === sort?.columnId);

  return (
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
                activeColumn ?? {
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
                      isActive && sort?.direction === "asc" ? "desc" : "asc",
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
  );
}
