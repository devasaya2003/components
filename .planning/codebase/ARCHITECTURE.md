# Architecture

**Analysis Date:** 2026-09-10

## Pattern Overview

**Overall:** Modular Component Library with Feature-Based Layering

**Key Characteristics:**
- Composable multi-layer architecture: presentation layer (DataGridView) orchestrates modular features
- Feature modules are self-contained and implement single concerns (fields, filters, sort, search, export)
- State management through React hooks with optional persistence to localStorage
- Type-safe column and row abstractions with generic type parameters
- Client-side and server-side processing modes with skip flags for delegating operations

## Layers

**Presentation Layer (Components):**
- Purpose: React components for user interaction and display
- Location: `src/components/ui/` (base UI components), `src/registry/default/data-grid/` (data grid components)
- Contains: DataGridView (orchestrator), DataGrid (table), DataGridToolbar (controls), specialized UI components
- Depends on: Module layer, type layer, utility layer
- Used by: Page components in `src/pages/`, documentation pages, examples

**Module Layer (Features):**
- Purpose: Implement individual data grid features as reusable, testable modules
- Location: `src/registry/default/data-grid/modules/`
- Contains: Separate modules for fields, filters, sort, search, persistence, export, cells, viewport, resize
- Each module exports hooks and utility functions for a specific feature
- Depends on: Types layer, some cross-module dependencies (e.g., cells used by multiple modules)
- Used by: DataGridView orchestrator, other modules, examples

**Type Layer:**
- Purpose: Define all data structures and column schema contracts
- Location: `src/registry/default/data-grid/types.ts`
- Contains: DataGridColumn<TData>, DataGridViewState, DataGridSort, DataGridColumnFilters, DataGridFunnel
- Depends on: React types only
- Used by: All layers above

**Utility Layer:**
- Purpose: Shared functions for data transformation, validation, and common operations
- Location: `src/lib/utils.ts` (global), `src/registry/default/data-grid/apply-data-grid-view.ts` (domain-specific)
- Contains: applyDataGridView (orchestrates search/filter/sort), renderDataGridCell, formatDataGridDate, column-label helpers
- Depends on: Types, modules
- Used by: Presentation and module layers

**UI Foundation Layer:**
- Purpose: Low-level UI primitives from Radix UI wrapped with Tailwind styling
- Location: `src/components/ui/`
- Contains: Button, Input, Dropdown, Tooltip, Badge, Checkbox, Popover, Skeleton
- Depends on: Radix UI, class-variance-authority for styling
- Used by: Data grid and toolbar components

## Data Flow

**View Initialization Flow:**

1. DataGridView receives `columns`, `rows`, `tableId`, and optional handlers
2. `useDataGridInitialBehavior` hook establishes initial search/sort/filter state
3. `readDataGridPersistedState` loads user's saved layout and view preferences from localStorage
4. `useDataGridColumns` merges persisted layout with current columns, derives visible/ordered columns
5. DataGridToolbar and DataGrid receive processed columns and initialized state handlers

**User Interaction Flow (Search Example):**

1. User types in ToolbarSearch
2. `handleSearchChange` in DataGridView updates internal search state
3. If `serverSearch` enabled, `useDebouncedSearch` notifies parent via `onSearch` callback
4. If client-side, rows flow through `applyDataGridView` filtering immediately
5. Column-level funnels trigger `useDataGridFunnels` to update column state
6. Re-render with filtered/searched visible rows

**Column Filter Flow:**

1. Column header shows funnel icons if `column.funnels` defined
2. Click funnel triggers DataGridFunnelTrigger, which renders funnel workflow
3. Filter selection updates via `setColumnFilter` in DataGridView
4. If `onColumnFiltersChange` provided, delegates to parent (server filtering)
5. Otherwise applies filters via `applyDataGridView`
6. `useDataGridFunnels` re-evaluates filter options based on current rows

**Column Resize Flow:**

