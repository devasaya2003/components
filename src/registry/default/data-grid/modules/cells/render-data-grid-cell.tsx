import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getDataGridColumnDisplayValue } from "./get-data-grid-cell-value";
import type { DataGridCellContext, DataGridColumn } from "../../types";

export function renderDataGridCell<TData>(
  column: DataGridColumn<TData>,
  row: TData,
  rowIndex: number,
) {
  const cellCtx: DataGridCellContext = { rowIndex };
  if (column.renderCell) {
    return column.renderCell(row, cellCtx);
  }

  const value = getDataGridColumnDisplayValue(column, row, rowIndex);
  const cellType = column.cell?.type ?? (column.valueType === "date" ? "date" : "text");

  if (cellType === "badge") {
    return (
      <Badge variant={column.cell?.badgeVariant ?? "outline"} className="capitalize">
        {value}
      </Badge>
    );
  }

  const wrap = column.cell?.wrap ?? false;

  return (
    <span
      className={cn(
        wrap ? "whitespace-pre-wrap break-words" : "truncate",
        "font-normal",
        value === "—" && "text-muted-foreground",
      )}
      title={wrap ? undefined : value}
    >
      {value}
    </span>
  );
}
