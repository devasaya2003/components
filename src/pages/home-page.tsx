import { Link } from "react-router-dom";
import { CodeBlock, PageHeader } from "@/components/docs/page-blocks";

const INSTALL = `npx shadcn@latest add http://localhost:5173/r/data-grid.json`;
const CURL = `curl -sL http://localhost:5173/r/data-grid.json`;
const NAMESPACE = `npx shadcn@latest registry add @1126labs=https://your-host/r/{name}.json
npx shadcn@latest add @1126labs/data-grid`;

export function HomePage() {
  return (
    <div>
      <PageHeader
        title="1126labs components"
        description="Copy-paste React components via the shadcn registry. Start with Data Grid: resize, pin, swap, search, filters, toolbar, and persistent layout."
      />
      <div className="grid gap-6">
        <div>
          <h2 className="mb-2 text-sm font-medium">Install Data Grid</h2>
          <CodeBlock>{INSTALL}</CodeBlock>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-medium">Inspect with curl</h2>
          <CodeBlock>{CURL}</CodeBlock>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-medium">Namespace</h2>
          <CodeBlock>{NAMESPACE}</CodeBlock>
        </div>
        <p className="text-sm">
          Read the{" "}
          <Link className="underline" to="/docs/data-grid">
            Data Grid docs
          </Link>{" "}
          for live examples.
        </p>
      </div>
    </div>
  );
}
