import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import {
  createCustomFunnel,
  createFilterFunnel,
  createSearchFilterFunnel,
} from "./filter-funnel-factories";
import type { DataGridColumn } from "../../../types";

type Row = { status: string };

const column: DataGridColumn<Row> = {
  id: "status",
  label: "Status",
  getValue: (row) => row.status,
};

describe("filter funnel factories", () => {
  it("createFilterFunnel reports active when values are selected", () => {
    const funnel = createFilterFunnel<Row>({
      rows: [],
      selectedValues: ["open"],
      onFilterChange: () => {},
    });
    expect(funnel.id).toBe("filter");
    expect(funnel.isActive).toBe(true);
  });

  it("createFilterFunnel reports inactive when no values selected", () => {
    const funnel = createFilterFunnel<Row>({
      rows: [],
      selectedValues: [],
      onFilterChange: () => {},
    });
    expect(funnel.isActive).toBe(false);
  });

  it("createSearchFilterFunnel uses a distinct id", () => {
    const funnel = createSearchFilterFunnel<Row>({
      rows: [],
      selectedValues: [],
      onFilterChange: () => {},
    });
    expect(funnel.id).toBe("filter-search");
    expect(funnel.label).toBe("Search filter");
  });

  it("createCustomFunnel passes the funnel through unchanged", () => {
    const custom = {
      id: "custom",
      label: "Custom",
      isActive: false,
      renderWorkflow: () => null,
    };
    expect(createCustomFunnel<Row>(custom)).toBe(custom);
  });

  it("renders a workflow that returns content", () => {
    const funnel = createFilterFunnel<Row>({
      rows: [{ status: "open" }],
      selectedValues: [],
      onFilterChange: () => {},
    });
    const { container } = render(
      <div>{funnel.renderWorkflow({ column, close: () => {} })}</div>,
    );
    expect(container.textContent).toContain("Status");
  });
});
