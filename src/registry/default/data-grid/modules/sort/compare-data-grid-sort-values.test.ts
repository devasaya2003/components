import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compareDataGridSortValues } from "./compare-data-grid-sort-values";

describe("compareDataGridSortValues", () => {
  it("sorts formatted calendar dates chronologically, not by day number", () => {
    assert.equal(
      compareDataGridSortValues("15 Aug 2026", "7 Sep 2026") < 0,
      true,
    );
    assert.equal(
      compareDataGridSortValues("7 Sep 2026", "15 Aug 2026") > 0,
      true,
    );
    assert.equal(
      compareDataGridSortValues("1 Jan 2027", "31 Dec 2026") > 0,
      true,
    );
  });

  it("sorts ISO date keys chronologically", () => {
    assert.equal(
      compareDataGridSortValues("2026-08-15", "2026-09-07") < 0,
      true,
    );
  });

  it("puts missing dates after real dates in ascending order", () => {
    assert.equal(compareDataGridSortValues("—", "7 Sep 2026") > 0, true);
    assert.equal(compareDataGridSortValues("", "2026-09-07") > 0, true);
  });

  it("sorts formatted currency amounts numerically", () => {
    assert.equal(compareDataGridSortValues("₹900", "₹1,234") < 0, true);
    assert.equal(compareDataGridSortValues("₹1,234", "₹900") > 0, true);
  });

  it("sorts Date objects without calling string methods on them", () => {
    const earlier = new Date("2026-01-15T00:00:00.000Z");
    const later = new Date("2026-09-07T00:00:00.000Z");
    assert.equal(compareDataGridSortValues(earlier, later) < 0, true);
    assert.equal(compareDataGridSortValues(later, earlier) > 0, true);
  });

  it("sorts numeric values that are not strings", () => {
    assert.equal(compareDataGridSortValues(900, 1234) < 0, true);
    assert.equal(compareDataGridSortValues(null, "2026-09-07") > 0, true);
  });
});
