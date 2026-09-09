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
