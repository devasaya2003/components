import type { DataGridSort } from "../../types";

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
