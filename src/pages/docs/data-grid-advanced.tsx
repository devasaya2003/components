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

export function DataGridAdvancedPage() {
  return (
    <div>
      <PageHeader
        title="Advanced features"
        description="Each example includes the call site. Search and filter-option APIs are debounced at 250ms inside the grid."
      />
      <DemoBlock
        title="Hover actions"
        description="Hover is scoped to a single column via that column's renderCell — wrap the cell content in a Tooltip instead of using a row-wide overlay."
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
        <HoverActionsDataGridDemo />
      </DemoBlock>
      <DemoBlock
        title="Inline editing"
        description="EditableCell toggles between a display trigger and any editor component you provide — it just tracks open/closed and calls onCommit. Click Company to edit text, click Status to pick from a dropdown."
        code={`{
  id: "company",
  label: "Company",
  interactive: true,
  getValue: (row) => row.company,
  renderCell: (row) => (
    <EditableCell
      value={row.company}
      onCommit={(value) => updateCompany(row.id, value)}
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
      onCommit={(value) => updateStatus(row.id, value)}
      renderEditor={({ value, commit, cancel }) => (
        <StatusDropdown value={value} onSelect={commit} onClose={cancel} />
      )}
    />
  ),
}`}
      >
        <InlineEditDataGridDemo />
      </DemoBlock>
      <DemoBlock
        title="Cell types"
        description="Use cell.type for text, date, or badge. Use renderCell for custom."
        code={`{
  id: "status",
  label: "Status",
  cell: { type: "badge", badgeVariant: "outline" },
  getValue: (row) => row.status,
}
{
  id: "poDate",
  label: "PO date",
  cell: { type: "date" },
  getValue: (row) => row.poDate,
}`}
      >
        <CellTypesDataGridDemo />
      </DemoBlock>
      <DemoBlock
        title="Search action"
        description="Pass onSearch to call your API. The grid debounces at 250ms and skips client search."
        code={`<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  isLoading={isLoading}
  onSearch={(query) => {
    void fetchOrders(query).then(setRows)
  }}
/>

// fetchOrders is your API. The grid waits 250ms after typing stops.`}
      >
        <SearchActionDataGridDemo />
      </DemoBlock>
      <DemoBlock
        title="Filter list"
        description="Static options via filterOptions. The funnel list is built for you."
        code={`{
  id: "status",
  label: "Status",
  getValue: (row) => row.status,
  filterOptions: [
    { value: "open", label: "Open" },
    { value: "shipped", label: "Shipped" },
    { value: "done", label: "Done" },
  ],
}`}
      >
        <FilterListDataGridDemo />
      </DemoBlock>
      <DemoBlock
        title="Filter search"
        description="Pass getFilterOptions to load options from an API. The funnel search box is debounced at 250ms."
        code={`{
  id: "company",
  label: "Company",
  getValue: (row) => row.company,
  getFilterOptions: (search) => fetchCompanyOptions(search),
}

// fetchCompanyOptions(search) can hit your API.
// Typing in the filter popover waits 250ms before calling it.`}
      >
        <FilterSearchDataGridDemo />
      </DemoBlock>
      <DemoBlock
        title="Filter action"
        description="Use createCustomFunnel when the filter UI is not a value list."
        code={`{
  id: "amount",
  label: "Amount",
  filterable: false,
  getValue: (row) => String(row.amount),
  funnels: [
    createCustomFunnel({
      id: "min-amount",
      label: "Minimum amount",
      isActive: Boolean(minAmount),
      icon: <SlidersHorizontalIcon className="size-3" />,
      renderWorkflow: ({ close }) => (
        <MinAmountFilter
          value={minAmount}
          onChange={setMinAmount}
          onDone={close}
        />
      ),
    }),
  ],
}`}
      >
        <FilterActionDataGridDemo />
      </DemoBlock>
    </div>
  );
}
