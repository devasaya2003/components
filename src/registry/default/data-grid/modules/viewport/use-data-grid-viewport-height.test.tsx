import { describe, expect, it, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { useDataGridViewportHeight } from "./use-data-grid-viewport-height";

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

function Probe({ hook }: { hook: () => ReturnType<typeof useDataGridViewportHeight> }) {
  const { sentinelRef, layout, estimatedHeight } = hook();
  return (
    <div>
      <div ref={sentinelRef} data-testid="sentinel" />
      <span data-testid="layout">{layout ? "measured" : "pending"}</span>
      <span data-testid="estimated">{estimatedHeight}</span>
    </div>
  );
}

describe("useDataGridViewportHeight", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
  });

  it("exposes a sentinel ref and an estimated height string", () => {
    const { getByTestId } = render(
      <Probe hook={() => useDataGridViewportHeight()} />,
    );
    expect(getByTestId("sentinel")).toBeDefined();
    expect(getByTestId("estimated").textContent).toContain("dvh");
  });

  it("measures a layout after the sentinel mounts", () => {
    const { getByTestId } = render(
      <Probe hook={() => useDataGridViewportHeight()} />,
    );
    expect(getByTestId("layout").textContent).toBe("measured");
  });

  it("can be disabled", () => {
    const { getByTestId } = render(
      <Probe hook={() => useDataGridViewportHeight(false)} />,
    );
    expect(getByTestId("layout").textContent).toBe("pending");
  });
});