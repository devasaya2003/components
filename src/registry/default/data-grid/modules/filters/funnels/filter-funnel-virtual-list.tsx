"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { DataGridColumnFilterOption } from "../../../types";

type FilterFunnelVirtualListProps = {
  options: DataGridColumnFilterOption[];
  draftSelected: string[];
  toggleOption: (value: string) => void;
};

export function FilterFunnelVirtualList({
  options,
  draftSelected,
  toggleOption,
}: FilterFunnelVirtualListProps) {
  return (
    <div className="relative w-full">
      {options.map((opt) => {
        const checked = draftSelected.includes(opt.value);
        return (
          <div key={opt.value} className="w-full">
            <label
              className={cn(
                "flex cursor-pointer items-start gap-2 rounded px-2 py-1 text-xs transition-colors hover:bg-accent",
                checked && "bg-accent/50",
              )}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => toggleOption(opt.value)}
                className="mt-0.5"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate leading-tight">{opt.label}</span>
                {opt.detail && opt.detail !== opt.label ? (
                  <span className="truncate text-[10px] text-muted-foreground">
                    {opt.detail}
                  </span>
                ) : null}
              </div>
            </label>
          </div>
        );
      })}
    </div>
  );
}
