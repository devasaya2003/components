"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DataGridColumn, DataGridFunnel } from "./types";

type DataGridFunnelTriggerProps<TData> = {
  column: DataGridColumn<TData>;
  funnel: DataGridFunnel<TData>;
};

export function DataGridFunnelTrigger<TData>({
  column,
  funnel,
}: DataGridFunnelTriggerProps<TData>) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "ml-1 inline-flex size-5 shrink-0 items-center justify-center rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            funnel.isActive &&
              "bg-primary/10 font-semibold text-primary hover:bg-primary/20 hover:text-primary",
          )}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={funnel.label}
          title={funnel.label}
        >
          {funnel.icon}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-64 p-3"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {funnel.renderWorkflow({
          column,
          close: () => setOpen(false),
        })}
      </PopoverContent>
    </Popover>
  );
}
