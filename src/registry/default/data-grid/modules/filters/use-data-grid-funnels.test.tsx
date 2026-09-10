import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDataGridFunnels } from "./use-data-grid-funnels";
import type { DataGridColumn } from "../../types";

type Row = { id: string; status: string; company: string };

const columns: DataGridColumn<Row>[] = [
  { id: "status", label: "Status", getValue: (row) => row.status },
  {
    id: "company",
    label: "Company",
    getValue: (row) => row.company,
    filterable: false,
  },
  {
    id: "custom",
    label: "Custom",
    getValue: () => "",
    funnels: [
      {
        id: "filter-custom",
        label: "Custom",
        isActive: false,
        renderWorkflow: () => null,
      },
    ],
  },
];

const rows: Row[] = [
  { id: "1", status: "open", company: "Acme" },
];

describe("useDataGridFunnels", () => {
  it("attaches a default filter funnel to filterable columns", () => {
    const onColumnFiltersChange = vi.fn();
    const { result } = renderHook(() =>
      useDataGridFunnels({
        columns,
        rows,
        columnFilters: {},
        onColumnFiltersChange,
      }),
    );

    const status = result.current.columns.find((column) => column.id === "status");
    expect(status?.funnels?.some((funnel) => funnel.id === "filter")).toBe(true);
  });

  it("does not attach a default funnel when filterable is false", () => {
    const { result } = renderHook(() =>
      useDataGridFunnels({
        columns,
        rows,
        columnFilters: {},
        onColumnFiltersChange: vi.fn(),
      }),
    );

    const company = result.current.columns.find(
      (column) => column.id === "company",
    );
    expect(company?.funnels).toEqual([]);
  });

  it("does not attach a default funnel when a custom filter funnel already exists", () => {
    const { result } = renderHook(() =>
      useDataGridFunnels({
        columns,
        rows,
        columnFilters: {},
        onColumnFiltersChange: vi.fn(),
      }),
    );

    const custom = result.current.columns.find((column) => column.id === "custom");
    expect(custom?.funnels?.map((funnel) => funnel.id)).toEqual([
      "filter-custom",
    ]);
  });
});
