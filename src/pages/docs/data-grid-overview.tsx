import { CodeBlock, DemoBlock, PageHeader } from "@/components/docs/page-blocks";
import {
  DataGridView,
  type DataGridColumn,
} from "@/registry/default/data-grid";
import { BasicDataGridDemo } from "@/registry/default/examples/data-grid/basic-demo";

type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

const DATA_GRID_VIEW_PROPS: PropRow[] = [
  {
    name: "tableId",
    type: "string",
    description:
      "Unique id for this grid. Used as the localStorage key for persistence and as the fallback export filename.",
  },
  {
    name: "columns",
    type: "DataGridColumn<TData>[]",
    description: "Column definitions.",
  },
  { name: "rows", type: "TData[]", description: "Row data." },
  {
    name: "getRowId",
    type: "(row: TData) => string",
    description: "Stable row key, used for virtualization and row rendering.",
  },
  {
    name: "isLoading",
    type: "boolean",
    default: "false",
    description: "Shows skeleton rows instead of data.",
  },
  {
    name: "isFetchingNextPage",
    type: "boolean",
    default: "false",
    description:
      "Shows a \"Loading more...\" footer. Pair with scrollEndRef for infinite scroll.",
  },
  {
    name: "onRowClick",
    type: "(row: TData) => void",
    description: "Makes non-interactive cells clickable buttons.",
  },
  {
    name: "emptyMessage",
    type: "string",
    default: '"No results."',
    description: "Shown when rows is empty and isLoading is false.",
  },
  {
    name: "searchPlaceholder",
    type: "string",
    description: "Placeholder for the toolbar search input.",
  },
  {
    name: "hideToolbar",
    type: "boolean",
    default: "false",
    description:
      "Hide the built-in search/fields/pin/sort/export toolbar entirely.",
  },
  {
    name: "exportFilename",
    type: "string",
    default: "tableId",
    description: "Base filename (without extension) for the CSV export.",
  },
  {
    name: "toolbarActions",
    type: "ReactNode",
    description: "Extra content rendered at the end of the toolbar.",
  },
  {
    name: "searchActions",
    type: "ReactNode",
    description: "Extra content rendered next to the search input.",
  },
  {
    name: "onSearch",
    type: "(search: string) => void",
    description:
      "Debounced (~250ms) server-search callback. When set, client-side search filtering is skipped.",
  },
  {
    name: "searchDebounceMs",
    type: "number",
    default: "250",
    description: "Debounce delay for onSearch / onServerSearchChange.",
  },
  {
    name: "serverSearch",
    type: "boolean",
    default: "false",
    description:
      "Skip client-side search filtering without providing onSearch.",
  },
  {
    name: "onServerSearchChange",
    type: "(search: string) => void",
    description:
      "Alternate debounced search callback, used when onSearch is not provided.",
  },
  {
    name: "columnFilters",
    type: "DataGridColumnFilters",
    description:
      "Controlled column filter state. Omit to let the grid manage filters internally.",
  },
  {
    name: "onColumnFiltersChange",
    type: "(filters: DataGridColumnFilters) => void",
    description: "Required alongside columnFilters for controlled filters.",
  },
  {
    name: "onServerFilterChange",
    type: "(filters: DataGridColumnFilters) => void",
    description:
      "Fired whenever filters change, for syncing filters to a server request.",
  },
  {
    name: "sort",
    type: "DataGridSort",
    description: "Controlled sort state. Omit to let the grid manage sort internally.",
  },
  {
    name: "onSortChange",
    type: "(sort: DataGridSort) => void",
    description:
      "Controlled sort handler. When set, client-side sorting is skipped (the grid only renders the indicator).",
  },
  {
    name: "initialBehavior",
    type: "DataGridInitialBehavior",
    description: "Pre-set search, sort, and column filters on first render.",
  },
  {
    name: "persist",
    type: "boolean",
    default: "true",
    description:
      "Persist column widths, order, pins, and visibility to localStorage under data-grid:{tableId}.",
  },
  {
    name: "persistViewState",
    type: "boolean",
    default: "false",
    description:
      "Also persist search, sort, and filters (in addition to layout) when persist is enabled.",
  },
  {
    name: "rowHoverActions",
    type: "(row: TData) => ReactNode",
    description: "Action overlay shown on row hover or keyboard focus.",
  },
  {
    name: "virtualized",
    type: "boolean",
    default: "true",
    description:
      "Row virtualization for large datasets. Disable for short, non-scrolling lists.",
  },
  {
    name: "compact",
    type: "boolean",
    default: "false",
    description: "Denser row height (32px instead of 40px).",
  },
  {
    name: "fillViewport",
    type: "boolean",
    default: "false",
    description:
      "Grid fills the remaining viewport height below its position instead of a fixed 32rem height.",
  },
  {
    name: "className",
    type: "string",
    description: "Applied to the grid's root container.",
  },
  {
    name: "onScrollContainerRef",
    type: "(element: HTMLDivElement | null) => void",
    description:
      "Ref callback for the scrollable row container, e.g. to wire up an IntersectionObserver.",
  },
  {
    name: "scrollEndRef",
    type: "React.Ref<HTMLDivElement>",
    description:
      "Sentinel element rendered after the last row, for infinite-scroll pagination.",
  },
];

