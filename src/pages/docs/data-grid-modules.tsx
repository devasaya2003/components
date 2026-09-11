import { DemoBlock, PageHeader } from "@/components/docs/page-blocks";
import {
  CellTypesDataGridDemo,
  FilterActionDataGridDemo,
  FilterListDataGridDemo,
  FilterSearchDataGridDemo,
  HoverActionsDataGridDemo,
  InlineEditDataGridDemo,
  SearchActionDataGridDemo,
} from "@/registry/default/examples/data-grid/advanced-demo";
import {
  ColumnResizeModuleDemo,
  CustomExportModuleDemo,
  CustomSortModuleDemo,
  ExportModuleDemo,
  FieldsModuleDemo,
  FiltersModuleDemo,
  InitialBehaviorModuleDemo,
  PersistenceModuleDemo,
  SortModuleDemo,
  ToolbarModuleDemo,
} from "@/registry/default/examples/data-grid/modules-demo";

const MODULES = [
  { id: "toolbar", label: "Toolbar" },
  { id: "fields", label: "Fields" },
  { id: "sort", label: "Sort" },
  { id: "custom-sort", label: "Custom sort" },
  { id: "export", label: "Export" },
  { id: "custom-export", label: "Custom export" },
  { id: "resize", label: "Column resize" },
  { id: "filters", label: "Filters" },
  { id: "filter-list", label: "Custom filter list" },
  { id: "filter-search", label: "Custom filter search" },
  { id: "filter-action", label: "Custom filter function" },
  { id: "search", label: "Search" },
  { id: "search-action", label: "Custom search (debounced)" },
  { id: "cell-types", label: "Custom cell type" },
  { id: "inline-edit", label: "Custom cell action" },
  { id: "hover-actions", label: "Custom cell hover action" },
  { id: "persistence", label: "Local storage persistence" },
  { id: "initial-behavior", label: "Custom initial behaviour" },
];

