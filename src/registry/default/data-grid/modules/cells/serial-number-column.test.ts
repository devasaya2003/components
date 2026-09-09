import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createSerialNumberColumn,
  getSerialNumberValue,
  isSerialNumberColumn,
  isUnsortableColumn,
  SERIAL_NUMBER_COLUMN_ID,
} from "./serial-number-column";

describe("serial-number-column", () => {
  it("exposes a stable serial column id", () => {
    assert.equal(SERIAL_NUMBER_COLUMN_ID, "__serialNumber");
  });

  it("creates a column with the serial id and disabled filtering", () => {
    const column = createSerialNumberColumn();
    assert.equal(column.id, SERIAL_NUMBER_COLUMN_ID);
    assert.equal(column.filterable, false);
    assert.equal(column.getValue(), "");
  });

  it("identifies serial number columns", () => {
    assert.equal(isSerialNumberColumn(SERIAL_NUMBER_COLUMN_ID), true);
    assert.equal(isSerialNumberColumn("company"), false);
  });

  it("treats serial, selected, action, actions as unsortable", () => {
    assert.equal(isUnsortableColumn(SERIAL_NUMBER_COLUMN_ID), true);
    assert.equal(isUnsortableColumn("selected"), true);
    assert.equal(isUnsortableColumn("action"), true);
    assert.equal(isUnsortableColumn("actions"), true);
    assert.equal(isUnsortableColumn("company"), false);
  });

  it("returns 1-indexed serial numbers", () => {
    assert.equal(getSerialNumberValue(0), "1");
    assert.equal(getSerialNumberValue(4), "5");
  });
});
