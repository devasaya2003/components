import { DemoBlock, PageHeader } from "@/components/docs/page-blocks";
import { BasicDataGridDemo } from "@/registry/default/examples/data-grid/basic-demo";
import { PersistentDataGridDemo } from "@/registry/default/examples/data-grid/persistent-demo";

export function DataGridPrimitivesPage() {
  return (
    <div>
      <PageHeader
        title="Primitive features"
        description="Column resize, pin/unpin, left/right swap, search, filters, toolbar, and localStorage persistence."
      />
      <DemoBlock
        title="Resize, pin, swap, search, filters, toolbar"
        description="Drag header edges to resize. Fields menu toggles visibility, pin, and column order. Column header funnels filter in-memory rows."
      >
        <BasicDataGridDemo />
      </DemoBlock>
      <DemoBlock
        title="localStorage persistence"
        description="This grid writes column widths, order, pins, visibility, search, sort, and filters to localStorage under data-grid:docs-persistent-orders. Reload the page to restore."
      >
        <PersistentDataGridDemo />
      </DemoBlock>
    </div>
  );
}