export function DataGridModulesPage() {
  return (
    <div>
      <PageHeader
        title="Modules"
        description="Each module of the data grid with a live demo and the setup code. Search and getFilterOptions are debounced at 250ms by default."
      />

      <nav className="sticky top-14 z-30 -mx-4 mb-8 flex gap-1 overflow-x-auto border-b bg-background/90 px-4 py-2 backdrop-blur">
        {MODULES.map((module) => (
          <a
            key={module.id}
            href={`#${module.id}`}
            className="whitespace-nowrap rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {module.label}
          </a>
        ))}
      </nav>

      <div className="grid gap-12">
        <DemoBlock
          title="Toolbar"
          description="Search, fields menu, pin, sort, and export are all built into the toolbar."
          code={`<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  searchPlaceholder="Search orders..."
  exportFilename="orders"
/>`}
        >
          <div id="toolbar">
            <ToolbarModuleDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Fields (Hide, Unhide, Pin, Order)"
          description="Use the toolbar Fields menu to hide, unhide, pin, and reorder columns."
          code={`<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
/>`}
        >
          <div id="fields">
            <FieldsModuleDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Sort"
          description="Click a column header to sort ascending or descending. Sorting is client-side by default."
          code={`<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
/>`}
        >
          <div id="sort">
            <SortModuleDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Custom sort function"
          description="Pass onSortChange to delegate sorting to your server. The grid skips client sort and shows the indicator only."
          code={`const [sort, setSort] = useState(null);
const rows = useMemo(() => sortRows(rows, sort), [sort]);

<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  sort={sort}
  onSortChange={setSort}
/>`}
        >
          <div id="custom-sort">
            <CustomSortModuleDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Export"
          description="Built-in CSV export with formula injection neutralisation. The toolbar button is always shown; set exportFilename to customize the downloaded file's name (defaults to tableId)."
          code={`<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  exportFilename="orders-export"
/>`}
        >
          <div id="export">
            <ExportModuleDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Custom export function"
          description="Add a custom export button via toolbarActions to replace the built-in CSV writer."
          code={`<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  toolbarActions={<button onClick={customExport}>Export CSV</button>}
/>`}
        >
          <div id="custom-export">
            <CustomExportModuleDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Column resize"
          description="Drag the right edge of any header cell to resize. Widths persist when persist is enabled."
          code={`<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
/>`}
        >
          <div id="resize">
            <ColumnResizeModuleDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Filters"
          description="Each filterable column gets a funnel icon. Click to open the filter panel with select-all and search."
          code={`<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
/>`}
        >
          <div id="filters">
            <FiltersModuleDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Custom filter list"
          description="Provide a static filterOptions array to constrain the filter to a fixed list of values."
          code={`const columns = [
  {
    id: "status",
    label: "Status",
    getValue: (row) => row.status,
    filterOptions: [
      { value: "open", label: "Open" },
      { value: "done", label: "Done" },
    ],
  },
];

<DataGridView tableId="orders" columns={columns} rows={rows} getRowId={(row) => row.id} />`}
        >
          <div id="filter-list">
            <FilterListDataGridDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Custom filter search (debounced)"
          description="Provide getFilterOptions to fetch options from an API. The search input is debounced at 250ms."
          code={`const columns = [
  {
    id: "company",
    label: "Company",
    getValue: (row) => row.company,
    getFilterOptions: (search) => fetchCompanyOptions(search),
  },
];

<DataGridView tableId="orders" columns={columns} rows={rows} getRowId={(row) => row.id} />`}
        >
          <div id="filter-search">
            <FilterSearchDataGridDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Custom filter function"
          description="Build a fully custom filter UI with createCustomFunnel — any React node as the filter panel."
          code={`import { createCustomFunnel } from "@/registry/default/data-grid";

const columns = [
  {
    id: "amount",
    label: "Amount",
    getValue: (row) => row.amount,
    funnels: [
      createCustomFunnel({
        id: "filter-custom",
        label: "Minimum amount",
        isActive: false,
        renderWorkflow: ({ close }) => <CustomPanel close={close} />,
      }),
    ],
  },
];`}
        >
          <div id="filter-action">
            <FilterActionDataGridDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Search"
          description="Built-in client-side search across all columns. Type in the toolbar search box."
          code={`<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  searchPlaceholder="Search orders..."
/>`}
        >
          <div id="search">
            <ToolbarModuleDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Custom search (debounced)"
          description="Pass onSearch to call your API instead of filtering client-side. The input is debounced at 250ms."
          code={`const [rows, setRows] = useState(initialRows);

<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  onSearch={(query) => {
    fetchOrders(query).then(setRows);
  }}
/>`}
        >
          <div id="search-action">
            <SearchActionDataGridDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Custom cell type"
          description="Use cell.type (text, date, badge) or renderCell for a fully custom cell renderer."
          code={`const columns = [
  {
    id: "status",
    label: "Status",
    cell: { type: "badge", badgeVariant: "outline" },
    getValue: (row) => row.status,
  },
];

<DataGridView tableId="orders" columns={columns} rows={rows} getRowId={(row) => row.id} />`}
        >
          <div id="cell-types">
            <CellTypesDataGridDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Custom cell action (inline edit)"
          description="Set interactive: true and renderCell to use EditableCell. It only tracks display/edit state — renderEditor can be a text input, a dropdown, a textarea, anything with its own state, as long as it calls commit or cancel. For a Radix menu/popover editor, defer that call to onOpenChange (see StatusDropdownEditor below) — calling commit() straight from an item's onClick force-unmounts the menu mid-interaction and can leave Radix's scroll lock stuck."
          code={`import { EditableCell, TextEditorInput } from "@/registry/default/data-grid";

const columns = [
  {
    id: "company",
    label: "Company",
    interactive: true,
    getValue: (row) => row.company,
    renderCell: (row) => (
      <EditableCell
        value={row.company}
        onCommit={(value) => updateRow(row.id, { company: value })}
        renderEditor={(editor) => <TextEditorInput {...editor} />}
      />
    ),
  },
  {
    id: "status",
    label: "Status",
    interactive: true,
    getValue: (row) => row.status,
    renderCell: (row) => (
      <EditableCell
        value={row.status}
        onCommit={(value) => updateRow(row.id, { status: value })}
        renderEditor={(editor) => <StatusDropdownEditor {...editor} />}
      />
    ),
  },
];

function StatusDropdownEditor({ value, commit, cancel }) {
  const pendingRef = useRef(null);
  return (
    <DropdownMenu
      defaultOpen
      onOpenChange={(open) => {
        if (open) return;
        const pending = pendingRef.current;
        pending !== null ? commit(pending) : cancel();
      }}
    >
      {/* trigger + items; each item sets pendingRef.current, Radix closes itself */}
    </DropdownMenu>
  );
}`}
        >
          <div id="inline-edit">
            <InlineEditDataGridDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Custom cell hover action"
          description="Scope hover to a single column via that column's renderCell, e.g. wrapping the cell in a Tooltip. Hover the Order column."
          code={`{
  id: "orderNumber",
  label: "Order",
  getValue: (row) => row.orderNumber,
  renderCell: (row) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="truncate">{row.orderNumber}</span>
      </TooltipTrigger>
      <TooltipContent>
        Here we are getting the order number: {row.orderNumber}
      </TooltipContent>
    </Tooltip>
  ),
}`}
        >
          <div id="hover-actions">
            <HoverActionsDataGridDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Local storage persistence"
          description="Set persist (default true) to save column widths, order, pin state, and visibility to localStorage."
          code={`<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  persist
/>`}
        >
          <div id="persistence">
            <PersistenceModuleDemo />
          </div>
        </DemoBlock>

        <DemoBlock
          title="Custom initial behaviour"
          description="Pass initialBehavior to pre-set the search term, sort, and column filters on first render."
          code={`<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  initialBehavior={{
    search: "acme",
    sort: { columnId: "amount", direction: "desc" },
    filters: { status: ["open"] },
  }}
/>`}
        >
          <div id="initial-behavior">
            <InitialBehaviorModuleDemo />
          </div>
        </DemoBlock>
      </div>
    </div>
  );
}
