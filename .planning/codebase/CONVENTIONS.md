# Coding Conventions

**Analysis Date:** 2026-09-10

## Naming Patterns

**Files:**
- PascalCase for React components: `DataGrid.tsx`, `FilterFunnelContent.tsx`
- camelCase for utilities, hooks, and helpers: `use-data-grid-sort.ts`, `compare-data-grid-sort-values.ts`
- CONSTANT_CASE for module-level constants: `EMPTY_SORT_VALUES`, `ISO_DATE_PREFIX`, `SKELETON_ROWS`
- Use hyphens in file paths for multi-word names

**Functions:**
- camelCase for all function names: `toSortComparableString()`, `compareDataGridSortValues()`
- Prefix React hooks with `use`: `useDataGridSort()`, `useDebouncedSearch()`
- Prefix helper functions with verb: `parseSort()`, `resolveFilterOptions()`
- Prefix type guards with `is`: `isEmptySortValue()`, `isRecord()`

**Variables:**
- camelCase for all variables: `columnFilters`, `hasActiveFilters`, `activeFilterCount`
- Use descriptive names for state: `uncontrolledWidths`, `containerWidth`
- Single letter variables reserved for loops/callbacks: `key`, `value` in Object.entries()

**Types:**
- PascalCase for type names: `DataGridColumn<TData>`, `DataGridPersistedState`, `FilterFunnelContentProps<TData>`
- Use generics with `TData` for type parameters
- Suffix prop types with `Props`: `DataGridViewProps<TData>`
- Suffix type objects with descriptive names: `DataGridColumnLayoutState`, `DataGridColumnFilters`
- Export types from same file as implementation or via barrel exports

## Code Style

**Formatting:**
- Oxlint (configured in package.json as `npm run lint`)
- No explicit prettier config; follows ESM/React best practices
- 2-space indentation (inferred from project setup)

**Linting:**
- Tool: oxlint
- Run command: `npm run lint`
- Enforced rules:
  - `noUnusedLocals` - prevent unused variables
  - `noUnusedParameters` - prevent unused function parameters
  - `noFallthroughCasesInSwitch` - require break in switch cases
  - `erasableSyntaxOnly` - remove runtime/unused declarations

**Module Syntax:**
- ECMAScript modules only
- `verbatimModuleSyntax` enforced: `import type { }` for types, `import { }` for values
- Target: es2023

## Import Organization

**Order:**
1. React and React-related imports
2. External library imports (lucide-react, class-variance-authority, etc.)
3. Internal components from `@/` alias
4. Internal utilities from `@/lib` or `@/utils`
5. Relative imports from parent/sibling directories
6. Type imports separated with `import type { }`

**Examples:**

From `src/registry/default/data-grid/modules/filters/funnels/filter-funnel.tsx`:
```typescript
"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getColumnLabelString } from "../../../column-label";
import type {
  DataGridColumn,
  DataGridColumnFilterOption,
} from "../../../types";
import { DATA_GRID_SEARCH_DEBOUNCE_MS } from "../../search/use-debounced-callback";
```

**Path Aliases:**
- `@/*` resolves to `./src/*` (configured in tsconfig.json)

## Client Components

**"use client" Directive:**
- Required at the top of all components that use React hooks
- Placed before any imports
- Used in: data-grid components, hooks that use state/effects, UI components

Example from `src/registry/default/data-grid/data-grid-view.tsx`:
```typescript
"use client";

import { type CSSProperties, type ReactNode } from "react";
```

## Error Handling

**Patterns:**
- Silent try/catch for non-critical operations: parse failures, localStorage access
- Return null or empty object as default on error
- No error logging for expected failures

Example from `src/registry/default/data-grid/modules/persistence/use-data-grid-persistence.ts`:
```typescript
export function readDataGridPersistedState(tableId: string): DataGridPersistedState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(dataGridStorageKey(tableId));
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    // ... validation logic
  } catch {
    return null;
  }
}
```

**localStorage Errors:**
- Wrap in try/catch, silently ignore quota or private-mode failures
- Never throw on user-facing failures

## Logging

**Framework:** No logging framework used; console logging not observed in codebase

**Best Practices:**
- Avoid console logging in production code
- No logging infrastructure required for this component library

## Comments and Documentation

