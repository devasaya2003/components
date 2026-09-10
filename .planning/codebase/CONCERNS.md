# Codebase Concerns

**Analysis Date:** 2026-09-10

## Test Coverage Gaps

### Critical: Large Components Without Tests

**Main Data Grid Component:**
- Issue: `data-grid.tsx` (425 lines) has no test coverage despite being the core rendering engine
- Files: `src/registry/default/data-grid/data-grid.tsx`
- Impact: Column resizing, pinning, virtualization toggle, row click handlers, and skeleton loading states are untested. A regression here breaks the entire grid display.
- Priority: High
- Fix approach: Add comprehensive integration tests covering:
  - Column resize interactions and state persistence
  - Column pinning and offset calculations
  - Virtualization vs. non-virtualized rendering
  - Row click callbacks
  - Empty state and loading state rendering

**Data Grid View Orchestrator:**
- Issue: `data-grid-view.tsx` (298 lines) lacks tests, yet it orchestrates search, filtering, sorting, and persistence
- Files: `src/registry/default/data-grid/data-grid-view.tsx`
- Impact: Server/client search toggle, column visibility, and state persistence logic is untested. Integration between toolbar and grid is fragile.
- Priority: High
- Fix approach: Add tests for:
  - Server vs. client search/filter/sort flow coordination
  - Persistence state hydration and updates
  - Toolbar callback chains
  - View state initialization from storage

**Filter Funnel Component:**
- Issue: `filter-funnel.tsx` (226 lines) has no test coverage despite complex async logic
- Files: `src/registry/default/data-grid/modules/filters/funnels/filter-funnel.tsx`
- Impact: Async filter options loading, debouncing, and draft state management are untested. Race conditions possible with rapid filter opens.
- Priority: High
- Fix approach: Add tests for:
  - Async option loading with error handling
  - Debounce timing (250ms)
  - Draft selection state vs. committed state
  - Select/deselect all toggling

### Medium: UI Components Without Tests

**Toolbar Components (Newly Added):**
- Issue: Recently added toolbar subcomponents lack tests
- Files: 
  - `src/registry/default/data-grid/modules/toolbar/toolbar-export-button.tsx`
  - `src/registry/default/data-grid/modules/toolbar/toolbar-fields-menu.tsx`
  - `src/registry/default/data-grid/modules/toolbar/toolbar-pin-menu.tsx`
  - `src/registry/default/data-grid/modules/toolbar/toolbar-search.tsx`
  - `src/registry/default/data-grid/modules/toolbar/toolbar-sort-menu.tsx`
- Impact: Toolbar features (export, column visibility, search, sort) lack regression protection
- Priority: Medium
- Fix approach: Add component tests for each, especially callback chains

**Cell Rendering Components:**
- Issue: Cell rendering and editing lack tests
- Files:
  - `src/registry/default/data-grid/modules/cells/render-data-grid-cell.tsx`
  - `src/registry/default/data-grid/modules/cells/text-cell-editor.tsx`
- Impact: Cell value display and edit mode are fragile
- Priority: Medium

### Utility Functions Without Tests

**Clamping and File Utilities:**
- Files:
  - `src/registry/default/data-grid/modules/resize/clamp-column-width.ts`
  - `src/registry/default/data-grid/modules/export/download-text-file.ts`
  - `src/registry/default/data-grid/modules/filters/funnels/filter-funnel-virtual-list.tsx`
- Impact: Edge cases in width clamping or file download browser APIs untested
- Priority: Low

## Known Performance Issues

**Column Offset Recalculation:**
- Problem: `pinnedOffsets` Map recalculated on every render in `data-grid.tsx` (lines 173-188)
- Files: `src/registry/default/data-grid/data-grid.tsx`
- Cause: No memoization of the offsets calculation despite depending only on `pinnedColumnIds` and `displayWidths`
- Impact: Negligible for <50 columns, but scales poorly
- Improvement path: Wrap calculation in `useMemo` with `[pinnedColumnIds, displayWidths]`

**Grid Template Columns String Recalculation:**
- Problem: `gridTemplateColumns` string rebuilt on every render
- Files: `src/registry/default/data-grid/data-grid.tsx` (line 190-192)
- Cause: Maps `displayWidths` array to string every render
- Impact: Minimal if column count is stable, but wasteful for large grids
- Improvement path: Memoize the string with `useMemo`

**Sort Value Parsing:**
- Problem: `compareDataGridSortValues` re-parses and re-detects value types for every sort comparison
- Files: `src/registry/default/data-grid/modules/sort/compare-data-grid-sort-values.ts`
- Cause: Multiple `Date.parse()`, regex tests, and numeric parsing per comparison
- Impact: Sorting large datasets (>5000 rows) with mixed types may be slow
- Improvement path: Pre-compute value types in `applyDataGridView` before sort pass

## Fragile Areas

**Async Filter Options Loading:**
- Files: `src/registry/default/data-grid/modules/filters/funnels/filter-funnel.tsx` (lines 54-80)
- Why fragile: Manual `isMounted` flag pattern for race condition avoidance. If component unmounts mid-promise, the state setter doesn't fire (correct), but if user opens filter multiple times rapidly, older promises may resolve after newer ones, causing out-of-order updates.
- Safe modification: Refactor to use `AbortController` for cancellation:
  ```typescript
  const abortControllerRef = useRef<AbortController>(new AbortController());
  useEffect(() => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    // fetch with signal: abortControllerRef.current.signal
  }, [debouncedSearch]);
  ```

