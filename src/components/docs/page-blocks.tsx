import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 grid gap-2">
      <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
      <p className="max-w-2xl text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

export function DemoBlock({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description?: string;
  code?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10 grid gap-3">
      <div className="grid gap-1">
        <h2 className="text-lg font-medium">{title}</h2>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-xl border">{children}</div>
      {code ? <CodeBlock>{code}</CodeBlock> : null}
    </section>
  );
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-[13px] leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

export type PropsTableRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export function PropsTable({ rows }: { rows: PropsTableRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
            <th className="px-3 py-2 font-medium">Prop</th>
            <th className="px-3 py-2 font-medium">Type</th>
            <th className="px-3 py-2 font-medium">Default</th>
            <th className="px-3 py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b last:border-b-0">
              <td className="px-3 py-2 align-top font-mono text-xs">
                {row.name}
              </td>
              <td className="px-3 py-2 align-top font-mono text-muted-foreground text-xs">
                {row.type}
              </td>
              <td className="px-3 py-2 align-top font-mono text-muted-foreground text-xs">
                {row.default ?? "—"}
              </td>
              <td className="px-3 py-2 align-top text-muted-foreground text-xs">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
