import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  dataGridStorageKey,
  readDataGridPersistedState,
  writeDataGridPersistedState,
} from "./use-data-grid-persistence";

function stubWindow() {
  const store = new Map<string, string>();
  const storage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  } as unknown as Storage;
  return {
    localStorage: storage,
  } as unknown as Window & typeof globalThis;
}

describe("persistence", () => {
  it("builds a namespaced storage key", () => {
    assert.equal(dataGridStorageKey("orders"), "data-grid:orders");
  });

  it("returns null when nothing stored", () => {
    const original = globalThis.window;
    globalThis.window = stubWindow();
    try {
      assert.equal(readDataGridPersistedState("orders"), null);
    } finally {
      globalThis.window = original;
    }
  });

  it("round-trips a layout through write then read", () => {
    const original = globalThis.window;
    globalThis.window = stubWindow();
    try {
      writeDataGridPersistedState("orders", {
        layout: {
          visibleColumnIds: ["name"],
          columnOrder: ["name"],
          pinnedColumnIds: [],
          columnWidths: { name: 200 },
        },
      });
      const state = readDataGridPersistedState("orders");
      assert.ok(state);
      assert.deepEqual(state?.layout.visibleColumnIds, ["name"]);
      assert.equal(state?.layout.columnWidths.name, 200);
    } finally {
      globalThis.window = original;
    }
  });

  it("returns null for corrupt JSON", () => {
    const original = globalThis.window;
    const win = stubWindow();
    (win.localStorage as unknown as { setItem: (k: string, v: string) => void }).setItem("data-grid:bad", "{not json");
    globalThis.window = win;
    try {
      assert.equal(readDataGridPersistedState("bad"), null);
    } finally {
      globalThis.window = original;
    }
  });
});
