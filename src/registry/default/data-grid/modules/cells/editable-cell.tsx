"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type EditableCellEditorProps<TValue> = {
  value: TValue;
  commit: (nextValue: TValue) => void;
  cancel: () => void;
};

export function EditableCell<TValue>({
  value,
  onCommit,
  renderEditor,
  renderDisplay,
  className,
}: {
  value: TValue;
  onCommit: (value: TValue) => void;
  /** Any component with its own internal state — input, textarea, select, date picker, etc. Call `commit` to save and close, `cancel` to discard and close. */
  renderEditor: (props: EditableCellEditorProps<TValue>) => ReactNode;
  /** Defaults to rendering `value` as-is. */
  renderDisplay?: (value: TValue) => ReactNode;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);

  function commit(nextValue: TValue) {
    if (nextValue !== value) {
      onCommit(nextValue);
    }
    setEditing(false);
  }

  function cancel() {
    setEditing(false);
  }

  if (editing) {
    return <>{renderEditor({ value, commit, cancel })}</>;
  }

  return (
    <button
      type="button"
      className={cn("w-full text-left", className)}
      onClick={() => setEditing(true)}
    >
      {renderDisplay ? renderDisplay(value) : (value as ReactNode)}
    </button>
  );
}

/** Text-input editor for `EditableCell`'s `renderEditor` — the common case of editing a single line of text. Unstyled beyond layout; pass `className` for appearance. */
export function TextEditorInput({
  value,
  commit,
  cancel,
  className,
}: EditableCellEditorProps<string> & { className?: string }) {
  const [draft, setDraft] = useState(value);

  return (
    <input
      autoFocus
      value={draft}
      onChange={(event) => setDraft(event.currentTarget.value)}
      onBlur={() => commit(draft.trim() ? draft : value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
        }
        if (event.key === "Escape") {
          cancel();
        }
      }}
      className={cn("w-full min-w-0 outline-none", className)}
    />
  );
}
