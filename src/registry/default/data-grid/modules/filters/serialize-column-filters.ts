import type { DataGridColumnFilters } from "../../types";

export function serializeColumnFilters(
  filters?: DataGridColumnFilters,
): Record<string, string | undefined> {
  if (!filters) {
    return {};
  }
  const activeEntries = Object.entries(filters).filter(
    ([, values]) => values && values.length > 0,
  );
  if (activeEntries.length === 0) {
    return {};
  }
  const cleanFilters: DataGridColumnFilters = {};
  for (const [key, values] of activeEntries) {
    cleanFilters[key] = values;
  }
  return {
    filters: JSON.stringify(cleanFilters),
  };
}