1. User drags resize handle in header
2. `useColumnResize` tracks draft width during drag
3. Applies clamped width (MIN_COLUMN_WIDTH to clamped max)
4. On pointer up, calls `onColumnWidthChange` callback
5. `useDataGridColumns` persists width to layout state
6. Next render reflects resized column

**State Management Strategy:**

- **View State (search, sort, filters)**: Managed by DataGridView via `useDataGridInitialBehavior`, optionally persisted to localStorage if `persistViewState: true`
- **Layout State (column order, visibility, widths)**: Managed by `useDataGridColumns`, always persisted to localStorage if `persist: true`
- **Controlled vs Uncontrolled**: DataGridView supports controlled columns/filters/sort via props (onColumnFiltersChange, onSortChange, sort) to delegate to parent; uncontrolled defaults to internal state
- **Virtualization State**: Managed by `DataGridVirtualizedRows` using `@tanstack/react-virtual` with ResizeObserver for scroll container dimensions

## Key Abstractions

**DataGridColumn<TData>:**
- Purpose: Describes a table column schema with rendering, filtering, sorting metadata
- File: `src/registry/default/data-grid/types.ts`
- Properties: id, label, width, getValue, getSortValue, renderCell, interactive, funnels, filterOptions
- Pattern: Encapsulates all column configuration; generic TData ensures type safety

**DataGridFunnel<TData>:**
- Purpose: Pluggable filter UI workflow for a column
- File: `src/registry/default/data-grid/types.ts`
- Contains: id, icon, label, isActive state, renderWorkflow function
- Pattern: Renders dynamic filter UI; can be list-filter (built-in), search-filter, or custom workflows

**DataGridViewState:**
- Purpose: Complete state snapshot of search, sort, filters applied to rows
- File: `src/registry/default/data-grid/types.ts`
- Pattern: Serializable, suitable for localStorage or URL params; passed to applyDataGridView

**applyDataGridView Function:**
- Purpose: Pure function applying search/filter/sort to in-memory rows
- File: `src/registry/default/data-grid/apply-data-grid-view.ts`
- Logic: Sequential filtering (search → column filters → sort), respects skip flags for server delegation
- Pattern: No side effects; safe to call per render

## Entry Points

**Main Application Entry:**
- Location: `src/main.tsx`
- Triggers: Initial DOM mount
- Responsibilities: Sets up React Router, TooltipProvider, renders route hierarchy

**DataGridView Component:**
- Location: `src/registry/default/data-grid/data-grid-view.tsx`
- Triggers: When data table UI needed with toolbar and features
- Responsibilities: Orchestrates all modules, manages view state, delegates to DataGrid + toolbar

**DataGrid Component:**
- Location: `src/registry/default/data-grid/data-grid.tsx`
- Triggers: Called by DataGridView with processed columns and rows
- Responsibilities: Renders table header, rows (virtualized or not), handles column resizing and interactions

## Error Handling

**Strategy:** Graceful degradation with silent failures where possible, validation at boundaries

**Patterns:**
- `readDataGridPersistedState`: Catches JSON.parse and localStorage errors, returns null on failure
- `applyDataGridView`: Silently skips missing columns or invalid filter values
- Filter option resolution: Catches async promises, returns empty array if rejected
- Column sorting: Falls back to getValue if getSortValue not provided
- Cell rendering: Returns empty string if getValue throws

## Cross-Cutting Concerns

**Logging:** Console-based logging for development; no production logging framework configured

**Validation:**
- Column IDs must be unique within a table
- Column widths clamped between MIN_COLUMN_WIDTH (64px) and reasonable max
- Filter values must match getValue output type (string comparison)
- Sort values default to column getValue if getSortValue not provided

**Authentication:** Not applicable; data grid is presentation layer only

**Persistence:** localStorage with key format `data-grid:{tableId}`, stores layout and optional view state as JSON

**Virtualization:** Uses `@tanstack/react-virtual` with ResizeObserver for container width, customizable overscan (12 rows default)

---

*Architecture analysis: 2026-09-10*