const PROPS_TABLE_COLUMNS: DataGridColumn<PropRow>[] = [
  {
    id: "name",
    label: "Prop",
    width: 200,
    filterable: false,
    getValue: (row) => row.name,
    renderCell: (row) => (
      <span className="font-mono text-xs">{row.name}</span>
    ),
  },
  {
    id: "type",
    label: "Type",
    width: 280,
    filterable: false,
    getValue: (row) => row.type,
    renderCell: (row) => (
      <span className="whitespace-pre-wrap break-words font-mono text-muted-foreground text-xs">
        {row.type}
      </span>
    ),
  },
  {
    id: "default",
    label: "Default",
    width: 110,
    filterable: false,
    getValue: (row) => row.default ?? "—",
    renderCell: (row) => (
      <span className="font-mono text-muted-foreground text-xs">
        {row.default ?? "—"}
      </span>
    ),
  },
  {
    id: "description",
    label: "Description",
    width: 420,
    filterable: false,
    getValue: (row) => row.description,
    renderCell: (row) => (
      <span className="whitespace-pre-wrap break-words text-muted-foreground text-xs">
        {row.description}
      </span>
    ),
  },
];

export function DataGridOverviewPage() {
  return (
    <div>
      <PageHeader
        title="Data Grid"
        description="A virtualized data table with toolbar, column layout, client search/filter/sort, and CSV export. Copied into your app as source."
      />
      <DemoBlock
        title="Basic"
        description="40 dummy orders. Use Fields, Pin, Sort, column filters, search, and Export CSV."
      >
        <BasicDataGridDemo />
      </DemoBlock>
      <div className="mb-10 grid gap-2">
        <h2 className="text-lg font-medium">Usage</h2>
        <CodeBlock>{`import { DataGridView } from "@/components/data-grid"

<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
/>`}</CodeBlock>
      </div>
      <div className="grid gap-2">
        <h2 className="text-lg font-medium">Props</h2>
        <p className="text-muted-foreground text-sm">
          DataGridView props. columns is DataGridColumn&lt;TData&gt;[] — see
          Advanced features for column-level options like cell, funnels, and
          filterOptions.
        </p>
        <DataGridView
          tableId="docs-props-reference"
          className="border-1 rounded-md"
          columns={PROPS_TABLE_COLUMNS}
          rows={DATA_GRID_VIEW_PROPS}
          getRowId={(row) => row.name}
          persist={false}
          hideToolbar
        />
      </div>
    </div>
  );
}
