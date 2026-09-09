import { CodeBlock, DemoBlock, PageHeader } from "@/components/docs/page-blocks";
import { BasicDataGridDemo } from "@/registry/default/examples/data-grid/basic-demo";

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
      <div className="grid gap-2">
        <h2 className="text-lg font-medium">Usage</h2>
        <CodeBlock>{`import { DataGridView } from "@/components/data-grid"

<DataGridView
  tableId="orders"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
/>`}</CodeBlock>
      </div>
    </div>
  );
}
