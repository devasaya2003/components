import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildDataGridExportRows } from "./export-data-grid";
import { SERIAL_NUMBER_COLUMN_ID } from "../cells/serial-number-column";
import type { DataGridColumn } from "../../types";

type Row = { name: string; city: string };

const columns: DataGridColumn<Row>[] = [
  { id: SERIAL_NUMBER_COLUMN_ID, label: "S.No.", getValue: () => "" },
  { id: "name", label: "Name", getValue: (row) => row.name },
  { id: "city", label: "City", getValue: (row) => row.city },
];

describe("buildDataGridExportRows", () => {
  it("builds one record per row with column labels as keys", () => {
    const rows = buildDataGridExportRows({
      columns,
      rows: [{ name: "Acme", city: "NYC" }],
    });
    assert.equal(rows.length, 1);
    assert.equal(rows[0]?.Name, "Acme");
    assert.equal(rows[0]?.City, "NYC");
  });

  it("uses serial numbers for the serial column", () => {
    const rows = buildDataGridExportRows({
      columns,
      rows: [{ name: "A", city: "X" }, { name: "B", city: "Y" }],
    });
    assert.equal(rows[0]?.["S.No."], "1");
    assert.equal(rows[1]?.["S.No."], "2");
  });
});
