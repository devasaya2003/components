# Codebase Structure

**Analysis Date:** 2026-09-10

## Directory Layout

```
components/
├── src/
│   ├── components/              # React UI components
│   │   ├── ui/                  # Base UI primitives (Radix UI + Tailwind)
│   │   └── docs/                # Documentation layout and page blocks
│   ├── lib/                      # Shared utilities (utils.ts with cn helper)
│   ├── pages/                    # Page components (docs pages, home)
│   │   └── docs/                # Doc pages (data-grid-overview, etc.)
│   ├── registry/                # Component registry structure
│   │   └── default/             # Default theme/set
│   │       ├── data-grid/       # Core data-grid component and modules
│   │       │   ├── modules/     # Feature modules (fields, filters, sort, etc.)
│   │       │   │   ├── cells/
│   │       │   │   ├── export/
│   │       │   │   ├── fields/
│   │       │   │   ├── filters/
│   │       │   │   │   └── funnels/
│   │       │   │   ├── initial-behavior/
│   │       │   │   ├── persistence/
│   │       │   │   ├── resize/
│   │       │   │   ├── search/
│   │       │   │   ├── sort/
│   │       │   │   ├── toolbar/
│   │       │   │   └── viewport/
│   │       │   ├── types.ts     # Type definitions
│   │       │   ├── data-grid.tsx # Core table component
│   │       │   ├── data-grid-view.tsx # Full-featured wrapper
│   │       │   └── index.ts     # Public exports
│   │       └── examples/        # Example implementations
│   │           └── data-grid/   # Data grid examples
│   ├── assets/                  # Static assets
│   ├── index.css                # Global CSS
│   ├── main.tsx                 # Application entry point
│   └── test-setup.ts            # Test configuration
├── public/                       # Static files for dev/build
├── .planning/                    # GSD planning documents
│   └── codebase/                # Codebase analysis documents
├── dist/                         # Build output (generated)
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript base config
├── tsconfig.app.json            # App-specific TypeScript config
├── tsconfig.node.json           # Node/build TypeScript config
├── vite.config.ts               # Vite build config
├── vitest.config.ts             # Vitest test config
└── components.json              # Component registry metadata
```

## Directory Purposes

**src/components/ui/:**
- Purpose: Low-level UI primitives
- Contains: Button, Input, Badge, Dropdown, Tooltip, Checkbox, Popover, Skeleton
- Built with: Radix UI + Tailwind CSS + class-variance-authority
- Key files: `src/components/ui/button.tsx`, `src/components/ui/dropdown-menu.tsx`

**src/components/docs/:**
- Purpose: Layout and page structure for documentation site
- Contains: DocsLayout (page layout), PageBlocks (content components)
- Key files: `src/components/docs/docs-layout.tsx`

**src/registry/default/data-grid/:**
- Purpose: Core data grid component and module system
- Contains: Main DataGrid and DataGridView components, module system
- Key files: `src/registry/default/data-grid/data-grid.tsx`, `src/registry/default/data-grid/data-grid-view.tsx`, `src/registry/default/data-grid/types.ts`

**src/registry/default/data-grid/modules/:**
- Purpose: Feature modules implementing individual concerns
- Structure: Each module (fields, filters, sort, etc.) is a directory with hooks and utilities

**src/registry/default/data-grid/modules/cells/:**
- Purpose: Cell rendering and specialized cell types
- Contains: Text cells, date formatting, badge cells, serial number column, text editor
- Key functions: `renderDataGridCell()`, `formatDataGridDate()`, `getDataGridColumnDisplayValue()`

**src/registry/default/data-grid/modules/export/:**
- Purpose: Data export functionality
- Contains: CSV export, text download utilities
- Key functions: `exportDataGridCsv()`, `buildDataGridExportRows()`, `toCsv()`

**src/registry/default/data-grid/modules/fields/:**
- Purpose: Column visibility, ordering, pinning, width management
- Contains: useDataGridColumns hook, column derivation logic
- Key functions: `useDataGridColumns()`, `deriveOrderedColumns()`, `resolveVisibleColumnIds()`

**src/registry/default/data-grid/modules/filters/:**
- Purpose: Column filtering and filter UI workflows (funnels)
- Contains: Filter state management, funnel rendering, filter option resolution
- Key hooks: `useDataGridColumnFilters()`, `useDataGridFunnels()`
- Subdirectory `funnels/`: Factory functions for creating filter workflows

