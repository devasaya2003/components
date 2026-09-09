"use client";

import { useLayoutEffect, useRef, useState } from "react";

const MIN_GRID_HEIGHT = 320;
const VIEWPORT_BOTTOM_INSET = 24;
const ESTIMATED_GRID_HEIGHT = "calc(100dvh - 12rem)";

export type DataGridViewportLayout = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function useDataGridViewportHeight(enabled = true) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<DataGridViewportLayout | null>(null);

  useLayoutEffect(() => {
    if (!enabled) {
      setLayout(null);
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const updateLayout = () => {
      const rect = sentinel.getBoundingClientRect();
      const nextHeight = Math.max(
        MIN_GRID_HEIGHT,
        window.innerHeight - rect.top - VIEWPORT_BOTTOM_INSET,
      );

      setLayout((current) => {
        const next = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: nextHeight,
        };

        if (
          current &&
          current.top === next.top &&
          current.left === next.left &&
          current.width === next.width &&
          current.height === next.height
        ) {
          return current;
        }

        return next;
      });
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(document.documentElement);

    if (sentinel.parentElement) {
      resizeObserver.observe(sentinel.parentElement);
    }

    window.addEventListener("resize", updateLayout);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [enabled]);

  return {
    sentinelRef,
    layout,
    estimatedHeight: ESTIMATED_GRID_HEIGHT,
  };
}
