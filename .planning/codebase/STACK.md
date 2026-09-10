# Technology Stack

**Analysis Date:** 2026-09-10

## Languages

**Primary:**
- TypeScript 6.0.2 - All source code and build tooling
- JavaScript (via TypeScript) - Runtime execution
- JSX/TSX - React component definitions

**Secondary:**
- CSS - Styling via Tailwind CSS
- JSON - Configuration and data files

## Runtime

**Environment:**
- Node.js (implied - required for npm and build tools)

**Package Manager:**
- npm - Dependency management
- Lockfile: `package-lock.json` (version 3, present)

## Frameworks

**Core:**
- React 19.2.8 - UI library and component framework
- React Router 7.9.4 - Client-side routing for documentation site

**Styling:**
- Tailwind CSS 4.3.3 - Utility-first CSS framework
- @tailwindcss/vite 4.3.3 - Vite integration for Tailwind
- class-variance-authority 0.7.1 - Utility for managing component variants

**Component Libraries:**
- Radix UI 1.6.7 - Headless UI primitive components
- shadcn 4.21.0 - Component registry and CLI tool
- Lucide React 1.43.0 - Icon library
- @tanstack/react-virtual 3.13.25 - Virtual scrolling for large datasets

**Fonts:**
- @fontsource-variable/geist 5.3.0 - Geist font family

**Animations:**
- tw-animate-css 1.4.0 - Tailwind CSS animation utilities

**Utilities:**
- cn 0.2.6 - Class name utility for combining Tailwind classes

## Testing

**Framework:**
- Vitest 5.0.0 - Unit and component testing
- tsx 4.21.0 - TypeScript execution for Node.js tests

**Assertion & DOM:**
- @testing-library/react 16.3.3 - React component testing utilities
- @testing-library/jest-dom 7.0.1 - DOM matchers for vitest
- @testing-library/user-event 14.6.7 - User interaction simulation

**Environment:**
- jsdom 29.1.1 - DOM environment for component tests

## Build & Development

**Build Tool:**
- Vite 8.2.2 - Fast build tool and dev server
- @vitejs/plugin-react 6.1.0 - React support for Vite

**Linting:**
- oxlint 1.79.0 - Fast, extensible linter (Rust-based)
  - Plugins: react, typescript, oxc
  - Rules: react/rules-of-hooks (error), react/only-export-components (warn)

## Type Checking

**Compiler:**
- TypeScript 6.0.2 (monorepo mode)
  - Target: ES2023
  - Module resolution: bundler
  - Path aliases: `@/*` → `./src/*`
  - Strict mode: noUnusedLocals, noUnusedParameters enabled

## Configuration Files

**TypeScript:**
- `tsconfig.json` - Root monorepo configuration with project references
- `tsconfig.app.json` - Application compilation settings
- `tsconfig.node.json` - Build tooling compilation settings

**Build:**
- `vite.config.ts` - Vite configuration with React and Tailwind plugins
- `vitest.config.ts` - Vitest configuration with jsdom environment

**Linting:**
- `.oxlintrc.json` - Oxlint rules configuration

**Component Registry:**
- `components.json` - shadcn CLI configuration
  - Style: radix-nova
  - Icon library: lucide
  - CSS: Tailwind with CSS variables
  - Aliases configured for components, utils, ui, lib, hooks

## Npm Scripts

```
npm run dev              # Start Vite dev server
npm run registry:build   # Build shadcn registry
npm run build            # Full build: registry + TypeScript + Vite
npm run lint             # Run oxlint
npm run preview          # Preview production build
npm run test             # Run all tests (tsx node tests + vitest)
npm run test:unit        # Run tsx Node.js tests only
npm run test:components  # Run vitest component tests
```

## Project Structure

**Entry Point:**
- `src/main.tsx` - React application root with routing

**Component Library:**
- `src/components/ui/` - Base UI components from shadcn
- `src/registry/default/data-grid/` - Data Grid component and modules
- `src/registry/default/examples/` - Example implementations

**Documentation:**
- `src/pages/docs/` - Documentation pages
- `src/components/docs/` - Documentation layout components

**Assets:**
- `src/assets/` - Static assets
- `public/` - Public static files

## Platform Requirements

**Development:**
- Node.js (version compatible with npm 3+ lockfile)
- npm (comes with Node.js)

**Browser Support:**
- Modern ES2023-capable browsers (via Vite transpilation)

**Production:**
- Static file hosting (Vite produces static bundle)
- Alternative: Node.js server for SSR (not currently configured)

## Publishing

**Distribution Method:**
- shadcn registry - Components distributed as JSON registry entries
- Registry URL: `https://<host>/r/{name}.json`
- Installation: `npx shadcn@latest add <registry-url>`

---

*Stack analysis: 2026-09-10*
