import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizeFilename } from "./sanitize-filename";

describe("sanitizeFilename", () => {
  it("lowercases and replaces non-alphanumerics with dashes", () => {
    assert.equal(sanitizeFilename("My Export File"), "my-export-file");
  });

  it("trims leading/trailing dashes", () => {
    assert.equal(sanitizeFilename("---abc---"), "abc");
  });

  it("returns export when result is empty", () => {
    assert.equal(sanitizeFilename("   "), "export");
    assert.equal(sanitizeFilename("!!!"), "export");
  });
});
