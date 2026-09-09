import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  deriveOrderedColumns,
  resolveVisibleColumnIds,
} from "./derive-ordered-columns";
import { SERIAL_NUMBER_COLUMN_ID } from "../cells/serial-number-column";
import type { DataGridColumn } from "../../types";

type Row = Record<string, unknown>;

const cols: DataGridColumn<Row>[] = [
  { id: SERIAL_NUMBER_COLUMN_ID, label: "S.No.", getValue: () => "" },
  { id: "name", label: "Name", getValue: () => "" },
  { id: "city", label: "City", getValue: () => "" },
];

describe("resolveVisibleColumnIds", () => {
  it("returns all column ids when nothing stored", () => {
    const result = resolveVisibleColumnIds({ columns: cols, storedVisibleColumnIds: [] });
    assert.deepEqual(result, [SERIAL_NUMBER_COLUMN_ID, "name", "city"]);
  });

  it("filters stored ids to available columns and prepends serial", () => {
    const result = resolveVisibleColumnIds({
      columns: cols,
      storedVisibleColumnIds: ["name", "missing"],
    });
    assert.deepEqual(result, [SERIAL_NUMBER_COLUMN_ID, "name"]);
  });

  it("prepends serial column when missing from stored ids", () => {
    const result = resolveVisibleColumnIds({
      columns: cols,
      storedVisibleColumnIds: ["name"],
    });
    assert.equal(result[0], SERIAL_NUMBER_COLUMN_ID);
  });
});

describe("deriveOrderedColumns", () => {
  it("places serial column first, then pinned, then unpinned", () => {
    const ordered = deriveOrderedColumns({
      columns: cols,
      visibleColumnIds: [SERIAL_NUMBER_COLUMN_ID, "name", "city"],
      columnOrder: [],
      pinnedColumnIds: ["city"],
    });
    assert.equal(ordered[0]?.id, SERIAL_NUMBER_COLUMN_ID);
    assert.equal(ordered[1]?.id, "city");
    assert.equal(ordered[2]?.id, "name");
  });

  it("respects a custom column order", () => {
    const ordered = deriveOrderedColumns({
      columns: cols,
      visibleColumnIds: [SERIAL_NUMBER_COLUMN_ID, "name", "city"],
      columnOrder: ["city", "name", SERIAL_NUMBER_COLUMN_ID],
      pinnedColumnIds: [],
    });
    assert.equal(ordered[0]?.id, SERIAL_NUMBER_COLUMN_ID);
    assert.equal(ordered[1]?.id, "city");
    assert.equal(ordered[2]?.id, "name");
  });
});
