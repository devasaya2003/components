import type { ReactNode } from "react";

export function extractTextFromReactNode(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join(" ").trim();
  }
  if (typeof node === "object" && "props" in node && node.props) {
    const children = (node.props as { children?: ReactNode }).children;
    return extractTextFromReactNode(children);
  }
  return "";
}

export function getColumnLabelString(column: {
  id: string;
  label: ReactNode;
}): string {
  const text = extractTextFromReactNode(column.label).trim();
  return text || column.id;
}
