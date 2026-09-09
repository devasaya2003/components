import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { serializeColumnFilters } from "./serialize-column-filters";

describe("serializeColumnFilters", () => {
  it("returns empty object for undefined filters", () => {
    assert.deepEqual(serializeColumnFilters(undefined), {});
  });

  it("returns empty object when no active filters", () => {
    assert.deepEqual(serializeColumnFilters({}), {});
  });

  it("ignores filters with empty value arrays", () => {
    assert.deepEqual(serializeColumnFilters({ status: [] }), {});
  });

  it("serializes active filters as JSON string", () => {
    const result = serializeColumnFilters({ status: ["open", "done"] });
    assert.equal(typeof result.filters, "string");
    assert.deepEqual(JSON.parse(result.filters ?? "{}"), { status: ["open", "done"] });
  });
});
