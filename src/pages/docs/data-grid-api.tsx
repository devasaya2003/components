import { CodeBlock, PageHeader } from "@/components/docs/page-blocks";

export function DataGridApiPage() {
  return (
    <div>
      <PageHeader
        title="API"
        description="Primary types for DataGridView and DataGridColumn. Search and getFilterOptions are debounced at 250ms."
      />
      <div className="grid gap-6">
        <div>
          <h2 className="mb-2 text-lg font-medium">DataGridView</h2>
          <CodeBlock>{`tableId: string
columns: DataGridColumn<TData>[]
rows: TData[]
getRowId: (row: TData) => string
onSearch?: (search: string) => void // debounced 250ms, skips client search
searchDebounceMs?: number // default 250
rowHoverActions?: (row: TData) => ReactNode
persist?: boolean
persistViewState?: boolean
onSortChange?: (sort: DataGridSort) => void
onColumnFiltersChange?: (filters: DataGridColumnFilters) => void
onRowClick?: (row: TData) => void
isLoading?: boolean
virtualized?: boolean`}</CodeBlock>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-medium">DataGridColumn</h2>
          <CodeBlock>{`id: string
label: ReactNode
width?: number
cell?: { type: "text" | "date" | "badge" | "custom" }
getValue: (row) => string
getSortValue?: (row) => string
renderCell?: (row, ctx) => ReactNode
interactive?: boolean
filterable?: boolean
filterOptions?: Option[] | ((rows) => Option[])
getFilterOptions?: (search) => Option[] | Promise<Option[]> // debounced 250ms
funnels?: DataGridFunnel[]`}</CodeBlock>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-medium">Helpers</h2>
          <CodeBlock>{`createCustomFunnel
createCustomListFilterFunnel
createFilterFunnel
TextCellEditor
exportDataGridCsv`}</CodeBlock>
        </div>
      </div>
    </div>
  );
}
