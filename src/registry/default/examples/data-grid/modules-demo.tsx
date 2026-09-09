"use client";

import { useMemo, useState } from "react";
import {
  DataGridView,
  type DataGridSort,
} from "@/registry/default/data-grid";
import { basicOrderColumns } from "./basic-demo";
import {
  DUMMY_ORDERS,
  type DummyOrder,
} from "./dummy-orders";

// 1. Toolbar — built-in toolbar with search, fields, pin, sort, export
export function ToolbarModuleDemo() {
  return (
    <DataGridView
      tableId="docs-module-toolbar"
      columns={basicOrderColumns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
      searchPlaceholder="Search orders..."
      exportFilename="orders"
    />
  );
}

// 2. Fields — hide/unhide, pin, reorder via the toolbar Fields menu
export function FieldsModuleDemo() {
  return (
    <DataGridView
      tableId="docs-module-fields"
      columns={basicOrderColumns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
    />
  );
}

// 3. Sort — click a column header to sort (built-in client sort)
export function SortModuleDemo() {
  return (
    <DataGridView
      tableId="docs-module-sort"
      columns={basicOrderColumns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
    />
  );
}

// 3.1 Custom sort function — onSortChange delegates sorting to the server
export function CustomSortModuleDemo() {
  const [sort, setSort] = useState<DataGridSort>(null);
  const rows = useMemo(() => {
    if (!sort) return DUMMY_ORDERS;
    const sorted = [...DUMMY_ORDERS];
    const dir = sort.direction === "asc" ? 1 : -1;
    sorted.sort((a, b) => {
      if (sort.columnId === "amount") return (a.amount - b.amount) * dir;
      return String(a[sort.columnId as keyof DummyOrder])
        .localeCompare(String(b[sort.columnId as keyof DummyOrder])) * dir;
    });
    return sorted;
  }, [sort]);

  return (
    <DataGridView
      tableId="docs-module-custom-sort"
      columns={basicOrderColumns}
      rows={rows}
      getRowId={(row) => row.id}
      persist={false}
      sort={sort}
      onSortChange={setSort}
    />
  );
}

// 4. Export — built-in CSV export via the toolbar
export function ExportModuleDemo() {
  return (
    <DataGridView
      tableId="docs-module-export"
      columns={basicOrderColumns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
      exportFilename="orders-export"
    />
  );
}

// 4.1 Custom export function — add a custom export button via toolbarActions
export function CustomExportModuleDemo() {
  return (
    <DataGridView
      tableId="docs-module-custom-export"
      columns={basicOrderColumns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
      toolbarActions={
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
          onClick={() => {
            const headers = basicOrderColumns.map((c) => c.label);
            const lines = [
              headers.join(","),
              ...DUMMY_ORDERS.map((row) =>
                basicOrderColumns.map((c) => c.getValue(row)).join(","),
              ),
            ];
            const blob = new Blob([lines.join("\n")], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "custom-orders.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export CSV
        </button>
      }
    />
  );
}

// 5. Column resize — drag the right edge of any header cell
export function ColumnResizeModuleDemo() {
  return (
    <DataGridView
      tableId="docs-module-resize"
      columns={basicOrderColumns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
    />
  );
}

// 6. Filters — built-in filter funnels per column
export function FiltersModuleDemo() {
  return (
    <DataGridView
      tableId="docs-module-filters"
      columns={basicOrderColumns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
    />
  );
}

// 9. Local storage persistence — layout (widths, order, pin, visibility) survives reloads
export function PersistenceModuleDemo() {
  return (
    <DataGridView
      tableId="docs-module-persistence"
      columns={basicOrderColumns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist
    />
  );
}

// 10. Custom initial behaviour — pre-set search, sort, and filters
export function InitialBehaviorModuleDemo() {
  return (
    <DataGridView
      tableId="docs-module-initial-behavior"
      columns={basicOrderColumns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
      initialBehavior={{
        search: "acme",
        sort: { columnId: "amount", direction: "desc" },
        filters: { status: ["open"] },
      }}
    />
  );
}
