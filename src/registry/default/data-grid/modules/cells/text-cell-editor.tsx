"use client";

import { useState } from "react";

export function TextCellEditor({
  value,
  onCommit,
}: {
  value: string;
  onCommit: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() {
    const next = draft.trim() ? draft : value;
    if (next !== value) {
      onCommit(next);
    }
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        className="h-7 w-full truncate rounded-sm px-1 text-left text-[13px] hover:bg-muted"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
      >
        {value}
      </button>
    );
  }

  return (
    <input
      autoFocus
      value={draft}
      onChange={(event) => setDraft(event.currentTarget.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
        }
        if (event.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      }}
      className="h-7 w-full min-w-0 rounded-sm bg-background px-1 text-[13px] outline-none ring-1 ring-ring"
    />
  );
}
