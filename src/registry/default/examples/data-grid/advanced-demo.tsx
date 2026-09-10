"use client";

import { CheckIcon, SlidersHorizontalIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  DataGridView,
  EditableCell,
  TextEditorInput,
  createCustomFunnel,
  type DataGridColumn,
} from "@/registry/default/data-grid";
import { basicOrderColumns } from "./basic-demo";
import {
  DUMMY_ORDERS,
  STATUS_FILTER_OPTIONS,
  fetchCompanyFilterOptions,
  fetchOrders,
  formatAmount,
  type DummyOrder,
} from "./dummy-orders";

export function HoverActionsDataGridDemo() {
  const [rows] = useState(DUMMY_ORDERS);

  return (
    <DataGridView
      tableId="docs-hover-orders"
      columns={basicOrderColumns}
      rows={rows}
      getRowId={(row) => row.id}
      persist={false}
      rowHoverActions={(row) => (
        <>
          <div>
            <span className="max-w-xs text-sm">
              Here we are getting the order number: {row.orderNumber}
            </span>
          </div>
        </>
      )}
    />
  );
}

const ORDER_STATUS_OPTIONS: DummyOrder["status"][] = [
  "open",
  "in_progress",
  "shipped",
  "done",
];

export function InlineEditDataGridDemo() {
  const [rows, setRows] = useState(DUMMY_ORDERS);

  function updateRow(id: string, patch: Partial<DummyOrder>) {
    setRows((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  const columns: DataGridColumn<DummyOrder>[] = [
    ...basicOrderColumns.filter(
      (column) => column.id !== "company" && column.id !== "status",
    ),
    {
      id: "company",
      label: "Company",
      width: 220,
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
      width: 160,
      interactive: true,
      cell: { type: "badge", badgeVariant: "secondary" },
      getValue: (row) => row.status.replace("_", " "),
      renderCell: (row) => (
        <EditableCell
          value={row.status}
          onCommit={(value) => updateRow(row.id, { status: value })}
          renderDisplay={(status) => (
            <span className="capitalize">{status.replace("_", " ")}</span>
          )}
          renderEditor={({ value, commit, cancel }) => (
            <DropdownMenu
              defaultOpen
              onOpenChange={(open) => {
                if (!open) cancel();
              }}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-7 w-full truncate rounded-sm px-1 text-left text-[13px] capitalize hover:bg-muted"
                >
                  {value.replace("_", " ")}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {ORDER_STATUS_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    className="capitalize"
                    onClick={() => commit(option)}
                  >
                    {value === option ? <CheckIcon /> : null}
                    {option.replace("_", " ")}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      ),
    },
  ];

  return (
    <DataGridView
      tableId="docs-inline-orders"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      persist={false}
      virtualized={false}
    />
  );
}

export function CellTypesDataGridDemo() {
  return (
    <DataGridView
      tableId="docs-cell-types"
      columns={basicOrderColumns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
    />
  );
}

export function SearchActionDataGridDemo() {
  const [rows, setRows] = useState(DUMMY_ORDERS);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);

  return (
    <DataGridView
      tableId="docs-search-action"
      columns={basicOrderColumns}
      rows={rows}
      getRowId={(row) => row.id}
      persist={false}
      isLoading={isLoading}
      searchPlaceholder="Search via API (debounced 250ms)"
      onSearch={(query) => {
        const requestId = ++requestIdRef.current;
        setIsLoading(true);
        void fetchOrders(query).then((nextRows) => {
          if (requestId !== requestIdRef.current) {
            return;
          }
          setRows(nextRows);
          setIsLoading(false);
        });
      }}
    />
  );
}

export function FilterListDataGridDemo() {
  const columns: DataGridColumn<DummyOrder>[] = [
    {
      id: "orderNumber",
      label: "Order",
      width: 140,
      getValue: (row) => row.orderNumber,
      filterable: false,
    },
    {
      id: "company",
      label: "Company",
      width: 200,
      getValue: (row) => row.company,
      filterable: false,
    },
    {
      id: "status",
      label: "Status",
      width: 140,
      cell: { type: "badge", badgeVariant: "secondary" },
      getValue: (row) => row.status.replace("_", " "),
      filterOptions: STATUS_FILTER_OPTIONS.map((option) => ({
        value: option.value.replace("_", " "),
        label: option.label,
      })),
    },
  ];

  return (
    <DataGridView
      tableId="docs-filter-list"
      columns={columns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
    />
  );
}

export function FilterSearchDataGridDemo() {
  const columns: DataGridColumn<DummyOrder>[] = [
    {
      id: "orderNumber",
      label: "Order",
      width: 140,
      getValue: (row) => row.orderNumber,
      filterable: false,
    },
    {
      id: "company",
      label: "Company",
      width: 240,
      getValue: (row) => row.company,
      getFilterOptions: (search) => fetchCompanyFilterOptions(search),
    },
    {
      id: "assignee",
      label: "Assignee",
      width: 160,
      getValue: (row) => row.assignee,
      filterable: false,
    },
  ];

  return (
    <DataGridView
      tableId="docs-filter-search"
      columns={columns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
    />
  );
}

export function FilterActionDataGridDemo() {
  const [minAmount, setMinAmount] = useState("");
  const rows = useMemo(() => {
    const min = Number(minAmount);
    if (!minAmount.trim() || Number.isNaN(min)) {
      return DUMMY_ORDERS;
    }
    return DUMMY_ORDERS.filter((row) => row.amount >= min);
  }, [minAmount]);

  const columns: DataGridColumn<DummyOrder>[] = [
    {
      id: "orderNumber",
      label: "Order",
      width: 140,
      getValue: (row) => row.orderNumber,
      filterable: false,
    },
    {
      id: "company",
      label: "Company",
      width: 200,
      getValue: (row) => row.company,
      filterable: false,
    },
    {
      id: "amount",
      label: "Amount",
      width: 160,
      filterable: false,
      getValue: (row) => formatAmount(row.amount),
      getSortValue: (row) => String(row.amount),
      funnels: [
        createCustomFunnel({
          id: "filter-custom",
          label: "Minimum amount",
          isActive: Boolean(minAmount),
          icon: <SlidersHorizontalIcon className="size-3" />,
          renderWorkflow: ({ close }) => (
            <div className="grid gap-2">
              <p className="text-xs font-semibold">Minimum amount (USD)</p>
              <Input
                type="number"
                value={minAmount}
                onChange={(event) => setMinAmount(event.currentTarget.value)}
                placeholder="e.g. 2000"
                className="h-8"
              />
              <Button type="button" size="sm" onClick={close}>
                Done
              </Button>
            </div>
          ),
        }),
      ],
    },
  ];

  return (
    <DataGridView
      tableId="docs-filter-action"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      persist={false}
    />
  );
}
