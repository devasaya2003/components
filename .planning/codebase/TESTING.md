# Testing Patterns

**Analysis Date:** 2026-09-10

## Test Framework

**Test Runners:**
- **Unit tests** (.test.ts): Node.js built-in test runner (`node:test`)
- **Component tests** (.test.tsx): Vitest
- Both configured via npm scripts in package.json

**Assertion Libraries:**
- **Unit tests**: node:assert/strict (built-in Node.js module)
- **Component tests**: Vitest's expect + @testing-library/jest-dom matchers

**Testing Libraries:**
- @testing-library/react (v16.3.3)
- @testing-library/jest-dom (v7.0.1)
- @testing-library/user-event (v14.6.7)
- jsdom (v29.1.1) - for DOM simulation

**Run Commands:**
```bash
npm run test              # Run all tests (unit + components)
npm run test:unit        # Run Node.js unit tests only
npm run test:components  # Run vitest component tests only
```

## Vitest Configuration

**Config File:** `vitest.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.tsx"],
  },
});
```

**Key Settings:**
- environment: jsdom (for React component testing)
- globals: true (vi is globally available without imports)
- setupFiles: `./src/test-setup.ts` - imports testing-library matchers
- include: `src/**/*.test.tsx` - only vitest .tsx files

## Test File Organization

**Location:** Co-located with source files

**Naming Convention:**
- `.test.ts` - Unit tests (Node.js test runner)
- `.test.tsx` - Component tests (Vitest)

**File Structure Example:**
```
src/registry/default/data-grid/
├── modules/
│   ├── sort/
│   │   ├── compare-data-grid-sort-values.ts
│   │   ├── compare-data-grid-sort-values.test.ts  (unit test)
│   │   ├── use-data-grid-sort.ts
│   │   └── use-data-grid-sort.test.tsx            (component test)
│   ├── filters/
│   │   ├── use-data-grid-column-filters.ts
│   │   └── use-data-grid-column-filters.test.tsx
```

## Test Structure and Patterns

### Unit Tests (Node.js Test Runner)

**Pattern:** Pure function testing with node:assert

```typescript
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  compareDataGridSortValues,
  parseSortableDateValue,
} from "./compare-data-grid-sort-values";

describe("compareDataGridSortValues", () => {
  it("sorts formatted calendar dates chronologically", () => {
    assert.equal(
      compareDataGridSortValues("15 Aug 2026", "7 Sep 2026") < 0,
      true,
    );
  });

  it("sorts Date objects without calling string methods", () => {
    const earlier = new Date("2026-01-15T00:00:00.000Z");
    const later = new Date("2026-09-07T00:00:00.000Z");
    assert.equal(compareDataGridSortValues(earlier, later) < 0, true);
  });

  it("parses ISO and month-name dates", () => {
    assert.equal(parseSortableDateValue(""), null);
    assert.equal(typeof parseSortableDateValue("2026-08-15"), "number");
  });
});
```

**File:** `src/registry/default/data-grid/modules/sort/compare-data-grid-sort-values.test.ts`

### Component/Hook Tests (Vitest)

**Pattern:** React Testing Library with Vitest

```typescript
import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDataGridSort } from "./use-data-grid-sort";

describe("useDataGridSort", () => {
  it("initializes with the provided sort", () => {
    const initial = { columnId: "name", direction: "asc" };
    const { result } = renderHook(() => useDataGridSort(initial));
    expect(result.current.sort).toEqual(initial);
  });

  it("defaults to null sort", () => {
    const { result } = renderHook(() => useDataGridSort());
    expect(result.current.sort).toBeNull();
  });

  it("updates sort via setSort", () => {
    const { result } = renderHook(() => useDataGridSort());
    act(() => {
      result.current.setSort({ columnId: "age", direction: "desc" });
    });
    expect(result.current.sort).toEqual({ columnId: "age", direction: "desc" });
  });
});
```

**File:** `src/registry/default/data-grid/modules/sort/use-data-grid-sort.test.tsx`

## Hook Testing

**Framework:** @testing-library/react with renderHook

**Pattern:**
1. Import renderHook and act from @testing-library/react
2. Call renderHook with hook function
3. Access hook results via result.current
4. Wrap state updates in act()
5. Assert on result.current properties

**Example with state updates:**
```typescript
import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDataGridColumnFilters } from "./use-data-grid-column-filters";

describe("useDataGridColumnFilters", () => {
  it("sets a column filter and reports it as active", () => {
    const { result } = renderHook(() => useDataGridColumnFilters());
    
    act(() => {
      result.current.setColumnFilter("status", ["open", "done"]);
    });
    
    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.activeFilterCount).toBe(1);
    expect(result.current.columnFilters.status).toEqual(["open", "done"]);
  });
});
```

**File:** `src/registry/default/data-grid/modules/filters/use-data-grid-column-filters.test.tsx`

## Mocking

**Framework:** Vitest built-in (vi)

