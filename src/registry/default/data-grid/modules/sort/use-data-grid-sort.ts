"use client";

import { useState } from "react";
import type { DataGridSort } from "../../types";

export function useDataGridSort(initialSort: DataGridSort = null) {
  const [sort, setSort] = useState<DataGridSort>(initialSort);
  return { sort, setSort };
}

export { serializeDataGridSort } from "./serialize-data-grid-sort";