**When to Comment:**
- JSDoc for exported functions and hooks
- Inline comments for complex logic or non-obvious decisions
- Comments explaining business logic or workarounds

**JSDoc/TSDoc Usage:**
- Required for exported functions
- Optional parameters documented
- Return type documented for non-obvious cases

Example from `src/registry/default/data-grid/modules/sort/compare-data-grid-sort-values.ts`:
```typescript
/** Grid cells sometimes return Date/number at runtime even when typed as string. */
export function toSortComparableString(value: unknown): string {
  // ...
}

/** Calendar / timestamp instant for sorting, or null if the value is not a date. */
export function parseSortableDateValue(value: string): number | null {
  // ...
}
```

Example from `src/registry/default/data-grid/data-grid-view.tsx`:
```typescript
/**
 * Debounced (~250ms) search callback for API-backed lists.
 * When set, client-side search is skipped.
 */
onSearch?: (search: string) => void;
```

## Function Design

**Size:** Functions should be focused and under 50 lines when possible
- Helper functions extract common logic: `omitColumnFilter()`, `parseSort()`
- Component functions may be longer due to render logic

**Parameters:**
- Destructure props in component function parameters
- Use object parameters for functions with 3+ arguments
- Use defaults for optional parameters: `delay: number = DATA_GRID_SEARCH_DEBOUNCE_MS`

Example from `src/registry/default/data-grid/modules/filters/use-data-grid-column-filters.ts`:
```typescript
export function useDataGridColumnFilters(
  initialFilters: DataGridColumnFilters = {},
) {
  // ...
}
```

**Return Values:**
- Return objects with descriptive keys for hook returns
- Use null for missing values rather than undefined
- Memoize computed returns with useMemo

Example from `src/registry/default/data-grid/modules/filters/use-data-grid-column-filters.ts`:
```typescript
return {
  columnFilters,
  setColumnFilters,
  setColumnFilter,
  clearColumnFilter,
  clearAllFilters,
  hasActiveFilters,
  activeFilterCount,
  toQueryParams,
};
```

## Module Design

**Exports:**
- Each module exports one primary function or component
- Additional exports for types and utilities in same file
- Barrel exports from index files for public API

Example from `src/registry/default/data-grid/modules/filters/use-data-grid-column-filters.ts`:
```typescript
export function useDataGridColumnFilters(initialFilters: DataGridColumnFilters = {}) {
  // ...
}

export { serializeColumnFilters } from "./serialize-column-filters";
```

**Barrel Files:**
- Main index file: `src/registry/default/data-grid/index.ts`
- Exports all public functions, hooks, and types
- No barrel files in subdirectories (modules export directly)

## Performance Patterns

**useCallback:**
- Wrap callback handlers to prevent unnecessary re-renders
- Always include dependencies array

Example from `src/registry/default/data-grid/modules/filters/use-data-grid-column-filters.ts`:
```typescript
const setColumnFilter = useCallback(
  (columnId: string, selectedValues: string[]) => {
    setColumnFilters((current) => {
      if (selectedValues.length === 0) {
        return omitColumnFilter(current, columnId);
      }
      return {
        ...current,
        [columnId]: selectedValues,
      };
    });
  },
  [],
);
```

**useMemo:**
- Memoize expensive computations like filtering/counting

Example:
```typescript
const activeFilterCount = useMemo(() => {
  return Object.keys(columnFilters).filter(
    (key) => (columnFilters[key]?.length ?? 0) > 0,
  ).length;
}, [columnFilters]);
```

## Controlled vs Uncontrolled Components

**Pattern:**
- Check for `controlledProp !== undefined`
- Use internal state as fallback

Example from `src/registry/default/data-grid/data-grid.tsx`:
```typescript
const isControlled = controlledColumnWidths !== undefined;
const storedWidths = isControlled
  ? controlledColumnWidths
  : uncontrolledWidths;
```

## Type Safety

**Generic Types:**
- Use `<TData>` for generic row/data types in components
- Always define type for generic parameters

Example:
```typescript
export function DataGrid<TData>({
  columns: DataGridColumn<TData>[],
  rows: TData[],
  getRowId: (row: TData) => string,
}: DataGridProps<TData>)
```

---

*Convention analysis: 2026-09-10*
