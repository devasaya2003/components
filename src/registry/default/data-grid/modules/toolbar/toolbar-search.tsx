"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ToolbarSearch({
  search,
  searchPlaceholder,
  searchActions,
  onSearchChange,
}: {
  search: string;
  searchPlaceholder: string;
  searchActions?: React.ReactNode;
  onSearchChange: (search: string) => void;
}) {
  return (
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
  );
}
