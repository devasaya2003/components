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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DataGridView,
  EditableCell,
  TextEditorInput,
  createCustomFunnel,
  type DataGridColumn,
  type EditableCellEditorProps,
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

  const columns: DataGridColumn<DummyOrder>[] = basicOrderColumns.map(
    (column) =>
      column.id === "orderNumber"
        ? {
            ...column,
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
          }
        : column,
  );

  return (
    <DataGridView
      tableId="docs-hover-orders"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      persist={false}
    />
  );
}

const ORDER_STATUS_OPTIONS: DummyOrder["status"][] = [
  "open",
  "in_progress",
  "shipped",
  "done",
];

function StatusDropdownEditor({
  value,
  commit,
  cancel,
}: EditableCellEditorProps<DummyOrder["status"]>) {
  // Radix needs to finish closing the menu itself before we unmount it, so
  // the picked value is stashed here and only committed from onOpenChange —
  // committing straight from the item's click would force-unmount the menu
  // mid-interaction and can leave Radix's scroll lock stuck (page unscrollable).
  const pendingValueRef = useRef<DummyOrder["status"] | null>(null);

  return (
    <DropdownMenu
      defaultOpen
      onOpenChange={(open) => {
        if (open) return;
        const pending = pendingValueRef.current;
        if (pending !== null) {
          commit(pending);
        } else {
          cancel();
        }
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
            onSelect={() => {
              pendingValueRef.current = option;
            }}
          >
            {value === option ? <CheckIcon /> : null}
            {option.replace("_", " ")}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
          className="h-7 truncate rounded-sm px-1 text-[13px] hover:bg-muted"
          renderEditor={(editor) => (
            <TextEditorInput
              {...editor}
              className="h-7 rounded-sm bg-background px-1 text-[13px] ring-1 ring-ring"
            />
          )}
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
          className="h-7 truncate rounded-sm px-1 text-[13px] hover:bg-muted"
          renderDisplay={(status) => (
            <span className="capitalize">{status.replace("_", " ")}</span>
          )}
          renderEditor={(editor) => <StatusDropdownEditor {...editor} />}
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

function NotesTextarea({ value, commit, cancel }: EditableCellEditorProps<string>) {
  const [draft, setDraft] = useState(value);

  return (
    <textarea
      autoFocus
      value={draft}
      onChange={(event) => setDraft(event.currentTarget.value)}
      onBlur={() => commit(draft)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          cancel();
        }
      }}
      rows={3}
      className="w-full resize-none px-3 py-2 text-[13px] outline-none"
    />
  );
}

export function NotionStyleDataGridDemo() {
  const [notes, setNotes] = useState<Record<string, string>>({});

  const columns: DataGridColumn<DummyOrder>[] = [
    {
      id: "orderNumber",
      label: "Order",
      width: 120,
      getValue: (row) => row.orderNumber,
    },
    {
      id: "company",
      label: "Company",
      width: 180,
      getValue: (row) => row.company,
    },
    {
      id: "notes",
      label: "Notes",
      width: 380,
      interactive: true,
      filterable: false,
      cell: { wrap: true },
      getValue: (row) => notes[row.id] ?? "",
      renderCell: (row) => {
        const value = notes[row.id] ?? "";
        return (
          <EditableCell
            value={value}
            onCommit={(next) =>
              setNotes((current) => ({ ...current, [row.id]: next }))
            }
            className="w-full whitespace-pre-wrap break-words px-3 py-2 text-left text-[13px]"
            renderDisplay={(text) => (
              <span className="whitespace-pre-wrap break-words text-muted-foreground">
                {text || "Click to add notes..."}
              </span>
            )}
            renderEditor={(editor) => <NotesTextarea {...editor} />}
          />
        );
      },
    },
  ];

  return (
    <DataGridView
      tableId="docs-notion-orders"
      columns={columns}
      rows={DUMMY_ORDERS}
      getRowId={(row) => row.id}
      persist={false}
      hideToolbar
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
