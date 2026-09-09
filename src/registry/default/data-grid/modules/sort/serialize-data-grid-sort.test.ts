import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { serializeDataGridSort } from "./serialize-data-grid-sort";

describe("serializeDataGridSort", () => {
  it("returns empty object for null sort", () => {
    assert.deepEqual(serializeDataGridSort(null), {});
  });

  it("returns empty object for undefined sort", () => {
    assert.deepEqual(serializeDataGridSort(undefined), {});
  });

  it("serializes an ascending sort", () => {
    assert.deepEqual(serializeDataGridSort({ columnId: "name", direction: "asc" }), {
      sortBy: "name",
      sortDir: "asc",
    });
  });

  it("serializes a descending sort", () => {
    assert.deepEqual(serializeDataGridSort({ columnId: "age", direction: "desc" }), {
      sortBy: "age",
      sortDir: "desc",
    });
  });
});
