"use client";

import { DataGridView } from "@/registry/default/data-grid";
import type { DataGridColumn } from "@/registry/default/data-grid";
import {
  DUMMY_ORDERS,
  formatAmount,
  type DummyOrder,
} from "./dummy-orders";

export const basicOrderColumns: DataGridColumn<DummyOrder>[] = [
  {
    id: "orderNumber",
    label: "Order",
    width: 140,
    getValue: (row) => row.orderNumber,
  },
  {
    id: "company",
    label: "Company",
    width: 200,
    getValue: (row) => row.company,
  },
  {
    id: "assignee",
    label: "Assignee",
    width: 160,
    getValue: (row) => row.assignee,
  },
  {
    id: "status",
    label: "Status",
    width: 140,
    cell: { type: "badge", badgeVariant: "outline" },
    getValue: (row) => row.status.replace("_", " "),
  },
  {
    id: "amount",
    label: "Amount",
    width: 120,
    getValue: (row) => formatAmount(row.amount),
    getSortValue: (row) => String(row.amount),
  },
  {
    id: "poDate",
    label: "PO date",
    width: 140,
    valueType: "date",
    cell: { type: "date" },
    getValue: (row) => row.poDate,
    getSortValue: (row) => row.poDate,
  },
];

export function BasicDataGridDemo() {
  return (
    <DataGridView
      tableId="docs-basic-orders"
      columns={basicOrderColumns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
      searchPlaceholder="Search orders..."
      exportFilename="orders"
    />
  );
}
