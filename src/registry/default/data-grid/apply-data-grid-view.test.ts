import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyDataGridView } from "./apply-data-grid-view";
import { SERIAL_NUMBER_COLUMN_ID } from "./modules/cells/serial-number-column";
import type { DataGridColumn } from "./types";

type Row = { name: string; city: string; status: string };

const columns: DataGridColumn<Row>[] = [
  { id: SERIAL_NUMBER_COLUMN_ID, label: "S.No.", getValue: () => "" },
  { id: "name", label: "Name", getValue: (row) => row.name },
  { id: "city", label: "City", getValue: (row) => row.city },
  { id: "status", label: "Status", getValue: (row) => row.status },
];

const rows: Row[] = [
  { name: "Acme", city: "NYC", status: "open" },
  { name: "Globex", city: "LA", status: "done" },
  { name: "Initech", city: "NYC", status: "open" },
];

describe("applyDataGridView", () => {
  it("returns all rows when no view state", () => {
    const result = applyDataGridView(rows, columns, { search: "", sort: null, filters: {} });
    assert.equal(result.length, 3);
  });

  it("filters by search term across columns", () => {
    const result = applyDataGridView(rows, columns, { search: "acme", sort: null, filters: {} });
    assert.equal(result.length, 1);
    assert.equal(result[0]?.name, "Acme");
  });

  it("search is case-insensitive", () => {
    const result = applyDataGridView(rows, columns, { search: "NYC", sort: null, filters: {} });
    assert.equal(result.length, 2);
  });

  it("does not match search against the serial column", () => {
    const result = applyDataGridView(rows, columns, { search: "1", sort: null, filters: {} });
    assert.equal(result.length, 0);
  });

  it("filters by column filter values", () => {
    const result = applyDataGridView(rows, columns, {
      search: "",
      sort: null,
      filters: { status: ["open"] },
    });
    assert.equal(result.length, 2);
  });

  it("combines search and filters", () => {
    const result = applyDataGridView(rows, columns, {
      search: "nyc",
      sort: null,
      filters: { status: ["open"] },
    });
    assert.equal(result.length, 2);
  });

  it("sorts ascending by a column", () => {
    const result = applyDataGridView(rows, columns, {
      search: "",
      sort: { columnId: "name", direction: "asc" },
      filters: {},
    });
    assert.equal(result[0]?.name, "Acme");
    assert.equal(result[2]?.name, "Initech");
  });

  it("sorts descending by a column", () => {
    const result = applyDataGridView(rows, columns, {
      search: "",
      sort: { columnId: "name", direction: "desc" },
      filters: {},
    });
    assert.equal(result[0]?.name, "Initech");
  });

  it("skips client search when option set", () => {
    const result = applyDataGridView(rows, columns, { search: "acme", sort: null, filters: {} }, {
      skipClientSearch: true,
    });
    assert.equal(result.length, 3);
  });

  it("skips client filters when option set", () => {
    const result = applyDataGridView(rows, columns, {
      search: "",
      sort: null,
      filters: { status: ["open"] },
    }, { skipClientFilters: true });
    assert.equal(result.length, 3);
  });
});
