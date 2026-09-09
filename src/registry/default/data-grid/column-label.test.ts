import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractTextFromReactNode, getColumnLabelString } from "./column-label";

describe("extractTextFromReactNode", () => {
  it("returns empty string for null/undefined/boolean", () => {
    assert.equal(extractTextFromReactNode(null), "");
    assert.equal(extractTextFromReactNode(undefined), "");
    assert.equal(extractTextFromReactNode(true), "");
  });

  it("returns string/number as string", () => {
    assert.equal(extractTextFromReactNode("hello"), "hello");
    assert.equal(extractTextFromReactNode(42), "42");
  });

  it("joins arrays with spaces", () => {
    assert.equal(extractTextFromReactNode(["a", "b", "c"]), "a b c");
  });

  it("extracts text from an element-like object with props.children", () => {
    const node = { props: { children: "Label" } };
    assert.equal(extractTextFromReactNode(node), "Label");
  });
});

describe("getColumnLabelString", () => {
  it("returns the extracted text when present", () => {
    assert.equal(getColumnLabelString({ id: "x", label: "Company" }), "Company");
  });

  it("falls back to id when label is empty", () => {
    assert.equal(getColumnLabelString({ id: "x", label: "" }), "x");
  });
});
