import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatDataGridDate } from "./format-date";

describe("formatDataGridDate", () => {
  it("returns em dash for empty string", () => {
    assert.equal(formatDataGridDate(""), "—");
  });

  it("returns em dash for em dash input", () => {
    assert.equal(formatDataGridDate("—"), "—");
  });

  it("returns em dash for whitespace-only input", () => {
    assert.equal(formatDataGridDate("   "), "—");
  });

  it("formats an ISO date string", () => {
    const result = formatDataGridDate("2026-08-15");
    assert.ok(result.includes("2026"), `expected year in "${result}"`);
    assert.ok(result.includes("Aug"), `expected month in "${result}"`);
  });

  it("returns original value for unparseable input", () => {
    assert.equal(formatDataGridDate("not-a-date"), "not-a-date");
  });

  it("formats a full ISO timestamp", () => {
    const result = formatDataGridDate("2026-08-15T10:30:00");
    assert.ok(result.includes("2026"), `expected year in "${result}"`);
  });
});