**src/registry/default/data-grid/modules/initial-behavior/:**
- Purpose: Initialize search/sort/filter state from props or defaults
- Key hook: `useDataGridInitialBehavior()`

**src/registry/default/data-grid/modules/persistence/:**
- Purpose: Save/load layout and view state to/from localStorage
- Contains: Serialization logic, parsing, storage key generation
- Key functions: `readDataGridPersistedState()`, `writeDataGridPersistedState()`

**src/registry/default/data-grid/modules/resize/:**
- Purpose: Column resizing interaction and width clamping
- Key functions: `useColumnResize()`, `clampColumnWidth()`

**src/registry/default/data-grid/modules/search/:**
- Purpose: Debounced search input handling
- Key hooks: `useDebouncedSearch()`, `useDebouncedCallback()`
- Constant: `DATA_GRID_SEARCH_DEBOUNCE_MS` (250ms)

**src/registry/default/data-grid/modules/sort/:**
- Purpose: Column sorting and sort value comparison
- Key hooks: `useDataGridSort()`
- Key functions: `compareDataGridSortValues()`, `serializeDataGridSort()`

**src/registry/default/data-grid/modules/toolbar/:**
- Purpose: Toolbar UI with search, fields menu, pin menu, sort menu, export button
- Contains: DataGridToolbar orchestrator, individual menu components
- Key components: `DataGridToolbar`, `ToolbarSearch`, `ToolbarFieldsMenu`, `ToolbarPinMenu`, `ToolbarSortMenu`, `ToolbarExportButton`

**src/registry/default/data-grid/modules/viewport/:**
- Purpose: Viewport height calculation for fillViewport feature
- Key hook: `useDataGridViewportHeight()`

**src/registry/default/examples/data-grid/:**
- Purpose: Example implementations showing different data grid features
- Key files: `basic-demo.tsx` (basic usage), `advanced-demo.tsx` (inline edit, hover actions), `modules-demo.tsx` (feature showcase), `persistent-demo.tsx` (persistence)

**src/pages/:**
- Purpose: Application pages (home and docs)
- Key files: `src/pages/home-page.tsx`, `src/pages/docs/data-grid-overview.tsx`

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React Router setup, TooltipProvider wrapper, route definitions
- `src/registry/default/data-grid/index.ts`: Public API exports for data grid module
- `src/components/docs/docs-layout.tsx`: Layout wrapper for documentation pages

**Configuration:**
- `tsconfig.json`: Base TypeScript config with path alias `@/` → `./src/`
- `vite.config.ts`: Build config with React and Tailwind plugins, path alias
- `vitest.config.ts`: Test runner config, jsdom environment, setupFiles reference
- `components.json`: Component registry metadata (shadcn format)

**Core Logic:**
- `src/registry/default/data-grid/types.ts`: All data grid type definitions
- `src/registry/default/data-grid/data-grid.tsx`: Low-level table rendering (columns, rows, header, resize)
- `src/registry/default/data-grid/data-grid-view.tsx`: High-level wrapper orchestrating all modules
- `src/registry/default/data-grid/apply-data-grid-view.ts`: Pure function for search/filter/sort logic
- `src/registry/default/data-grid/modules/fields/use-data-grid-columns.ts`: Layout state and persistence

**Testing:**
- `src/test-setup.ts`: Vitest configuration and testing-library setup
- `src/**/*.test.ts`: Unit tests using Node's native test runner
- `src/**/*.test.tsx`: Component tests using Vitest + React Testing Library

## Naming Conventions

**Files:**
- Hooks: `use-*.ts` (e.g., `use-data-grid-columns.ts`, `use-debounced-search.ts`)
- Components: PascalCase filename (e.g., `DataGridView.tsx`, `DataGridToolbar.tsx`)
- Utilities: kebab-case filename (e.g., `apply-data-grid-view.ts`, `serialize-column-filters.ts`)
- Tests: `*.test.ts` or `*.test.tsx` suffix

**Directories:**
- Feature modules: kebab-case (e.g., `initial-behavior`, `resize`, `persistence`)
- Component groups: lowercase (e.g., `ui`, `docs`, `cells`)

