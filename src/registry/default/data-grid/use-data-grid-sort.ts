"use client";

import { useState } from "react";
import type { DataGridSort } from "./types";

export function useDataGridSort(initialSort: DataGridSort = null) {
  const [sort, setSort] = useState<DataGridSort>(initialSort);
  return { sort, setSort };
}

export function serializeDataGridSort(sort?: DataGridSort): {
  sortBy?: string;
  sortDir?: "asc" | "desc";
} {
  if (!sort) {
    return {};
  }
  return {
    sortBy: sort.columnId,
    sortDir: sort.direction,
  };
}
