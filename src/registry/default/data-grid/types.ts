import type { ReactNode } from "react";
export { extractTextFromReactNode, getColumnLabelString } from "./column-label";

export type DataGridCellContext = {
  rowIndex: number;
};

export type DataGridColumnFilterOption = {
  value: string;
  label: string;
  detail?: string;
};

export type DataGridColumnFilters = Record<string, string[]>;

export type DataGridFunnelContext<TData> = {
  column: DataGridColumn<TData>;
  close: () => void;
};

export type DataGridFunnel<TData> = {
  id: string;
  icon?: ReactNode;
  label: string;
  isActive: boolean;
  renderWorkflow: (ctx: DataGridFunnelContext<TData>) => ReactNode;
};

export type DataGridValueType = "text" | "date";

export type DataGridCellType = "text" | "date" | "badge" | "custom";

export type DataGridCellConfig = {
  type?: DataGridCellType;
  badgeVariant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
};

export type DataGridColumn<TData> = {
  id: string;
  label: ReactNode;
  width?: number;
  /** When `date`, the grid formats `getValue` with `formatDataGridDate`. */
  valueType?: DataGridValueType;
  /** Built-in cell renderer. `custom` uses `renderCell`. */
  cell?: DataGridCellConfig;
  getValue: (row: TData) => string;
  getSortValue?: (row: TData) => string;
  renderCell?: (row: TData, ctx: DataGridCellContext) => ReactNode;
  /**
   * When true, cell is a plain container (not a row-click button).
   * Use for dropdowns, inputs, links, date pickers.
   */
  interactive?: boolean;
  funnels?: DataGridFunnel<TData>[];
  /** Whether the default list filter funnel is attached. Defaults to true. */
  filterable?: boolean;
  filterOptions?:
    | DataGridColumnFilterOption[]
    | ((rows: TData[]) => DataGridColumnFilterOption[]);
  getFilterOptions?: (
    search: string,
  ) => Promise<DataGridColumnFilterOption[]> | DataGridColumnFilterOption[];
};

export type DataGridSort = {
  columnId: string;
  direction: "asc" | "desc";
} | null;

export type DataGridViewState = {
  search: string;
  sort: DataGridSort;
  filters: DataGridColumnFilters;
};

export const DEFAULT_DATA_GRID_VIEW_STATE: DataGridViewState = {
  search: "",
  sort: null,
  filters: {},
};

export const DEFAULT_COLUMN_WIDTH = 220;
export const MIN_COLUMN_WIDTH = 64;
