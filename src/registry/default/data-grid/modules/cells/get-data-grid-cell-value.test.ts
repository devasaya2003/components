import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDataGridColumnDisplayValue } from "./get-data-grid-cell-value";
import { SERIAL_NUMBER_COLUMN_ID } from "./serial-number-column";
import type { DataGridColumn } from "../../types";

type Row = { name: string; date: string };

describe("getDataGridColumnDisplayValue", () => {
  it("returns the serial number for serial columns", () => {
    const column: DataGridColumn<Row> = {
      id: SERIAL_NUMBER_COLUMN_ID,
      label: "S.No.",
      getValue: () => "",
    };
    assert.equal(getDataGridColumnDisplayValue(column, { name: "x", date: "" }, 3), "4");
  });

  it("returns the raw value for text columns", () => {
    const column: DataGridColumn<Row> = {
      id: "name",
      label: "Name",
      getValue: (row) => row.name,
    };
    assert.equal(getDataGridColumnDisplayValue(column, { name: "Acme", date: "" }), "Acme");
  });

  it("formats date columns via formatDataGridDate", () => {
    const column: DataGridColumn<Row> = {
      id: "date",
      label: "Date",
      valueType: "date",
      getValue: (row) => row.date,
    };
    const result = getDataGridColumnDisplayValue(column, { name: "", date: "2026-08-15" });
    assert.ok(result.includes("2026"), `expected year in "${result}"`);
  });
});
