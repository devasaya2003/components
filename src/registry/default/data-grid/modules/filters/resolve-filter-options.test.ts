import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterOptionsBySearch,
  resolveFilterOptions,
} from "./resolve-filter-options";
import type { DataGridColumn } from "../../types";

type Row = { status: string; date: string };

describe("resolveFilterOptions", () => {
  it("returns async options when getFilterOptions is set", () => {
    const column: DataGridColumn<Row> = {
      id: "status",
      label: "Status",
      getValue: (row) => row.status,
      getFilterOptions: () => [{ value: "open", label: "Open" }],
    };
    const result = resolveFilterOptions({
      column,
      rows: [],
      asyncOptions: [{ value: "open", label: "Open" }],
    });
    assert.deepEqual(result, [{ value: "open", label: "Open" }]);
  });

  it("returns static filterOptions array", () => {
    const column: DataGridColumn<Row> = {
      id: "status",
      label: "Status",
      getValue: (row) => row.status,
      filterOptions: [{ value: "open", label: "Open" }],
    };
    const result = resolveFilterOptions({ column, rows: [], asyncOptions: null });
    assert.deepEqual(result, [{ value: "open", label: "Open" }]);
  });

  it("derives unique values from rows when no options configured", () => {
    const column: DataGridColumn<Row> = {
      id: "status",
      label: "Status",
      getValue: (row) => row.status,
    };
    const result = resolveFilterOptions({
      column,
      rows: [{ status: "open", date: "" }, { status: "done", date: "" }, { status: "open", date: "" }],
      asyncOptions: null,
    });
    assert.equal(result.length, 2);
    assert.ok(result.some((opt) => opt.value === "open"));
    assert.ok(result.some((opt) => opt.value === "done"));
  });

  it("formats date-derived options", () => {
    const column: DataGridColumn<Row> = {
      id: "date",
      label: "Date",
      valueType: "date",
      getValue: (row) => row.date,
    };
    const result = resolveFilterOptions({
      column,
      rows: [{ status: "", date: "2026-08-15" }],
      asyncOptions: null,
    });
    assert.ok(result[0]?.label.includes("2026"), `expected year in "${result[0]?.label}"`);
  });
});

describe("filterOptionsBySearch", () => {
  const options = [
    { value: "open", label: "Open" },
    { value: "done", label: "Done" },
  ];

  it("returns all options when search is empty", () => {
    assert.equal(filterOptionsBySearch(options, "").length, 2);
  });

  it("filters by label case-insensitively", () => {
    assert.equal(filterOptionsBySearch(options, "op").length, 1);
    assert.equal(filterOptionsBySearch(options, "op")[0]?.value, "open");
  });

  it("filters by value", () => {
    assert.equal(filterOptionsBySearch(options, "done").length, 1);
  });
});
