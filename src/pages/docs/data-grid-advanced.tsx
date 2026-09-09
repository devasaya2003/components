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
        description="Pass rowHoverActions. Wrap icon buttons in a tooltip."
        code={`<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  rowHoverActions={(row) => (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon-xs" variant="ghost" aria-label="Edit">
            <PencilIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => archiveOrder(row.id)}
          >
            <ArchiveIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Archive</TooltipContent>
      </Tooltip>
    </>
  )}
/>`}
      >
        <HoverActionsDataGridDemo />
      </DemoBlock>
      <DemoBlock
        title="Inline editing"
        description="Click a company cell to edit. Enter commits, Escape cancels."
        code={`{
  id: "company",
  label: "Company",
  interactive: true,
  getValue: (row) => row.company,
  renderCell: (row) => (
    <TextCellEditor
      value={row.company}
      onCommit={(value) => updateCompany(row.id, value)}
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
