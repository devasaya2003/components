# 1126labs components

Copy-paste React components distributed as a [shadcn](https://ui.shadcn.com/docs/registry) registry. The docs site is Vite + React.

## Data Grid

Install into a project that already has shadcn:

```bash
npx shadcn@latest add https://<your-host>/r/data-grid.json
```

Inspect the payload:

```bash
curl -sL https://<your-host>/r/data-grid.json
```

Namespace:

```bash
npx shadcn@latest registry add @1126labs=https://<your-host>/r/{name}.json
npx shadcn@latest add @1126labs/data-grid
```

## Local development

```bash
npm install
npm run registry:build
npm run dev
```

Docs: [http://localhost:5173](http://localhost:5173)

Registry item: [http://localhost:5173/r/data-grid.json](http://localhost:5173/r/data-grid.json)
