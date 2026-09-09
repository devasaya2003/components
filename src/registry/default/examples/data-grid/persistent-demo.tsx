"use client";

import { DataGridView } from "@/registry/default/data-grid";
import { basicOrderColumns } from "./basic-demo";
import { DUMMY_ORDERS } from "./dummy-orders";

export function PersistentDataGridDemo() {
  return (
    <DataGridView
      tableId="docs-persistent-orders"
      columns={basicOrderColumns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist
      persistViewState
      searchPlaceholder="Search, pin, resize — then reload"
      exportFilename="orders"
    />
  );
}
