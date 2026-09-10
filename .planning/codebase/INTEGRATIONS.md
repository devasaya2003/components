# External Integrations

**Analysis Date:** 2026-09-10

## Overview

This codebase is a **standalone UI component library** with **no external service integrations**. It contains only:
- Local component development and documentation
- Build tooling and testing infrastructure
- Registry distribution via shadcn CLI

## APIs & External Services

**None detected**

This project does not integrate with any external APIs or services. It is purely a component library focused on UI primitives and the data-grid component system.

## Data Storage

**Databases:**
- Not applicable - no database integration

**File Storage:**
- Local filesystem only (Vite dev server serves from `public/` and `src/`)
- Static file hosting for production (registry artifacts)

**Caching:**
- No caching system configured
- Vite handles browser caching via asset hashing

## Authentication & Identity

**Auth Provider:**
- Not applicable - no authentication required

**Authorization:**
- Not applicable - public component library

## Monitoring & Observability

**Error Tracking:**
- Not integrated - development uses browser console only

**Logs:**
- Console logging only (browser DevTools in development)
- Build output via Vite and npm scripts

## CI/CD & Deployment

**Hosting:**
- Self-hosted static file server required for registry distribution
- Environment variable: Registry base URL (configured by host)

**CI Pipeline:**
- Not detected - no GitHub Actions, GitLab CI, or similar found
- Manual build via `npm run registry:build` and `npm run build`

**Build Output:**
- Registry JSON files: `public/r/data-grid.json`, `public/r/registry.json`
- Vite bundle: `dist/` directory
- Typescript declaration maps: Generated during build

## Environment Configuration

**Environment Variables:**
- No environment variables required for development or production
- No `.env` files present
- No configuration secrets needed

**Configuration Method:**
- All settings are code-based via:
  - `components.json` - shadcn registry configuration
  - `vite.config.ts` - Build configuration
  - `tsconfig.json` - TypeScript configuration

## Registry Distribution

**Registry Hosting:**
- Manual hosting required
- Registry files located at:
  - `public/r/data-grid.json` - Data Grid component registry entry
  - `public/r/registry.json` - Main registry index

**Registry URL Pattern:**
```
https://<your-host>/r/{component-name}.json
```

**Installation Method:**
```bash
# Direct installation
npx shadcn@latest add https://<your-host>/r/data-grid.json

# Namespace installation
npx shadcn@latest registry add @1126labs=https://<your-host>/r/{name}.json
npx shadcn@latest add @1126labs/data-grid
```

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Dependencies & Package Registry

**Package Registry:**
- npm registry (npmjs.org) - Used for all dependencies

**Critical Packages:**
- react@19.2.8 - Core UI framework
- vite@8.2.2 - Build tool
- typescript@6.0.2 - Type checking
- tailwindcss@4.3.3 - CSS framework

**No HTTP Clients Configured:**
- No axios, fetch wrappers, or HTTP client libraries
- No WebSocket libraries
- No external request handling

## Security & Secrets

**Secrets Management:**
- Not applicable - no secrets required

**Credentials:**
- Not applicable - no API keys or tokens needed

**Dependencies with External Calls:**
- None - all dependencies are for frontend UI, testing, and build tooling

---

*Integration audit: 2026-09-10*