**Column Width Controlled vs. Uncontrolled State:**
- Files: `src/registry/default/data-grid/data-grid.tsx` (lines 86-89)
- Why fragile: Dual-mode state (controlled via `controlledColumnWidths` prop or uncontrolled via `setUncontrolledWidths`) requires careful prop passing. If parent accidentally passes undefined instead of explicit widths object, grid flips to uncontrolled mode unexpectedly.
- Safe modification: Consider enforcing one mode per instance, or add PropTypes validation

**LocalStorage Quota Silent Failure:**
- Files: `src/registry/default/data-grid/modules/persistence/use-data-grid-persistence.ts` (lines 133-140)
- Why fragile: `writeDataGridPersistedState` silently swallows localStorage.setItem errors, including quota exceeded. Users don't know their preferences aren't being saved.
- Safe modification: Log quota exceeded errors to console or telemetry:
  ```typescript
  catch (e) {
    if (e instanceof DOMException && e.code === 22) {
      console.warn("localStorage quota exceeded for data-grid state");
    }
  }
  ```

**Filter Option Value Deduplication:**
- Files: `src/registry/default/data-grid/modules/filters/funnels/filter-funnel.tsx` (lines 106-110)
- Why fragile: `toggleSelectAll` uses `new Set()` to deduplicate but doesn't preserve order. If columnOrder matters for display, order is lost.
- Safe modification: Use array-based deduplication or sorted Set

## Scaling Limits

**Virtualization Overscan:**
- Files: `src/registry/default/data-grid/data-grid-virtualized-rows.tsx` (line 36)
- Current setting: `overscan: 12` items
- Concern: Fixed overscan may over-render on mobile (small viewport) or under-render on fast scrolls
- Scaling path: Make overscan responsive to viewport height or scroll speed

**In-Memory Sort on Client:**
- Files: `src/registry/default/data-grid/apply-data-grid-view.ts` (lines 53-79)
- Current: All sort operations happen in-memory after filter, no streaming support
- Limit: Sorting >100k rows client-side becomes blocking
- Scaling path: For large datasets, require server-side sort when `onSortChange` callback provided

**Filter Options Resolution:**
- Files: `src/registry/default/data-grid/modules/filters/use-data-grid-funnels.ts`
- Current: `resolveFilterOptions` scans all rows to build filter options
- Limit: O(n × m) complexity for n rows × m columns with filters
- Scaling path: Provide server-side filter options via async `getFilterOptions` callback

## Security Considerations

**No Input Validation on Column IDs:**
- Issue: Column IDs used as object keys without validation
- Files: 
  - `src/registry/default/data-grid/data-grid.tsx` (line 173-188)
  - `src/registry/default/data-grid/apply-data-grid-view.ts` (lines 42, 55)
- Risk: Malicious column IDs like `"__proto__"` could cause prototype pollution if state serialized/deserialized incorrectly
- Current mitigation: Column IDs are developer-defined, not user input
- Recommendations: Add assertion or validation if column config becomes user-editable

**Unvalidated Async Filter Options:**
- Issue: `getFilterOptions` callback result not validated
- Files: `src/registry/default/data-grid/modules/filters/funnels/filter-funnel.tsx` (line 63)
- Risk: Callback could return malformed data causing UI crashes
- Current mitigation: Error handler catches rejection (line 70) but doesn't validate shape
- Recommendations: Validate `DataGridColumnFilterOption[]` schema on resolution

**Error Handling in Filter Funnel:**
- Issue: Async errors silently caught and ignored
- Files: `src/registry/default/data-grid/modules/filters/funnels/filter-funnel.tsx` (lines 70-75)
- Risk: Filter load failures go unnoticed to user; they see "No options available" without knowing why
- Recommendations: Show error message to user instead of silent fail

## Dependencies at Risk

**React Virtual Pinning Behavior:**
- Package: `@tanstack/react-virtual` ^3.13.25
- Risk: Library's virtualization with CSS `transform: translateY()` may conflict with sticky pinned columns if scroll behavior changes
- Mitigation: Currently works correctly; test on major version upgrades
- Migration plan: If issues arise, consider manual virtualization implementation

**TypeScript 6.0:**
- Package: `typescript ~6.0.2` (early/beta version)
- Risk: Potential breaking changes not yet identified in production
- Mitigation: Monitor TypeScript changelog for data-grid related fixes
- Migration plan: Upgrade cautiously, watch for type narrowing regressions

## Missing Critical Features

**No Error Boundaries:**
- Problem: React error in cell render or funnel callback crashes entire grid
- Impact: User loses access to data table on any child component error
- Blocks: Reliable grid usage in error-prone environments
- Fix approach: Add `ErrorBoundary` wrapper around `DataGrid` and funnel content

**No Loading State for Filter Options:**
- Problem: If `getFilterOptions` is slow, UI shows "Loading options..." but no cancel/timeout
- Impact: User stuck waiting indefinitely if async callback hangs
- Blocks: Reliable async filter integration
- Fix approach: Add configurable timeout (5-10s) that clears async options and shows error

**No Accessibility Testing:**
- Problem: Keyboard navigation, screen reader support not tested
- Files: All grid components
- Impact: Grid inaccessible to keyboard-only or screen reader users
- Blocks: Accessible UI compliance
- Fix approach: Add axe-accessibility tests and keyboard navigation tests

---

*Concerns audit: 2026-09-10*
