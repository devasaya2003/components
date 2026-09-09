import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { escapeCsvCell, neutralizeSpreadsheetFormula, toCsv } from "./csv-utils";

describe("toCsv", () => {
  it("returns empty string for no rows", () => {
    assert.equal(toCsv([]), "");
  });

  it("writes a header and rows", () => {
    const csv = toCsv([{ a: "1", b: "2" }, { a: "3", b: "4" }]);
    assert.equal(csv, "a,b\n1,2\n3,4");
  });

  it("escapes cells containing commas", () => {
    assert.equal(escapeCsvCell("a,b"), '"a,b"');
  });

  it("escapes cells containing quotes by doubling them", () => {
    assert.equal(escapeCsvCell('say "hi"'), '"say ""hi"""');
  });

  it("escapes cells containing newlines", () => {
    assert.equal(escapeCsvCell("line1\nline2"), '"line1\nline2"');
  });

  it("neutralizes spreadsheet formula prefixes", () => {
    assert.equal(neutralizeSpreadsheetFormula("=cmd"), "'=cmd");
    assert.equal(neutralizeSpreadsheetFormula("+1"), "'+1");
    assert.equal(neutralizeSpreadsheetFormula("normal"), "normal");
  });
});