**Mock Functions:**
- Create with `vi.fn()`
- Assert calls with `.toHaveBeenCalled()`, `.toHaveBeenCalledWith()`, `.toHaveBeenCalledTimes()`

```typescript
it("attaches a default filter funnel to filterable columns", () => {
  const onColumnFiltersChange = vi.fn();
  const { result } = renderHook(() =>
    useDataGridFunnels({
      columns,
      rows,
      columnFilters: {},
      onColumnFiltersChange,
    }),
  );

  expect(onColumnFiltersChange).toHaveBeenCalled();
});
```

**File:** `src/registry/default/data-grid/modules/filters/use-data-grid-funnels.test.tsx`

## Async and Timer Testing

**Pattern:** Use vi.useFakeTimers() for debounced/delayed functions

```typescript
import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { DATA_GRID_SEARCH_DEBOUNCE_MS } from "./use-debounced-callback";
import { useDebouncedSearch } from "./use-debounced-search";

describe("useDebouncedSearch", () => {
  it("trims and debounces the search callback", () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedSearch(onSearch, DATA_GRID_SEARCH_DEBOUNCE_MS),
    );

    act(() => {
      result.current("  acme  ");
    });

    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(DATA_GRID_SEARCH_DEBOUNCE_MS);
    });

    expect(onSearch).toHaveBeenCalledWith("acme");
    vi.useRealTimers();
  });
});
```

**File:** `src/registry/default/data-grid/modules/search/use-debounced-search.test.tsx`

**Timer Management:**
- Start with `vi.useFakeTimers()`
- Advance time with `vi.advanceTimersByTime(ms)`
- Return to real timers with `vi.useRealTimers()`
- Always restore real timers after test (in test or cleanup)

## Test Data and Fixtures

**Pattern:** Define test data inline with TypeScript types

**Example:**
```typescript
type Row = { id: string; status: string; company: string };

const columns: DataGridColumn<Row>[] = [
  { id: "status", label: "Status", getValue: (row) => row.status },
  {
    id: "company",
    label: "Company",
    getValue: (row) => row.company,
    filterable: false,
  },
];

const rows: Row[] = [
  { id: "1", status: "open", company: "Acme" },
];

describe("useDataGridFunnels", () => {
  it("attaches a default filter funnel to filterable columns", () => {
    const onColumnFiltersChange = vi.fn();
    const { result } = renderHook(() =>
      useDataGridFunnels({
        columns,
        rows,
        columnFilters: {},
        onColumnFiltersChange,
      }),
    );
    // ...
  });
});
```

**File:** `src/registry/default/data-grid/modules/filters/use-data-grid-funnels.test.tsx`

**Location:** Test data defined at top of test file (not in separate fixture files)

## Coverage

**Requirements:** No coverage targets enforced

**View Coverage:**
- Coverage is not tracked or reported automatically
- Can be added via vitest coverage plugin if needed in future

## Test Types

### Unit Tests (.test.ts)
**Scope:** Pure functions, utilities, data transformations

**Examples:**
- `compare-data-grid-sort-values.test.ts` - sorting logic
- `format-date.test.ts` - date formatting
- `serialize-column-filters.test.ts` - serialization

**What to test:**
- Input/output transformations
- Edge cases (null, empty, invalid)
- Type conversions

### Component/Hook Tests (.test.tsx)
**Scope:** React hooks, component state, side effects

**Examples:**
- `use-data-grid-sort.test.tsx` - hook state management
- `use-data-grid-column-filters.test.tsx` - filter logic and callbacks
- `use-debounced-search.test.tsx` - debouncing behavior

**What to test:**
- Hook initialization with/without props
- State updates via callbacks
- Side effects (useMemo, useCallback)
- Event handling

## Error Testing

**Pattern:** Test error conditions without throwing

From `src/registry/default/data-grid/modules/persistence/use-data-grid-persistence.test.ts`:
```typescript
it("handles invalid stored state gracefully", () => {
  try {
    // Simulate corrupted localStorage data
    const invalidState = readDataGridPersistedState("invalid-key");
    assert.equal(invalidState, null);
  } catch {
    assert.fail("Should not throw on invalid data");
  }
});
```

## Running Tests During Development

**Watch Mode:** (Not configured in package.json, but available with Vitest)
```bash
npm run test:components -- --watch
```

**Individual Test File:**
```bash
npm run test:unit -- src/registry/default/data-grid/modules/sort/compare-data-grid-sort-values.test.ts
npm run test:components -- use-data-grid-sort
```

## Test Organization Best Practices

1. **Group related tests in describe() blocks**
2. **One assertion focus per test** (can have multiple expects if testing related)
3. **Use clear test descriptions** starting with verb: "returns", "sets", "clears", "handles"
4. **Clean up state between tests** - each test is independent
5. **Co-locate tests with source** - easier to update together
6. **Test behavior, not implementation** - describe what the function does, not how

---

*Testing analysis: 2026-09-10*