**Functions/Hooks:**
- Hooks: camelCase with `use` prefix (e.g., `useDataGridColumns`, `useDebouncedSearch`)
- Pure utilities: camelCase verb phrases (e.g., `applyDataGridView`, `compareDataGridSortValues`, `clampColumnWidth`)
- Factory functions: `create*` prefix (e.g., `createCustomFunnel`, `createSerialNumberColumn`)
- Serialization: `serialize*` prefix (e.g., `serializeColumnFilters`, `serializeDataGridSort`)

**Types:**
- PascalCase prefixed with domain (e.g., `DataGridColumn`, `DataGridViewState`, `DataGridSort`)
- Utility types: `*Config`, `*Props`, `*Context` (e.g., `DataGridCellConfig`, `DataGridFunnelContext`)

**Variables:**
- Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_COLUMN_WIDTH`, `MIN_COLUMN_WIDTH`, `SERIAL_NUMBER_COLUMN_ID`)
- State variables: camelCase (e.g., `columnWidths`, `visibleColumnIds`, `pinnedColumnIds`)

## Where to Add New Code

**New Feature Module:**
1. Create directory in `src/registry/default/data-grid/modules/{feature-name}/`
2. Export hook (e.g., `export function useDataGrid{Feature}()`)
3. Export any utilities alongside the hook
4. Add tests as `*.test.ts` or `*.test.tsx` in the same directory
5. Export from module in `src/registry/default/data-grid/index.ts`

**New Column Cell Type:**
1. Add renderer in `src/registry/default/data-grid/modules/cells/render-data-grid-cell.tsx`
2. Add cell type to `DataGridCellType` union in `src/registry/default/data-grid/types.ts`
3. Add `DataGridCellConfig` properties if configuration needed
4. Export cell type component if interactive

**New Toolbar Button/Menu:**
1. Create component in `src/registry/default/data-grid/modules/toolbar/toolbar-{feature}.tsx`
2. Import and add to `DataGridToolbar` in `src/registry/default/data-grid/modules/toolbar/data-grid-toolbar.tsx`
3. Add corresponding handler to DataGridView if state management needed

**New UI Component:**
1. Create in `src/components/ui/{component-name}.tsx`
2. Use Radix UI primitives + Tailwind CSS
3. Export from file; no barrel file for UI components

**New Example:**
1. Create in `src/registry/default/examples/data-grid/{feature}-demo.tsx`
2. Use existing columns from `basic-demo.tsx` or define custom columns
3. Show feature in action with minimal code

**New Documentation Page:**
1. Create in `src/pages/docs/{topic}-page.tsx`
2. Add route in `src/main.tsx` RouterSetup
3. Page wrapped by `DocsLayout` automatically

## Special Directories

**dist/:**
- Purpose: Build output from Vite
- Generated: Yes
- Committed: No (listed in .gitignore)
- Contents: Bundled JavaScript, CSS, and static assets

**.planning/codebase/:**
- Purpose: GSD mapping documents (ARCHITECTURE.md, STRUCTURE.md, etc.)
- Generated: By GSD mapping process
- Committed: Yes
- Contents: Analysis documents for guiding implementation

**node_modules/:**
- Purpose: Installed dependencies
- Generated: Yes
- Committed: No

**public/:**
- Purpose: Static files served as-is by dev server and included in final build
- Generated: No (committed)
- Contents: Component registry files (generated by shadcn build), demo data

## Module Dependency Graph

```
DataGridView (orchestrator)
  ├── useDataGridInitialBehavior → search/sort/filter state
  ├── useDataGridColumns → layout state (fields module)
  │   ├── readDataGridPersistedState (persistence module)
  │   └── writeDataGridPersistedState
  ├── useDebouncedSearch (search module)
  ├── applyDataGridView → filters rows (pure utility)
  │   ├── compareDataGridSortValues (sort module)
  │   └── getDataGridColumnDisplayValue (cells module)
  ├── useDataGridFunnels (filters module)
  │   └── resolveFilterOptions (filters module)
  ├── DataGridToolbar
  │   ├── ToolbarSearch
  │   ├── ToolbarFieldsMenu
  │   ├── ToolbarPinMenu
  │   ├── ToolbarSortMenu
  │   └── ToolbarExportButton → exportDataGridCsv (export module)
  └── DataGrid
      ├── DataGridVirtualizedRows (uses @tanstack/react-virtual)
      ├── renderDataGridCell (cells module)
      ├── useColumnResize (resize module)
      │   └── clampColumnWidth
      └── DataGridFunnelTrigger
```

---

*Structure analysis: 2026-09-10*
