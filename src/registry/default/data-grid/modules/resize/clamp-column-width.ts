import { MIN_COLUMN_WIDTH } from "../../types";

export function clampColumnWidth(width: number) {
  return Math.max(MIN_COLUMN_WIDTH, Math.round(width));
}
